import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { apiEnabled, getWall, postWall, type StickerId, type WallItem } from '../lib/api'

// 贴纸留言墙：访客选一张贴纸 + 昵称 + 一句话，"啪"地贴到墙上（随机角度、错位）。
// 先入库待审，审核通过（#/admin）才出现在墙上。后端没配置时只显示表单占位。
export const STICKER_SET: { id: StickerId; emoji: string; zh: string; en: string }[] = [
  { id: 'cat', emoji: '🐱', zh: '猫', en: 'Cat' },
  { id: 'coffee', emoji: '☕', zh: '咖啡', en: 'Coffee' },
  { id: 'star', emoji: '⭐', zh: '星星', en: 'Star' },
  { id: 'gamepad', emoji: '🎮', zh: '手柄', en: 'Gamepad' },
  { id: 'rocket', emoji: '🚀', zh: '火箭', en: 'Rocket' },
  { id: 'bulb', emoji: '💡', zh: '灵感', en: 'Idea' },
  { id: 'flower', emoji: '🌸', zh: '花', en: 'Flower' },
  { id: 'robot', emoji: '🤖', zh: '机器人', en: 'Robot' },
]
const emojiOf = (id: string) => STICKER_SET.find((s) => s.id === id)?.emoji ?? '⭐'

// 每条留言按 id 得到稳定的随机角度/位移（刷新不变）
const jitter = (id: number) => {
  const r = Math.sin(id * 9301 + 49297) * 233280
  const f = r - Math.floor(r)
  const r2 = Math.sin(id * 7919 + 104729) * 233280
  const f2 = r2 - Math.floor(r2)
  return { rot: (f - 0.5) * 8, dy: (f2 - 0.5) * 14 }
}

const NICK_MAX = 16
const TEXT_MAX = 80

export default function StickerWall({ lang }: { lang: 'en' | 'zh' }) {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en)
  const [items, setItems] = useState<WallItem[]>([])
  const [sticker, setSticker] = useState<StickerId>('cat')
  const [nick, setNick] = useState('')
  const [text, setText] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error' | 'quota'>('idle')

  useEffect(() => {
    if (!apiEnabled) return
    getWall()
      .then((r) => setItems(r.items))
      .catch(() => {})
  }, [])

  const canSend = apiEnabled && nick.trim() && text.trim() && state !== 'sending'
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend) return
    setState('sending')
    try {
      await postWall({ nick: nick.trim(), sticker, text: text.trim() })
      setState('sent')
      setText('')
    } catch (err) {
      setState(String(err).includes('quota') ? 'quota' : 'error')
    }
  }

  const notes = useMemo(() => items.map((it) => ({ ...it, ...jitter(it.id) })), [items])

  return (
    <section className="wall" lang={lang}>
      <div className="wall-head">
        <h2 className="wall-title">{t('留言墙', 'Sticker wall')}</h2>
        <p className="wall-sub">
          {t('挑一张贴纸，留一句话，贴上去。审核后会出现在这面墙上。', 'Pick a sticker, leave a line, stick it on. It shows up here once approved.')}
        </p>
      </div>

      <div className="wall-board">
        {notes.length === 0 && (
          <p className="wall-empty">
            {apiEnabled ? t('还没有人贴过，来贴第一张。', 'Nothing here yet — be the first.') : t('留言墙上线中。', 'Wall coming online.')}
          </p>
        )}
        {notes.map((n, i) => (
          <motion.figure
            key={n.id}
            className="wall-note"
            style={{ ['--rot' as string]: `${n.rot}deg`, ['--dy' as string]: `${n.dy}px` }}
            initial={{ opacity: 0, scale: 0.8, rotate: n.rot - 6 }}
            whileInView={{ opacity: 1, scale: 1, rotate: n.rot }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.45, delay: Math.min(i, 12) * 0.04, type: 'spring', bounce: 0.4 }}
          >
            <span className="wall-note-sticker" aria-hidden="true">
              {emojiOf(n.sticker)}
            </span>
            <blockquote className="wall-note-text">{n.text}</blockquote>
            <figcaption className="wall-note-nick">— {n.nick}</figcaption>
          </motion.figure>
        ))}
      </div>

      <form className="wall-form" onSubmit={submit}>
        <div className="wall-pick" role="radiogroup" aria-label={t('选贴纸', 'Pick a sticker')}>
          {STICKER_SET.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={sticker === s.id}
              className={`wall-pick-btn${sticker === s.id ? ' is-on' : ''}`}
              onClick={() => setSticker(s.id)}
              title={lang === 'zh' ? s.zh : s.en}
            >
              {s.emoji}
            </button>
          ))}
        </div>
        <div className="wall-fields">
          <input
            className="wall-input"
            value={nick}
            maxLength={NICK_MAX}
            placeholder={t('昵称', 'Name')}
            onChange={(e) => setNick(e.target.value)}
            disabled={!apiEnabled}
          />
          <input
            className="wall-input wall-input-text"
            value={text}
            maxLength={TEXT_MAX}
            placeholder={t('说点什么（80 字以内）', 'Say something (80 chars)')}
            onChange={(e) => setText(e.target.value)}
            disabled={!apiEnabled}
          />
          <button className="wall-send" type="submit" disabled={!canSend}>
            {state === 'sending' ? t('贴上去…', 'Sticking…') : t('贴上去', 'Stick it')}
          </button>
        </div>
        <p className="wall-status" aria-live="polite">
          {state === 'sent' && t('收到了，审核后就会出现在墙上。', 'Got it — it will show up once approved.')}
          {state === 'quota' && t('今天贴得够多啦，明天再来。', "That's enough for today — come back tomorrow.")}
          {state === 'error' && t('没贴上，再试一次？', "Didn't stick. Try again?")}
          {!apiEnabled && t('后端还没接上，表单暂时不可用。', 'Backend not connected yet.')}
        </p>
      </form>
    </section>
  )
}
