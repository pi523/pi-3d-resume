// 在 debug.html 里模拟点击取贴纸坐标。用法: node tools/pick.mjs <cam> <x1,y1> <x2,y2> ...
import { chromium } from 'playwright'

const [cam, ...clicks] = process.argv.slice(2)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 900, height: 900 } })
page.on('console', (m) => m.text().startsWith('STICKER') && console.log(m.text().slice(8)))
await page.goto(`http://localhost:5175/debug.html?cam=${cam}`)
await page.waitForFunction(() => document.title === 'ready', { timeout: 30000 })
for (const c of clicks) {
  const [x, y] = c.split(',').map(Number)
  await page.mouse.click(x, y)
  await page.waitForTimeout(150)
}
await page.screenshot({ path: '/tmp/pick.png' })
await browser.close()
