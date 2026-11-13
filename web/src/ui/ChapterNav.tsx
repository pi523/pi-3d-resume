import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// 章节索引：固定在左下角，离开首屏后淡入（接替淡出的 hero-chrome 角标），
// 样式沿用 hero-meta 的小字 + 字距。当前章节高亮；点击平滑滚到该区块顶部。
// 新增板块只需在这里加一行（selector 指向该 section 的 class）。
type Lang = 'en' | 'zh'
interface Chapter {
  id: string
  selector: string
  label: Record<Lang, string>
}

const CHAPTERS: Chapter[] = [
  { id: 'resume', selector: '.resume', label: { en: 'Résumé', zh: '履历' } },
  { id: 'works', selector: '.works', label: { en: 'Works', zh: '作品' } },
  { id: 'wall', selector: '.wall', label: { en: 'Wall', zh: '留言' } },
  { id: 'contact', selector: '.site-footer', label: { en: 'Contact', zh: '联系' } },
]

export default function ChapterNav({ lang }: { lang: Lang }) {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [240, 460], [0, 1])
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    // 当前章节 = 顶部已越过视口 40% 线的最后一个区块
    const update = () => {
      setVisible(window.scrollY > 300)
      const line = window.innerHeight * 0.4
      let cur: string | null = null
      for (const c of CHAPTERS) {
        const el = document.querySelector(c.selector)
        if (el && el.getBoundingClientRect().top <= line) cur = c.id
      }
      setActive(cur)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const go = (c: Chapter) => {
    const el = document.querySelector(c.selector)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <motion.nav
      className={`chapter-nav${visible ? ' is-on' : ''}`}
      style={{ opacity }}
      lang={lang}
      aria-label={lang === 'zh' ? '章节' : 'Chapters'}
    >
      {CHAPTERS.map((c, i) => (
        <button
          key={c.id}
          className={`chapter-link${active === c.id ? ' is-active' : ''}`}
          onClick={() => go(c)}
        >
          <span className="chapter-no">{String(i + 1).padStart(2, '0')}</span>
          <span className="chapter-label">{c.label[lang]}</span>
        </button>
      ))}
    </motion.nav>
  )
}
