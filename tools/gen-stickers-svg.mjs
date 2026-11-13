// 自定义 SVG 贴纸生成：白色 die-cut 描边 + 透明背景，512px PNG。
// 用法: node tools/gen-stickers-svg.mjs [名字...]  不传名字则全部生成
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'fs'

const OUT = '../web/public/stickers'
mkdirSync(OUT, { recursive: true })

// 每张贴纸一段 512x512 的 SVG。die-cut 白边做法：主轮廓形状先用
// 白色粗描边画一遍垫底，再画正稿。
const STICKERS = {
  // NTU 校徽风格盾牌：红底金边 + NTU 字样 + 原子图案
  'ntu-shield': `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <defs>
      <path id="sh" d="M256 44 L436 102 V252 C436 372 322 442 256 470 C190 442 76 372 76 252 V102 Z"/>
    </defs>
    <use href="#sh" fill="#fff" stroke="#fff" stroke-width="34" stroke-linejoin="round"/>
    <use href="#sh" fill="#C8102E"/>
    <use href="#sh" fill="none" stroke="#F2C94C" stroke-width="9"
         transform="translate(256 257) scale(0.9) translate(-256 -257)"/>
    <text x="256" y="196" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
          font-weight="bold" font-size="96" fill="#F2C94C">NTU</text>
    <g stroke="#F2C94C" stroke-width="9" fill="none">
      <ellipse cx="256" cy="316" rx="88" ry="32"/>
      <ellipse cx="256" cy="316" rx="88" ry="32" transform="rotate(60 256 316)"/>
      <ellipse cx="256" cy="316" rx="88" ry="32" transform="rotate(-60 256 316)"/>
    </g>
    <circle cx="256" cy="316" r="14" fill="#F2C94C"/>
  </svg>`,

  // MBTI 大宝剑哥：小人扛巨剑
  'mbti-sword': `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <defs>
      <g id="sword">
        <path id="blade" d="M0 -250 L24 -184 L24 42 L-24 42 L-24 -184 Z"/>
        <rect id="guard" x="-68" y="42" width="136" height="28" rx="12"/>
        <rect id="grip" x="-14" y="70" width="28" height="92" rx="10"/>
        <circle id="pommel" cx="0" cy="172" r="18"/>
      </g>
    </defs>
    <!-- 白边垫底 -->
    <g transform="translate(340 200) rotate(35)" fill="#fff" stroke="#fff" stroke-width="30" stroke-linejoin="round">
      <use href="#blade"/><use href="#guard"/><use href="#grip"/><use href="#pommel"/>
    </g>
    <circle cx="160" cy="380" r="52" fill="#fff" stroke="#fff" stroke-width="26"/>
    <rect x="128" y="428" width="64" height="60" rx="18" fill="#fff" stroke="#fff" stroke-width="26"/>
    <line x1="176" y1="436" x2="258" y2="318" stroke="#fff" stroke-width="42" stroke-linecap="round"/>
    <line x1="190" y1="440" x2="273" y2="295" stroke="#fff" stroke-width="42" stroke-linecap="round"/>
    <!-- 剑 -->
    <g transform="translate(340 200) rotate(35)">
      <use href="#blade" fill="#C9D3DE"/>
      <path d="M0 -250 L24 -184 L24 42 L0 42 Z" fill="#EAF0F6"/>
      <line x1="0" y1="-200" x2="0" y2="30" stroke="#9AA8B8" stroke-width="6"/>
      <use href="#guard" fill="#F2C14E"/>
      <use href="#grip" fill="#8B5A2B"/>
      <use href="#pommel" fill="#F2C14E"/>
    </g>
    <!-- 小人：大头 + 小身体，双手抓剑柄 -->
    <rect x="128" y="428" width="64" height="60" rx="18" fill="#2B2B33"/>
    <line x1="176" y1="436" x2="258" y2="318" stroke="#FFDFC4" stroke-width="16" stroke-linecap="round"/>
    <line x1="190" y1="440" x2="273" y2="295" stroke="#FFDFC4" stroke-width="16" stroke-linecap="round"/>
    <circle cx="258" cy="318" r="13" fill="#FFDFC4"/>
    <circle cx="273" cy="295" r="13" fill="#FFDFC4"/>
    <circle cx="160" cy="380" r="52" fill="#FFDFC4"/>
    <path d="M108 372 Q112 322 160 322 Q208 322 212 372 Q196 346 160 344 Q124 346 108 372 Z" fill="#3A2A20"/>
    <circle cx="144" cy="386" r="7" fill="#2B2B33"/>
    <circle cx="178" cy="386" r="7" fill="#2B2B33"/>
    <path d="M150 410 Q162 418 176 408" stroke="#2B2B33" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- 文字 -->
    <text x="368" y="452" text-anchor="middle" font-family="'PingFang SC','Hiragino Sans GB',sans-serif"
          font-weight="900" font-size="58" fill="#F2C14E" stroke="#fff" stroke-width="14" paint-order="stroke">大宝剑</text>
  </svg>`,

  // 自动驾驶：小车 + 车顶激光雷达 + 雷达波
  'autodrive': `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <defs>
      <path id="car" d="M74 328 Q74 272 132 264 L178 258 Q222 202 298 202 L338 202 Q400 208 424 262 L444 268 Q462 276 462 302 L462 330 Q462 352 440 352 L96 352 Q74 352 74 328 Z"/>
    </defs>
    <!-- 白边垫底 -->
    <use href="#car" fill="#fff" stroke="#fff" stroke-width="30" stroke-linejoin="round"/>
    <circle cx="156" cy="352" r="46" fill="#fff" stroke="#fff" stroke-width="26"/>
    <circle cx="382" cy="352" r="46" fill="#fff" stroke="#fff" stroke-width="26"/>
    <rect x="238" y="168" width="60" height="34" rx="10" fill="#fff" stroke="#fff" stroke-width="26"/>
    <g stroke="#fff" stroke-width="30" fill="none" stroke-linecap="round">
      <path d="M306 142 A52 52 0 0 1 320 106"/>
      <path d="M330 156 A88 88 0 0 1 354 96"/>
      <path d="M354 170 A124 124 0 0 1 388 86"/>
    </g>
    <!-- 车身 -->
    <use href="#car" fill="#6C4DF6"/>
    <path d="M196 256 Q228 216 296 214 L322 214 Q368 220 390 254 Z" fill="#9BE8FF"/>
    <line x1="286" y1="216" x2="286" y2="256" stroke="#6C4DF6" stroke-width="8"/>
    <rect x="88" y="296" width="30" height="14" rx="7" fill="#FFD34D"/>
    <rect x="428" y="296" width="22" height="12" rx="6" fill="#FF7A6B"/>
    <!-- 车轮 -->
    <circle cx="156" cy="352" r="46" fill="#23232B"/>
    <circle cx="156" cy="352" r="20" fill="#C9D3DE"/>
    <circle cx="382" cy="352" r="46" fill="#23232B"/>
    <circle cx="382" cy="352" r="20" fill="#C9D3DE"/>
    <!-- 激光雷达 + 雷达波 -->
    <rect x="238" y="168" width="60" height="34" rx="10" fill="#23232B"/>
    <rect x="248" y="178" width="40" height="6" rx="3" fill="#57E6FF"/>
    <g stroke="#57E6FF" stroke-width="11" fill="none" stroke-linecap="round">
      <path d="M306 142 A52 52 0 0 1 320 106"/>
      <path d="M330 156 A88 88 0 0 1 354 96"/>
      <path d="M354 170 A124 124 0 0 1 388 86"/>
    </g>
    <!-- 速度线 -->
    <g stroke="#fff" stroke-width="12" stroke-linecap="round">
      <line x1="30" y1="300" x2="62" y2="300"/>
      <line x1="18" y1="332" x2="56" y2="332"/>
    </g>
  </svg>`,
}

const only = process.argv.slice(2)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } })
for (const [name, svg] of Object.entries(STICKERS)) {
  if (only.length && !only.includes(name)) continue
  await page.setContent(
    `<style>*{margin:0}html,body{background:transparent}</style>${svg.replace('<svg ', '<svg width="1024" height="1024" ')}`
  )
  await page.waitForTimeout(120)
  const buf = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: 1024, height: 1024 } })
  writeFileSync(`${OUT}/${name}.png`, buf)
  console.log('saved', name)
}
await browser.close()
