// 第二批：低多边形骑士(大宝剑哥) + 实习公司 logo 风贴纸（白底圆角 die-cut）
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'fs'

const OUT = '../web/public/stickers'
mkdirSync(OUT, { recursive: true })

// 白底圆角徽章模板
const badge = (inner) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect x="26" y="26" width="460" height="460" rx="84" fill="#fff" stroke="#C9CFD8" stroke-width="7"/>
    ${inner}
  </svg>`

const STICKERS = {
  // 大宝剑哥：低多边形骑士，绿披风黑发，双手拄剑（剑尖朝下）
  'mbti-sword': `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <!-- 白边垫底（近似轮廓） -->
    <g fill="#fff" stroke="#fff" stroke-width="28" stroke-linejoin="round">
      <polygon points="190,88 322,88 330,150 322,210 190,210 182,150"/>
      <polygon points="150,250 190,232 322,232 362,250 392,420 340,440 172,440 120,420"/>
      <polygon points="246,250 266,250 266,440 256,468 246,440"/>
    </g>
    <!-- 披风/身体 -->
    <polygon points="150,250 190,232 322,232 362,250 392,420 340,440 172,440 120,420" fill="#6BA345"/>
    <polygon points="150,250 200,252 182,432 120,420" fill="#578C39"/>
    <polygon points="362,250 312,252 330,432 392,420" fill="#578C39"/>
    <polygon points="200,252 312,252 330,432 182,432" fill="#8FBF60"/>
    <polygon points="216,232 296,232 280,262 232,262" fill="#4E7A31"/>
    <!-- 手臂（袖子） -->
    <polygon points="196,262 236,270 246,318 208,326" fill="#6BA345"/>
    <polygon points="316,262 276,270 266,318 304,326" fill="#6BA345"/>
    <!-- 剑：柄首-握把-护手-剑刃 -->
    <rect x="244" y="248" width="24" height="16" rx="4" fill="#9AA3AD"/>
    <rect x="248" y="262" width="16" height="30" fill="#6B4A2F"/>
    <rect x="214" y="290" width="84" height="14" rx="6" fill="#9AA3AD"/>
    <polygon points="246,304 266,304 262,440 256,468 250,440" fill="#C9D3DE"/>
    <polygon points="256,304 266,304 262,440 256,468" fill="#EDF2F7"/>
    <!-- 手 -->
    <polygon points="232,268 254,272 252,294 230,290" fill="#E8C39E"/>
    <polygon points="280,268 258,272 260,294 282,290" fill="#D9B08C"/>
    <!-- 头发 + 脸 -->
    <polygon points="190,88 322,88 330,150 322,210 296,198 216,198 190,210 182,150" fill="#232323"/>
    <polygon points="256,88 322,88 330,150 322,210 296,198 256,196" fill="#161616"/>
    <polygon points="206,142 306,142 300,234 256,250 212,234" fill="#E8C39E"/>
    <polygon points="256,142 306,142 300,234 256,250" fill="#D9B08C"/>
    <polygon points="206,142 306,142 306,160 206,160" fill="#232323"/>
    <rect x="226" y="184" width="16" height="10" fill="#2B2B2B"/>
    <rect x="268" y="184" width="16" height="10" fill="#2B2B2B"/>
    <rect x="222" y="174" width="24" height="6" fill="#3a3a3a"/>
    <rect x="266" y="174" width="24" height="6" fill="#3a3a3a"/>
    <line x1="242" y1="224" x2="270" y2="224" stroke="#8A5A44" stroke-width="6" stroke-linecap="round"/>
  </svg>`,

  // A*STAR：蓝色手写体 a + 红星
  'astar': badge(`
    <text x="216" y="330" text-anchor="middle" font-family="'Snell Roundhand','Brush Script MT',cursive"
          font-style="italic" font-weight="bold" font-size="330" fill="#003DA5"
          stroke="#003DA5" stroke-width="7">a</text>
    <path d="M352 108 l16 38 41 3 -31 27 10 40 -36 -22 -36 22 10 -40 -31 -27 41 -3 Z" fill="#E4002B"/>
    <text x="256" y="430" text-anchor="middle" font-family="Helvetica,Arial,sans-serif"
          font-weight="bold" font-size="64" fill="#003DA5" stroke="#003DA5" stroke-width="2">A*STAR</text>`),

  // 奇绩创坛：蓝色音量条 + 中文名
  'miracleplus': badge(`
    <g fill="#2D7FF9">
      <rect x="86"  y="200" width="34" height="110" rx="6"/>
      <rect x="134" y="150" width="34" height="160" rx="6"/>
      <rect x="182" y="230" width="34" height="80"  rx="6"/>
      <rect x="230" y="110" width="34" height="200" rx="6"/>
      <rect x="278" y="190" width="34" height="120" rx="6"/>
      <rect x="326" y="140" width="34" height="170" rx="6"/>
      <rect x="374" y="220" width="34" height="90"  rx="6"/>
    </g>
    <text x="256" y="420" text-anchor="middle" font-family="'PingFang SC','Hiragino Sans GB',sans-serif"
          font-weight="900" font-size="78" fill="#3A3A3A">奇绩创坛</text>`),

  // Lobah Play：紫色手柄 + 字标（非官方 logo，通用游戏手柄图形）
  'lobah': badge(`
    <g fill="#6C4DF4">
      <path d="M150 300 c-30 0 -48 -24 -44 -56 l10 -70 c4 -28 26 -46 54 -46 h172 c28 0 50 18 54 46 l10 70 c4 32 -14 56 -44 56 c-22 0 -34 -14 -46 -34 h-120 c-12 20 -24 34 -46 34 z"/>
    </g>
    <rect x="166" y="180" width="18" height="60" rx="5" fill="#fff"/>
    <rect x="145" y="201" width="60" height="18" rx="5" fill="#fff"/>
    <circle cx="320" cy="196" r="11" fill="#fff"/>
    <circle cx="352" cy="222" r="11" fill="#fff"/>
    <circle cx="288" cy="222" r="11" fill="#fff"/>
    <circle cx="320" cy="248" r="11" fill="#fff"/>
    <text x="256" y="392" text-anchor="middle" font-family="Helvetica,Arial,sans-serif"
          font-weight="bold" font-size="84" letter-spacing="3" fill="#6C4DF4">LOBAH</text>
    <text x="256" y="446" text-anchor="middle" font-family="Helvetica,Arial,sans-serif"
          font-weight="bold" font-size="40" letter-spacing="10" fill="#3A3A3A">PLAY</text>`),

  // Desay SV：蓝色字标
  'desaysv': badge(`
    <text x="256" y="290" text-anchor="middle" font-family="Helvetica,Arial,sans-serif"
          font-weight="bold" font-size="96" letter-spacing="2" fill="#005BAC">DESAY</text>
    <rect x="180" y="330" width="152" height="74" rx="14" fill="#005BAC"/>
    <text x="256" y="386" text-anchor="middle" font-family="Helvetica,Arial,sans-serif"
          font-weight="bold" font-size="58" fill="#fff">SV</text>`),
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
