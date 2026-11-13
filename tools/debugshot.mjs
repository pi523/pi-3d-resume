// 调试查看器截图。用法: node tools/debugshot.mjs <outPrefix> [cam1] [cam2] ...
import { chromium } from 'playwright'

const [outPrefix, ...cams] = process.argv.slice(2)
const views = cams.length ? cams : ['0,0.6,3.2', '3.2,0.6,0', '0,0.5,1.2']
const browser = await chromium.launch({ args: ['--use-angle=metal'] })
const page = await browser.newPage({ viewport: { width: 900, height: 900 } })
for (let i = 0; i < views.length; i++) {
  await page.goto(`http://localhost:5175/debug.html?cam=${views[i]}`)
  await page.waitForFunction(() => document.title === 'ready', { timeout: 30000 })
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${outPrefix}-${i}.png` })
  console.log('saved', `${outPrefix}-${i}.png`, 'cam', views[i])
}
await browser.close()
