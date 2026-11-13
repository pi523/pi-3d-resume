import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 1150 } })
await page.goto('http://localhost:5175/')
await page.waitForTimeout(9000)
for (const y of [0, 400, 800]) {
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${process.env.OUT}/petscroll-${y}.png` })
}
await browser.close()
