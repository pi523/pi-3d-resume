#!/usr/bin/env python3
"""Assemble a gh-pages branch via the GitHub API, reusing blobs already on main."""
import base64, hashlib, json, os, subprocess, sys, time, urllib.request

REPO = "pi523/pi-3d-resume"
API = "https://api.github.com"
TOKEN = subprocess.check_output([os.path.expanduser("~/.local/gh/bin/gh"), "auth", "token"]).decode().strip()
DIST = "/Users/sbsai/Desktop/im/pi-3d-resume/web/dist"

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
                [os.path.expanduser("~/.local/gh/bin/gh"), "api",
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

# Map of existing blobs on main: path under public/ -> sha
main_ref = req("GET", f"/repos/{REPO}/git/ref/heads/main")
main_commit = req("GET", f"/repos/{REPO}/git/commits/{main_ref['object']['sha']}")
main_tree = req("GET", f"/repos/{REPO}/git/trees/{main_commit['tree']['sha']}?recursive=1")
existing = {t["path"]: t["sha"] for t in main_tree["tree"] if t["type"] == "blob"}
print(f"main has {len(existing)} blobs", flush=True)

tree = []
uploaded = reused = 0
for root, _, files in os.walk(DIST):
    for name in files:
        full = os.path.join(root, name)
        rel = os.path.relpath(full, DIST)
        data = open(full, "rb").read()
        sha = git_blob_sha(data)
        # dist copies of public assets exist on main as "public/<rel>"
        if existing.get("public/" + rel) == sha or existing.get(rel) == sha:
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
