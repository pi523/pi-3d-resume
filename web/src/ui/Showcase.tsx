import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import FerrofluidBackground from '../scene/FerrofluidBackground'
import { WorkDetail } from './Works'
import { WORKS } from '../data/works'
import type { ShowcasePage } from '../data/showcase'
import { useStore, navigate } from '../store'
import SubTop from './SubTop'

// 子页面「作品放映」布局（工作室 / 实验场共用）：
//   顶栏：Enge. · 首页 / 工作室 / 实验场 · 右侧身份两行
//   题头：左 kicker、中大标题、右两行提示
//   tabs：每件作品一个 pill（编号 + 标签 + 媒体数）
//   舞台：当前作品大封面居中，下一件在右侧露出一角；拖动 / 滚轮 / ← → 切换；点击 = 查看详情 / 播放
//   说明：左下 标签大字 + 一句话；右下 技术小字 + 01 / 04 计数
//   底栏：章节 · 自动播放进度条（悬停暂停）· 查看按钮
const AUTOPLAY_MS = 8000
const EASE = [0.22, 1, 0.36, 1]

export default function Showcase({ page }: { page: ShowcasePage }) {
  const lang = useStore((s) => s.lang)

  const items = page.items
  const count = items.length
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1) // 切换方向：1 向后、-1 向前（决定进出场方向）
  const [ep, setEp] = useState(0) // 当前媒体（剧集）
  const [detail, setDetail] = useState(false)
  const [hover, setHover] = useState(false)
  const [playingVideo, setPlayingVideo] = useState(false)
  const item = items[index]
  const media = item.media[Math.min(ep, item.media.length - 1)]

  const go = useCallback(
    (d: number) => {
      setDir(d)
      setIndex((i) => (i + d + count) % count)
      setEp(0)
      setPlayingVideo(false)
    },
    [count]
  )
  const jump = (i: number) => {
    if (i === index) return
    setDir(i > index ? 1 : -1)
    setIndex(i)
    setEp(0)
    setPlayingVideo(false)
  }

  // 自动轮播：悬停舞台 / 打开详情 / 视频播放中 / 只有一件时暂停
  const paused = hover || detail || playingVideo || count < 2
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (paused) return
    let raf = 0
    const t0 = performance.now() - progress * AUTOPLAY_MS
    const tick = () => {
      const p = (performance.now() - t0) / AUTOPLAY_MS
      if (p >= 1) {
        setProgress(0)
        go(1)
        return
      }
      setProgress(p)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // progress 只在暂停/恢复时作为起点读取，不作为依赖（否则每帧重启）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, index, go])
  useEffect(() => setProgress(0), [index])

  // 键盘：← → 切换，ESC 返回主页（详情打开时 ESC 由详情自己处理）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (detail) return
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Escape') navigate('')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, detail])

  // 滚轮：横向或纵向滚动都切换，节流 700ms
  const wheelLock = useRef(0)
  const onWheel = (e: React.WheelEvent) => {
    if (detail) return
    const now = performance.now()
    if (now - wheelLock.current < 700) return
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    if (Math.abs(d) < 12) return
    wheelLock.current = now
    go(d > 0 ? 1 : -1)
  }
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
  }

  const next = items[(index + 1) % count]
  const data = WORKS[lang]
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en)

  return (
    <div className={`show show-${page.id}`} lang={lang} onWheel={onWheel}>
      {/* 铁磁流体底（独立小画布；主页画布此时已停帧） */}
      <div className="show-bg" aria-hidden="true">
        <Canvas dpr={1} camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: false }}>
          <FerrofluidBackground />
        </Canvas>
      </div>
      <div className="show-veil" aria-hidden="true" />

      {/* 顶栏 */}
      <SubTop active={page.id} />

      {/* 题头 */}
      <div className="show-head">
        <div className="show-kicker">
          <span className="show-kicker-no">{page.no}</span>
          <span>{page.kicker[lang]}</span>
        </div>
        <h1 className="show-title">{page.title[lang]}</h1>
        <div className="show-side">
          <span>{page.side[lang][0]}</span>
          <span>{page.side[lang][1]}</span>
        </div>
      </div>

      {/* tabs */}
      <div className="show-tabs" role="tablist">
        {items.map((it, i) => (
          <button
            key={it.slug}
            role="tab"
            aria-selected={i === index}
            className={`show-tab${i === index ? ' is-active' : ''}`}
            onClick={() => jump(i)}
          >
            <span className="show-tab-no">{String(i + 1).padStart(2, '0')}</span>
            <span className="show-tab-label">{it.label[lang]}</span>
            <span className="show-tab-count">{String(it.media.length).padStart(2, '0')}</span>
          </button>
        ))}
      </div>

      {/* 舞台 */}
      <div
        className="show-stage"
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        {count > 1 && (
          <motion.div
            key={`peek-${next.slug}`}
            className="show-peek"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 0.55, x: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            onClick={() => go(1)}
            aria-hidden="true"
          >
            <img src={next.media[0].poster || next.media[0].src} alt="" />
          </motion.div>
        )}
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={`${item.slug}-${ep}`}
            className="show-main"
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: 80 * d, scale: 0.96 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d: number) => ({ opacity: 0, x: -80 * d, scale: 0.96 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
          >
            {media.type === 'video' ? (
              <video
                key={media.src}
                src={media.src}
                poster={media.poster}
                controls={playingVideo}
                playsInline
                preload="none"
                onPlay={() => setPlayingVideo(true)}
                onPause={() => setPlayingVideo(false)}
                onEnded={() => setPlayingVideo(false)}
                onClick={(e) => {
                  const v = e.currentTarget
                  if (v.paused) v.play()
                }}
              />
            ) : (
              <img src={media.src} alt={item.label.en} draggable={false} onClick={() => setDetail(true)} />
            )}
            <div className="show-main-cap">
              <span className="show-main-cap-l">
                {media.title ? media.title[lang] : item.label[lang]}
                {item.media.length > 1 && ` · EP ${String(ep + 1).padStart(2, '0')}`}
              </span>
              <button className="show-main-cap-r" onClick={() => setDetail(true)}>
                {t('查看', 'VIEW')} <span aria-hidden="true">↗</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 剧集 / 多媒体切换（只在一件作品有多段媒体时出现） */}
      {item.media.length > 1 && (
        <div className="show-eps">
          {item.media.map((m, i) => (
            <button
              key={i}
              className={`show-ep${i === ep ? ' is-active' : ''}`}
              onClick={() => {
                setEp(i)
                setPlayingVideo(false)
              }}
            >
              EP {String(i + 1).padStart(2, '0')}
              {m.title && <span>{m.title[lang]}</span>}
            </button>
          ))}
        </div>
      )}

      {/* 说明行 */}
      <div className="show-cap">
        <div className="show-cap-l">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <h2 className="show-label">
                <span className="show-label-en">{item.label.en}</span>
                <span className="show-label-sep">/</span>
                <span className="show-label-zh">{item.label.zh}</span>
              </h2>
              <p className="show-blurb">{item.blurb[lang]}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="show-cap-r">
          <span className="show-meta">{item.meta}</span>
          <div className="show-counter">
            <span className="show-counter-cur">{String(index + 1).padStart(2, '0')}</span>
            <span className="show-counter-all">/ {String(count).padStart(2, '0')}</span>
          </div>
          <div className="show-counter-bar" aria-hidden="true">
            <span style={{ transform: `scaleX(${(index + 1) / count})` }} />
          </div>
        </div>
      </div>

      {/* 底栏 */}
      <footer className="show-bottom">
        <span className="show-bottom-l">
          {page.no} / {page.id.toUpperCase()} <em>{page.kicker[lang].split('/')[1]?.trim()}</em>
        </span>
        <div className="show-auto" aria-hidden="true">
          <span className="show-auto-fill" style={{ transform: `scaleX(${progress})` }} />
          <span className="show-auto-dot" style={{ left: `${progress * 100}%` }} />
        </div>
        <span className="show-bottom-r">
          {paused ? t('暂停轮播', 'PAUSED') : t('自动轮播', 'AUTOPLAY')}
          {page.intro[lang] && <em> · {page.intro[lang]}</em>}
        </span>
      </footer>

      <AnimatePresence>
        {detail && (
          <WorkDetail
            key={item.slug}
            item={{ name: item.label[lang], slug: item.slug }}
            data={data}
            lang={lang}
            onClose={() => setDetail(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
