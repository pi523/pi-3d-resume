// 用无头浏览器 canvas 画几张演示贴纸（白底圆角 + emoji，die-cut 风）
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'fs'

const OUT = '../web/public/stickers'
mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage()
const specs = [
  { name: 'bolt', emoji: '⚡', bg: '#fff' },
  { name: 'skull', emoji: '💀', bg: '#fff' },
  { name: 'guitar', emoji: '🎸', bg: '#fff' },
  { name: 'star', emoji: '🌟', bg: '#fff' },
]
for (const s of specs) {
  const dataUrl = await page.evaluate(({ emoji, bg }) => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const x = c.getContext('2d')
    x.fillStyle = bg
    x.beginPath()
    x.roundRect(18, 18, 220, 220, 48)
    x.fill()
    x.font = '150px serif'
    x.textAlign = 'center'
    x.textBaseline = 'middle'
    x.fillText(emoji, 128, 138)
    return c.toDataURL('image/png')
  }, s)
  writeFileSync(`${OUT}/${s.name}.png`, Buffer.from(dataUrl.split(',')[1], 'base64'))
  console.log('saved', s.name)
}
await browser.close()
