# 新电脑安装步骤

## 1. 工具
- **Node 22**（旧机器用 v22.14.0）：`brew install node@22` 或 nvm。
- **GitHub CLI**：`brew install gh`，然后 `gh auth login`（账号 pi523，选 HTTPS）。部署脚本靠它拿 token。
- **Python 3**（macOS 自带即可，部署脚本用标准库）。
- 可选：**Blender 4.5 LTS**（只在改摸猫动画 `tools/rig-pet.py` 时需要）。

## 2. 拉代码
```bash
git clone https://github.com/pi523/pi-3d-resume.git
cd pi-3d-resume/web && npm install && npm run dev     # http://localhost:5175
```
资产脚本另装：`cd tools && npm install && npx playwright install chromium`。

## 3. 原始素材（不在 git 里）
从 U 盘/网盘解压 `pi-3d-resume-raw-assets.zip` 到仓库根目录，里面是：
- `avatar2-original.glb`（82MB，当前头像原始）、`avatar2-opt.glb`、`avatar-original.glb` / `avatar-opt.glb`（旧真人比例头像）
- `me.glb` / `me2.glb` / `me3.glb`（合并中间产物，me3 = 线上 `web/public/models/me.glb`）
- `aigc-short-film-original.mp4`（短片原片压缩前版本）
- `picture/`（作品截图原图、AI 蓝幕参考图、149MB 短片 mov）

这些只在换头像、重做贴纸、重做短片时用到，平时开发不需要。

## 4. 部署
```bash
cd web && npm run build && python3 scripts/deploy_pages.py
```
推 `main` 源码：`git push`。详见 `CLAUDE.md` 的"部署"一节。

## 5. 旧电脑交出前
- `gh auth logout`；GitHub → Settings → Applications → 撤销 GitHub CLI 授权。
- 确认新电脑 `npm run dev` 能跑、`git log` 能看到最新提交，再抹盘。
