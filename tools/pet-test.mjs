import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 1150 } })
await page.goto('http://localhost:5175/')
await page.waitForTimeout(9000)
// 保持鼠标居中不动，隔半个抚摸周期拍两张 → 差异应集中在手部
await page.mouse.move(640, 400)
await page.waitForTimeout(1000)
await page.screenshot({ path: process.env.OUT + '/pet-a.png' })
await page.waitForTimeout(1100)
await page.screenshot({ path: process.env.OUT + '/pet-b.png' })
await browser.close()
