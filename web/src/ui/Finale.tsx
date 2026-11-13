import { useEffect, useRef, useState } from 'react'
import KeyedVideo from './KeyedVideo'

// 结尾一屏：坠落片段（public/clips/fall.mp4，蓝幕抠像叠在铁磁流体上）+ 一句收尾。
// 片段文件不存在时整段不渲染。进入视口才播放。
export default function Finale({ lang }: { lang: 'en' | 'zh' }) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section className="finale" ref={ref}>
      <KeyedVideo src={`${import.meta.env.BASE_URL}clips/fall.mp4`} className="finale-clip" active={inView} />
      <p className="finale-line">{lang === 'zh' ? '就先到这里。' : "That's the tour."}</p>
    </section>
  )
}
