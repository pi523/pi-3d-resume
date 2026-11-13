// 对本地开发站截图：首屏 + 各滚动站点。用法: node tools/shot.mjs [url] [outdir]
import { chromium } from 'playwright'

const url = process.argv[2] || 'http://localhost:5175/'
const outdir = process.argv[3] || '/tmp/shots'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto(url)
// 等模型加载完、LoadingScreen 淡出
await page.waitForTimeout(9000)

const H = await page.evaluate(() => document.body.scrollHeight)
console.log('scrollHeight', H)
const stops = [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.75, 0.9]
for (const p of stops) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round((H - 800) * p))
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `${outdir}/shot-${String(p).replace('.', '_')}.png` })
  console.log('shot', p)
}
await browser.close()
