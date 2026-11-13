#!/usr/bin/env python3
"""Assemble a gh-pages branch via the GitHub API, reusing blobs already on main."""
import base64, hashlib, json, os, shutil, subprocess, sys, time, urllib.request

REPO = "pi523/pi-3d-resume"
API = "https://api.github.com"
# gh CLI：优先用 PATH 里的，找不到再退回旧机器的安装位置
GH = shutil.which("gh") or os.path.expanduser("~/.local/gh/bin/gh")
TOKEN = subprocess.check_output([GH, "auth", "token"]).decode().strip()
# dist 相对脚本位置解析（web/scripts/ -> web/dist），不依赖电脑上的绝对路径
DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")

def req(method, path, body=None, retries=10):
    for attempt in range(retries):
        try:
            r = urllib.request.Request(API + path, method=method,
                data=json.dumps(body).encode() if body is not None else None,
                headers={"Authorization": "Bearer " + TOKEN,
                         "Accept": "application/vnd.github+json",
                         "Content-Type": "application/json"})
            with urllib.request.urlopen(r, timeout=180) as resp:
                return json.load(resp)
        except Exception as e:
            print(f"  {method} {path}: attempt {attempt+1} failed: {e}", flush=True)
            time.sleep(min(2 ** attempt, 30))
    sys.exit(f"giving up on {method} {path}")

def upload_blob(payload: dict, retries=10):
    """大请求体经本地网络容易断流；gh CLI 的传输更稳，写临时文件走 --input。"""
    import tempfile
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump(payload, f)
        tmp = f.name
    try:
        for attempt in range(retries):
            p = subprocess.run(
                [GH, "api",
                 f"repos/{REPO}/git/blobs", "--input", tmp, "--jq", ".sha"],
                capture_output=True, text=True)
            if p.returncode == 0:
                return p.stdout.strip()
            print(f"  blob upload attempt {attempt+1} failed: {p.stderr.strip()[:120]}", flush=True)
            time.sleep(min(2 ** attempt, 30))
        sys.exit("giving up on blob upload")
    finally:
        os.unlink(tmp)

def git_blob_sha(data: bytes) -> str:
    return hashlib.sha1(b"blob %d\x00" % len(data) + data).hexdigest()

# Blobs already on the remote, reusable without upload:
#   main 的 public/<path>（资源原件） + 上一版 gh-pages 的 <path>（没变的构建产物）
def branch_blobs(branch):
    try:
        ref = req("GET", f"/repos/{REPO}/git/ref/heads/{branch}")
        commit = req("GET", f"/repos/{REPO}/git/commits/{ref['object']['sha']}")
        tree = req("GET", f"/repos/{REPO}/git/trees/{commit['tree']['sha']}?recursive=1")
        return {t["path"]: t["sha"] for t in tree["tree"] if t["type"] == "blob"}
    except SystemExit:
        raise
    except Exception:
        return {}

existing = branch_blobs("main")  # 仓库根在 pi-3d-resume/，前端资源在 web/public/...
existing.update(branch_blobs("gh-pages"))
print(f"{len(existing)} reusable blobs on remote", flush=True)

tree = []
uploaded = reused = 0
for root, _, files in os.walk(DIST):
    for name in files:
        full = os.path.join(root, name)
        rel = os.path.relpath(full, DIST)
        data = open(full, "rb").read()
        sha = git_blob_sha(data)
        # dist copies of public assets exist on main as "web/public/<rel>"
        # (旧布局是 "public/<rel>"，一并兼容)；没变的构建产物在上一版 gh-pages 的 "<rel>"
        if sha in (existing.get("web/public/" + rel), existing.get("public/" + rel), existing.get(rel)):
            reused += 1
        else:
            print(f"uploading {rel} ({len(data)//1024} KB)", flush=True)
            got = upload_blob({"content": base64.b64encode(data).decode(), "encoding": "base64"})
            assert got == sha, f"sha mismatch for {rel}"
            uploaded += 1
        tree.append({"path": rel, "mode": "100644", "type": "blob", "sha": sha})
print(f"reused {reused}, uploaded {uploaded}", flush=True)

new_tree = req("POST", f"/repos/{REPO}/git/trees", {"tree": tree})
commit = req("POST", f"/repos/{REPO}/git/commits",
             {"message": "Deploy site", "tree": new_tree["sha"], "parents": []})
print("commit:", commit["sha"], flush=True)

# Create or force-update gh-pages ref
try:
    r = urllib.request.Request(API + f"/repos/{REPO}/git/refs", method="POST",
        data=json.dumps({"ref": "refs/heads/gh-pages", "sha": commit["sha"]}).encode(),
        headers={"Authorization": "Bearer " + TOKEN, "Accept": "application/vnd.github+json"})
    urllib.request.urlopen(r, timeout=60)
    print("created gh-pages", flush=True)
except Exception:
    req("PATCH", f"/repos/{REPO}/git/refs/heads/gh-pages", {"sha": commit["sha"], "force": True})
    print("updated gh-pages", flush=True)
