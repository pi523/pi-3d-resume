import { useEffect, useRef, useState, type Ref } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { WORKS, type WorkListItem, type WorksLang } from '../data/works'
import { SHOWCASE, type ShowcasePage } from '../data/showcase'
import { navigate } from '../store'
import KeyedVideo from './KeyedVideo'
import { getWorkDoc } from '../data/workDocs'

const EASE = [0.22, 1, 0.36, 1]

// 两扇门：主页 Works 区只放两个入口卡（工作室 / 实验场），点击进入对应子页面（hash 路由）。
// 卡片里用该页前几件作品的封面叠成一摞，hover 时扇开。
function DoorCard({
  page,
  no,
  title,
  tagline,
  lang,
}: {
  page: ShowcasePage
  no: string
  title: string
  tagline: string
  lang: 'en' | 'zh'
}) {
  const covers = page.items.slice(0, 3).map((it) => it.media[0].poster || it.media[0].src)
  const n = page.items.length
  return (
    <button className="wk-door" onClick={() => navigate(page.id)}>
      <div className="wk-door-head">
        <span className="wk-door-no">{no}</span>
        <h3 className="wk-door-title">{title}</h3>
        <span className="wk-door-tagline">{tagline}</span>
        <span className="wk-door-count">{lang === 'zh' ? `${n} 件作品` : `${n} ${n === 1 ? 'work' : 'works'}`}</span>
      </div>
      <div className="wk-door-stack" aria-hidden="true">
        {covers.map((src, i) => (
          <span key={i} className="wk-door-cover" style={{ ['--i' as string]: i }}>
            <img src={src} alt="" loading="lazy" />
          </span>
        ))}
      </div>
      <div className="wk-door-foot">
        <span className="wk-door-enter">
          {lang === 'zh' ? '进入' : 'Enter'} <span aria-hidden="true">→</span>
        </span>
      </div>
    </button>
  )
}

// 全屏沉浸详情：渲染该作品的 md（banner + 标题 + markdown 正文 + 外链）；
// 无 md 时回退到占位 banner + meta/标签简介
export function WorkDetail({
  item,
  data,
  lang,
  onClose,
}: {
  item: WorkListItem
  data: WorksLang
  lang: 'en' | 'zh'
  onClose: () => void
}) {
  const [bannerError, setBannerError] = useState(false)
  const doc = getWorkDoc(item.slug, lang)
  const title = (doc && doc.title) || item.name
  const banner = doc && doc.banner
  // 有 md 详情时展示完整信息；无 md 时详情页只保留标题 + 统一占位文案
  const link = doc ? doc.link || item.link : null
  const tags = doc ? doc.tags || item.tags : null
  // 副标题：md 的精确时间段（缺省回退列表 meta）+ 角色；标签单独做 badge 展示
  const sub = doc ? [doc.year || item.meta, doc.role].filter(Boolean).join('  ·  ') : ''

  return (
    <>
      <motion.div
        className="wk-detail-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />
      <motion.div
        className="wk-detail"
        initial={{ opacity: 0, scale: 0.985, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.99, y: 6 }}
        transition={{ duration: 0.42, ease: EASE }}
      >
        <button className="wk-detail-close" onClick={onClose} aria-label={data.closeLabel}>
          ✕
        </button>

        {banner && !bannerError ? (
          <div className="wk-detail-banner">
            <img src={banner} alt={title} onError={() => setBannerError(true)} />
          </div>
        ) : (
          <div className="wk-detail-banner is-ph" aria-hidden="true">
            <span className="wk-detail-ph-text">{title}</span>
          </div>
        )}

        <article className="wk-detail-article">
          <header className="wk-detail-head">
            <h3 className="wk-detail-title">{title}</h3>
            {sub && <div className="wk-detail-sub">{sub}</div>}
            {tags && tags.length > 0 && (
              <div className="wk-detail-tags">
                {tags.map((t, i) => (
                  <span key={i} className="wk-badge">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </header>

          {doc && doc.body ? (
            <div className="wk-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {doc.body}
              </ReactMarkdown>
            </div>
          ) : (
            // 无 md：演示详情页支持的组件 —— 介绍文本 + 图片/视频占位 + 跳转按钮
            <>
              <p className="wk-detail-desc">{data.detailPlaceholder}</p>
              <div className="wk-detail-ph-img" aria-hidden="true">
                <span className="wk-detail-ph-img-label">{data.phImageLabel}</span>
              </div>
              <span className="wk-detail-link is-ph" role="button" aria-disabled="true">
                {data.phButtonLabel} <span aria-hidden="true">↗</span>
              </span>
            </>
          )}

          {link && (
            <a
              className="wk-detail-link"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.visitLabel} <span aria-hidden="true">↗</span>
            </a>
          )}
        </article>
      </motion.div>
    </>
  )
}

export default function Works({ lang, innerRef }: { lang: 'en' | 'zh'; innerRef: Ref<HTMLElement> }) {
  const data = WORKS[lang]
  const count = 2

  // 竖滚 pin 转横移：测量整排卡片的实际可横移距离（px），竖滚进度 → 横移
  const galleryRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start start', 'end end'],
  })

  // track 实际宽度 - 视口宽 = 需要横移的距离；随尺寸/语言变化重测
  const [scrollRange, setScrollRange] = useState(0)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => setScrollRange(Math.max(0, el.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [count, lang])

  // px 数值插值（比 vw 字符串更顺）；竖滚行程与横移 1:1
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange])
  // 横移到底时「继续下滑」提示渐隐
  const hintOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0])

  return (
    <section className="works" lang={lang} ref={innerRef}>
      <div
        className="wk-gallery"
        ref={galleryRef}
        style={{ height: `calc(100vh + ${scrollRange}px)` }}
      >
        <div className="wk-gallery-sticky">
          <span className="wk-gallery-title">{data.title}</span>

          <motion.div className="wk-track" ref={trackRef} style={{ x }}>
            <DoorCard
              page={SHOWCASE.studio}
              no="01"
              title={lang === 'zh' ? '工作室' : 'Studio'}
              tagline={lang === 'zh' ? '跑在生产里的 Agent' : 'Agents that run in production'}
              lang={lang}
            />
            <DoorCard
              page={SHOWCASE.lab}
              no="02"
              title={lang === 'zh' ? 'AIGC 实验场' : 'AIGC Lab'}
              tagline={lang === 'zh' ? '短片、短剧和各种生成实验' : 'Films, series and generation experiments'}
              lang={lang}
            />
          </motion.div>

          <div className="wk-progress" aria-hidden="true">
            <motion.div className="wk-progress-fill" style={{ scaleX: scrollYProgress }} />
          </div>
          <motion.span className="wk-hint" style={{ opacity: hintOpacity }} aria-hidden="true">
            {data.hint}
          </motion.span>

          {/* AI 蓝幕片段：她坐着敲电脑（public/clips/desk.mp4），钉在这一屏右下角；文件不存在不渲染 */}
          <KeyedVideo src={`${import.meta.env.BASE_URL}clips/desk.mp4`} className="wk-desk-clip" />
        </div>
      </div>

    </section>
  )
}
