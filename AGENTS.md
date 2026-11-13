# pi-3d-resume — Enge 的 3D 滚动个人简历站

> 本文件是给 AI 编程助手（Claude Code / Cursor Agent）看的项目说明，`AGENTS.md` 是它的同内容副本。
> 内容来自 2026-08 ~ 2026-11 期间与 Claude 协作积累的笔记。改动项目后请同步更新本文件。
> 用户：Enge（楼恩鸽），GitHub 账号 **pi523**。默认用**中文**交流。

## 目录结构

```
pi-3d-resume/            ← git 仓库根（2026-11-13 从 web/ 提上来的，历史保留）
├── web/                 ← 网站（Vite + React 18 + React Three Fiber 8 + TypeScript）
│   ├── src/             ← 源码（见下文"代码地图"）
│   ├── public/          ← 静态资源：models/me.glb、stickers/、works/、lanyard/、LouEnge_CV.pdf
│   ├── scripts/deploy_pages.py   ← 部署到 GitHub Pages 的脚本
│   └── debug.html       ← 锚点/贴纸调试页（点击模型表面输出贴纸配置行）
├── worker/              ← Cloudflare Worker + D1 后端（访客互动：摸猫计数、贴纸留言墙、审核）
│                           **已搁置、从未部署**。用户 2026-11-13 决定暂不启用，代码保留备用。
├── tools/               ← 资产处理脚本（模型合并、贴纸生成、截图、Blender 绑骨），独立 npm 项目
├── context.md           ← 2026-08 文案源（已填进站点，仅作参考）
└── SETUP.md             ← 新电脑安装步骤
```

不在 git 里的原始素材（原始 glb、短片原片 mov、作品截图原图）在用户的 U 盘/网盘 zip 里，详见 SETUP.md。

## ⚠️ 线上与源码不同步（2026-11-13 记）

线上 `https://pi523.github.io/pi-3d-resume/` 仍是 **2026-10-06 的构建**，上面还挂着摸猫热区和"留言墙上线中"板块。
源码里这两处已在 2026-11-13 取消挂载（见上文"代码地图"），但用户要求**暂不重新部署**。
下次用户在新电脑上要更新网站时，正常 `cd web && npm run build && python3 scripts/deploy_pages.py` 一次即可，
这次改动会随之上线，不需要额外操作。部署成功后请把本节删掉。

## 常用命令

```bash
cd web && npm install && npm run dev      # 开发，默认端口 5175（vite.config 里）
cd web && npm run build                   # tsc -b && vite build → web/dist
cd web && npm run build && python3 scripts/deploy_pages.py   # 部署 GitHub Pages（见"部署"）
cd web && npm run typecheck && npm run lint
cd tools && npm install                   # 资产脚本依赖（gltf-transform、playwright）
```

**测试完不要杀掉 dev server**（用户的浏览器一直开着 localhost 预览）。

## 部署（GitHub Pages）

- 仓库 `pi523/pi-3d-resume`：源码在 `main`，站点在 `gh-pages` 分支（由脚本整棵树重建，无父提交）。线上地址 `https://pi523.github.io/pi-3d-resume/`。
- `web/scripts/deploy_pages.py` 走 GitHub API 组装 gh-pages：对每个 dist 文件算 blob sha，能在 `main` 的 `web/public/<路径>` 或上一版 `gh-pages` 找到同 sha 的就复用，只上传变化的 chunk。需要 `gh auth login`（账号 pi523）。
- 之所以不用 `git push` 推站点：旧电脑网络上行约 200KB/s，`git push` 超过约 5MB 必 408 超时。新电脑网络正常的话也可以直接 `git push` 源码；站点仍建议用脚本。
- vite 配了 `base: './'` 与 `manualChunks` 按库拆包，最大单文件约 2MB（rapier）。
- 注意：Works 的 md 里 banner 路径写死 `/works/...`，Pages 子路径下靠 `base: './'` 和运行时处理，改路由时留意。
- `.github/workflows/` 没提交：原 token 无 `workflow` scope。要用 Actions 需 `gh auth refresh -s workflow`。
- 历史坑：用户的 `pi523.github.io` 仓库曾残留自定义域名 `p1pi.me`（DNS 指向用户自己 VPS 168.144.44.76 的 nginx 主页），会把所有 github.io 链接 301 走。若线上 404 先查这个。

## 代码地图（web/src）

- `main.tsx` Root + **hash 路由**：`#/` 主页（**不能用空 hash**，否则滚回顶部）；`#/studio`、`#/lab` 渲染 `ui/Showcase.tsx`（覆盖层 z99，主页保持挂载、Canvas `frameloop='never'`）；`#/resume` → `ui/ResumePage.tsx`；`#/admin` → `ui/AdminPage.tsx`（搁置功能）。
- `store.ts`：theme（dark/light）/ lang（zh 默认 / en）/ route，持久化 localStorage。
- `scene/Scene.tsx`：3D 主场景。滚动驱动 glb 内 CameraAction 相机动画，锚点 `focus-0..5` + `focus-works`。包含：贴纸投影、摸猫动画播放、转头跟随鼠标（followGroup）、GradientBackground（朋克黑 top #221430 / bottom #0a0a10）、Bloom 阈值按主题（light 0.99/0.3）。用 `SkeletonUtils.clone`（普通 clone 不重绑蒙皮会丢变换）。
- `data/stickers.ts` 贴纸配置（img/p/n/size/roll）；`data/showcase.ts` 工作室/实验场内容（items/media，多段 media = 剧集 EP 切换）；`data/resume.ts` 简历页双语数据（metric/place/stack，与 `public/LouEnge_CV.pdf` 同源）。
- `content/works/<slug>.zh.md` / `<slug>.en.md`：作品详情，`getWorkDoc(slug, lang)` 取用，无分语言版回退 `<slug>.md`。frontmatter 有 `banner:` `year:`。
- `ui/`：`Resume.tsx`（主页履历 + 页脚 `CONTACT_LINKS`）、`Lanyard.tsx` + `lanyardCard.ts`（React Bits 工牌，卡面由 canvas 运行时生成，双语，切语言 `key={lang}` 重挂）、`Showcase.tsx`、`ResumePage.tsx`（登机牌/票据样式简历，点击"撕开"）、`SubTop.tsx`（子页共用顶栏）、`ChapterNav.tsx`（左下磨砂章节索引）、`LangToggle` / `.theme-toggle`、`FerrofluidBackground`（铁磁流体背景，按主题缓动颜色）、`NoiseOverlay`、`DoorCard`（Works 区两扇门：工作室 / 实验场）、`Finale.tsx`、`KeyedVideo.tsx`（WebGL 蓝幕抠像 #0000FF，视频 404 时不渲染；`public/clips/` 目前没有视频）。
- 搁置的访客互动前端：`ui/CatHotspot.tsx`、`ui/StickerWall.tsx` **已从 App.tsx 取消挂载**（import 与 JSX 注释掉了，启用时恢复两行即可）；`lib/api.ts`（`VITE_API_BASE` 为空则接口调用静默关闭）、`ui/AdminPage.tsx`（`#/admin` 路由仍在，但无后端时只显示未配置）、`scene/catTrack.ts`。
- `styles.css`：颜色全部走 CSS 令牌 `--ink-rgb / --bg-rgb / --accent(-rgb) / --panel-rgb`，`:root[data-theme='light']` 覆盖（浅色 accent #c2561e、底 #f3efe8）。浅色下 `.scrim` / `.glass-rail` 只罩文字列。

## 用户已定的设计决策（不要反着改）

- **不换字体、不换铁磁流体背景**。标题字体 Mansalva，中文手写楷书 Ma Shan Zheng（Google Fonts，CJK 需 `fonts.load` 带样本文本）。
- 首屏头衔：「应用型 AI Agent 开发者 / 南洋理工大学 AI 硕士」（**不写 Lobah**）。
- Vector Future 的客服项目写成「AI 客服运营平台（客户项目）」，**不写公司名**，客户绝对量不写，只留「−60% 响应时间」。
- 贴纸全贴脸颊、每边 3 张、**额头不贴**。当前：右脸 NTU + Lobah + 奇绩(下) + 骑士，左脸 Desay + 小车 + A*STAR。`stickers/lobah.png` 是生成的通用手柄徽章，非官方 logo。
- 已否决：Highlights 数字墙（已删）、贴纸收集玩法、「30 分钟做游戏」视频。
- 2026-11-13 搁置：摸猫计数、贴纸留言墙、审核页（worker 后端）。换新电脑后用户可能再考虑。
- 用户想要但未做：昼夜切换 ✅ 已做；作品放映页 ✅ 已做（Showcase）；人物眼神跟鼠标（转头已做，眼珠未做）；按板块动作变化（建议 AI 蓝幕视频叠加，参考图 `picture/ai-ref/avatar-front-16x9.png` 在素材包里）；问猫 Agent 对话（需模型 key）；Coffee chat 票（cal.com）；Notes、Life 板块（等素材）。ShieldFlow 无真实截图，封面/banner 是生成的设计图，有真图再换。

## 3D 资产管线与大坑

- 人物模型 `web/public/models/me.glb`（7MB，= 原 me3.glb）：原版 sen-me.glb 场景 + 用户 Q 版头像 avatar2（抱白猫）合并，参数 `rotY=0 scale=1.9 ty=-1.32 tz=0.06`，合并脚本 `tools/merge.mjs <sen-me.glb> <avatar> <out> rotY scale ty tz`（网格可能靠节点旋转站立，脚本做四元数复合，勿覆盖旋转）。镜头全围绕头部，策略是"头对齐"（脸对齐 focus-0 = man 本地 y0.49）。
- 压缩：原始 82MB → gltf-transform simplify 0.1 + 2048 webp → 5MB。
- **贴纸（DecalGeometry）大坑**：人物是单张蒙皮网格 SkinnedMesh，DecalGeometry 不算骨骼 → 直接投影为空/错位。必须先 `applyBoneTransform` 把顶点烘焙成世界空间静态网格，对烘焙网格 raycast + 投影，再 `applyMatrix4(manNode 逆矩阵)` 挂回 manNode（Scene.tsx 已实现）。贴纸 mesh 用 `userData.isSticker` 跳过 castShadow 遍历。脸上贴纸 size ≤ 0.055，避开眼睛（眼区 y≈0.40–0.47，脸颊 y0.27–0.37），x>0.25 被鬓角挡。
- **贴纸洗白坑**：场景总光强 >3，ACES 下 logo 颜色被冲淡 → 材质 `onBeforeCompile` 把 outgoingLight 钳到 `min(光照结果, diffuseColor*1.25)`。白底徽章加 #C9CFD8 描边。
- 贴纸图生成：`tools/gen-stickers-svg.mjs`（只跑 autodrive，其余是废稿勿全量跑）、`gen-stickers-svg2.mjs`（mbti-sword/astar/miracleplus/desaysv/lobah），输出 1024px（512 会糊）。NTU 盾徽源图 `public/stickers/ntu-crest-src.png`。
- 摸猫动画：Blender 4.5 LTS 无头脚本 `tools/rig-pet.py` 自动绑骨 + K 帧（参数在脚本顶部），产出带动画的 glb。程序化 shader 版（Scene.tsx 的 PET 常量）观感差已停用。
- Lanyard 工牌：`.lanyard-overlay` 全屏 fixed z=11；卡片靠 Band 物理组 offsetX=-2.4 停在人物左侧（相机 x 偏移无效）；宽屏相机 [0,0,15]，<768px 居中 [0,0,20]；滚动 vh*0.15→0.45 淡出，滚过 0.45 加 `.is-off` 并 CSS `pointer-events:none !important`（r3f Canvas 内联 `pointer-events:auto` 会击穿父层）。依赖 meshline@3.3.1、@react-three/rapier@1.5.0（**必须 v1，v2 要 fiber9**）。
- 工具：`tools/shot.mjs` 整站滚动截图、`tools/debugshot.mjs` + `web/debug.html` 锚点可视化、`tools/pick.mjs` 程序化点击、`tools/slices.mjs` 体型切片。headless 截图加 `--use-angle=metal`，否则织带消失（伪问题）。
- 视频：短片 `public/works/aigc/short-film.mp4` 4.8MB（原 149MB mov 在素材包）。macOS 无 ffmpeg 时用 `avconvert`，封面帧 `qlmanage -t`，裁切 `sips`。

## 搁置的后端（worker/）

Cloudflare Worker + D1，wrangler 3。接口 `/api/pet`、`/api/wall`、`/api/admin/*`；IP 只存加盐哈希，每 IP 每日配额。启用步骤写在 `worker/wrangler.toml` 顶部注释。启用后在 `web/.env.production` 写 `VITE_API_BASE=...`（该文件未进 git）。
