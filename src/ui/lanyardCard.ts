// 运行时用 canvas 生成工牌贴图：卡片正面（About 文案）、背面、织带。
// 与站点视觉一致：墨色底 + 米白文字 + 橙色点缀，发丝框 + 四角 “+” 呼应 hero-chrome。

type Lang = 'en' | 'zh'

const INK = '#f4f1ea'
const ACCENT = '#ffd9b3'
// 中文用站酷小薇（用户选定的艺术体）；未加载到时退回站点常规中文字体
const ZH_FONT = "'ZCOOL XiaoWei', 'Chiron GoRound TC', 'PingFang SC', 'Microsoft YaHei', sans-serif"

const CARD_W = 1024
const CARD_H = 1440

const TEXT = {
  en: {
    title: 'About Enge',
    paragraphs: [
      "I'm Enge Lou — an applied AI agent developer who loves turning AI ideas into systems that actually run.",
      "I believe AI's value isn't in the demo — it's in the moment it runs in production and solves a real problem.",
    ],
    cue: 'SCROLL DOWN',
  },
  zh: {
    title: 'About Enge',
    paragraphs: [
      '我是楼恩鸽——一个喜欢把 AI 想法做成能跑的系统的应用型 AI Agent 开发者。',
      '相信 AI 的价值不在 demo 里，而在真正跑在生产环境、解决实际问题的那一刻。',
    ],
    cue: '向下滚动',
  },
}

// 等 webfont 就绪再画布上绘字；CJK 分包字体需带上实际文本触发按需加载
async function ensureFonts(lang: Lang) {
  const t = TEXT[lang]
  const sample = t.title + t.paragraphs.join('') + t.cue + 'Enge Code Art Play'
  try {
    await Promise.all([
      document.fonts.load('400 120px Mansalva', 'About Enge'),
      document.fonts.load("600 46px 'Cormorant Upright'", sample),
      document.fonts.load("400 42px 'ZCOOL XiaoWei'", sample),
    ])
    await document.fonts.ready
  } catch {
    /* 字体加载失败时退回系统字体 */
  }
}

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  return { canvas, ctx }
}

// 墨色渐变底 + 发丝内框 + 四角 “+”
function drawCardBase(ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, 0, CARD_H)
  g.addColorStop(0, '#151c2b')
  g.addColorStop(1, '#0a0e16')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, CARD_W, CARD_H)

  const m = 64
  ctx.strokeStyle = 'rgba(244, 241, 234, 0.16)'
  ctx.lineWidth = 2
  ctx.strokeRect(m, m, CARD_W - m * 2, CARD_H - m * 2)

  ctx.strokeStyle = 'rgba(244, 241, 234, 0.4)'
  const arm = 16
  for (const [cx, cy] of [
    [m, m],
    [CARD_W - m, m],
    [m, CARD_H - m],
    [CARD_W - m, CARD_H - m],
  ]) {
    ctx.beginPath()
    ctx.moveTo(cx - arm, cy)
    ctx.lineTo(cx + arm, cy)
    ctx.moveTo(cx, cy - arm)
    ctx.lineTo(cx, cy + arm)
    ctx.stroke()
  }
}

// 居中绘制带字距的一行字（canvas 无 letter-spacing，逐字排）
function drawSpaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  spacing: number
) {
  const chars = [...text]
  const widths = chars.map((c) => ctx.measureText(c).width)
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1)
  let x = cx - total / 2
  ctx.save()
  ctx.textAlign = 'left'
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], x, y)
    x += widths[i] + spacing
  }
  ctx.restore()
}

// 自动换行：拉丁词整词不拆，CJK 按字断行
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const tokens = text.match(/[A-Za-z0-9''.,!?;:—–-]+\s*|\s+|./g) ?? [text]
  const lines: string[] = []
  let line = ''
  for (const token of tokens) {
    const test = line + token
    if (line && ctx.measureText(test.trimEnd()).width > maxWidth) {
      lines.push(line.trimEnd())
      line = token.trimStart()
    } else {
      line = test
    }
  }
  if (line.trim()) lines.push(line.trimEnd())
  return lines
}

// 卡片正面：标题 + 两段简介 + 向下滚动提示
function drawFront(lang: Lang): string {
  const { canvas, ctx } = makeCanvas(CARD_W, CARD_H)
  const t = TEXT[lang]
  drawCardBase(ctx)

  const cx = CARD_W / 2
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // 顶部小字
  ctx.fillStyle = 'rgba(244, 241, 234, 0.5)'
  ctx.font = "500 30px 'Helvetica Neue', sans-serif"
  drawSpaced(ctx, 'PORTFOLIO — 2026', cx, 172, 9)

  // 标题
  ctx.fillStyle = INK
  ctx.font = '400 136px Mansalva, cursive'
  ctx.fillText(t.title, cx, 425)

  // 橙色分隔线
  ctx.fillStyle = ACCENT
  ctx.fillRect(cx - 50, 482, 100, 5)

  // 正文
  ctx.fillStyle = 'rgba(244, 241, 234, 0.92)'
  const isZh = lang === 'zh'
  ctx.font = isZh ? `400 55px ${ZH_FONT}` : "600 52px 'Cormorant Upright', serif"
  const lineHeight = isZh ? 94 : 74
  const maxWidth = CARD_W - 64 * 2 - 72
  let y = 618
  for (const p of t.paragraphs) {
    for (const line of wrapText(ctx, p, maxWidth)) {
      ctx.fillText(line, cx, y)
      y += lineHeight
    }
    y += 38
  }

  // 底部滚动提示 + 向下箭头
  ctx.fillStyle = ACCENT
  ctx.font = isZh ? `400 48px ${ZH_FONT}` : "500 36px 'Helvetica Neue', sans-serif"
  drawSpaced(ctx, t.cue, cx, 1242, 14)
  ctx.strokeStyle = ACCENT
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  for (const dy of [0, 30]) {
    ctx.beginPath()
    ctx.moveTo(cx - 19, 1278 + dy)
    ctx.lineTo(cx, 1295 + dy)
    ctx.lineTo(cx + 19, 1278 + dy)
    ctx.stroke()
  }

  return canvas.toDataURL('image/png')
}

// 卡片背面：签名 + 标语，呼应 hero 角标
function drawBack(): string {
  const { canvas, ctx } = makeCanvas(CARD_W, CARD_H)
  drawCardBase(ctx)

  const cx = CARD_W / 2
  ctx.textAlign = 'center'

  ctx.fillStyle = INK
  ctx.font = '400 200px Mansalva, cursive'
  ctx.fillText('Enge', cx, 700)
  ctx.fillStyle = ACCENT
  ctx.beginPath()
  ctx.arc(cx + 218, 692, 12, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(244, 241, 234, 0.55)'
  ctx.font = "500 30px 'Helvetica Neue', sans-serif"
  drawSpaced(ctx, 'CODE · ART · PLAY', cx, 810, 8)

  ctx.fillStyle = 'rgba(244, 241, 234, 0.38)'
  ctx.font = "500 24px 'Helvetica Neue', sans-serif"
  drawSpaced(ctx, 'BASED IN SINGAPORE', cx, 1266, 7)

  return canvas.toDataURL('image/png')
}

// 织带：深底 + 重复的 “ENGE ◆”
function drawBand(): string {
  const { canvas, ctx } = makeCanvas(1024, 256)
  ctx.fillStyle = '#10151f'
  ctx.fillRect(0, 0, 1024, 256)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = INK
  ctx.font = '400 108px Mansalva, cursive'
  ctx.fillText('Enge', 512, 136)

  ctx.fillStyle = ACCENT
  for (const x of [192, 832]) {
    ctx.save()
    ctx.translate(x, 128)
    ctx.rotate(Math.PI / 4)
    ctx.fillRect(-11, -11, 22, 22)
    ctx.restore()
  }

  return canvas.toDataURL('image/png')
}

export interface LanyardImages {
  front: string
  back: string
  band: string
}

export async function makeLanyardImages(lang: Lang): Promise<LanyardImages> {
  await ensureFonts(lang)
  return { front: drawFront(lang), back: drawBack(), band: drawBand() }
}
