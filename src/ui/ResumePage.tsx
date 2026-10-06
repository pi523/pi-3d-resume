import { useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence, motion } from 'framer-motion'
import FerrofluidBackground from '../scene/FerrofluidBackground'
import SubTop from './SubTop'
import { RESUME, type Metric } from '../data/resume'
import { useStore, navigate, type Lang } from '../store'

// 简历页（#/resume）：每段经历是一张票（登机牌 / 入场券）。
//   票面 .tk-main：公司/职位 + 时间·地点·类型 三格；点击"撕开"展开具体工作内容
//   虚线 .tk-perf：两侧半圆缺口由 radial-gradient 背景挖出（票面与存根各挖一半）
//   存根 .tk-stub：条码 + 编号；右侧"座位号"= 这段经历最硬的一个数字
//   hover：3D 倾斜 + 高光扫过（来自 Uiverse 票样式，改成站内配色）
// 头票 .tk-hero 是"通行证"：姓名、头衔、自述、联系方式格、技能、ADMIT ALL
const EASE = [0.22, 1, 0.36, 1]

function Barcode({ code }: { code: string }) {
  // 用编号字符生成条纹宽度，保证每张票的条码不同（纯装饰）
  const bars = [...code].flatMap((ch, i) => {
    const n = ch.charCodeAt(0)
    return [((n + i) % 3) + 1, (n % 2) + 1]
  })
  return (
    <div className="tk-barcode" aria-hidden="true">
      {bars.map((w, i) => (
        <span key={i} style={{ width: w, marginRight: (i % 3) + 1 }} />
      ))}
    </div>
  )
}

function Ticket({
  no,
  tag,
  title,
  sub,
  note,
  cells,
  metric,
  code,
  lang,
  points,
  extra,
}: {
  no: string
  tag: string
  title: string
  sub: string
  note?: string
  cells: { label: string; value: string }[]
  metric: Metric
  code: string
  lang: Lang
  points: string[]
  extra?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en)
  return (
    <motion.div
      className={`tk-wrap${open ? ' is-open' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <article className="tk">
        <button
          className="tk-main"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={title}
        >
          <div className="tk-grid" aria-hidden="true" />
          <div className="tk-content">
            <div className="tk-head">
              <span className="tk-no">{no}</span>
              <span className="tk-tag">{tag}</span>
            </div>
            <h3 className="tk-title">{title}</h3>
            <div className="tk-sub">
              {sub}
              {note && <span className="tk-note">{note}</span>}
            </div>
            <div className="tk-cells">
              {cells.map((c) => (
                <div key={c.label} className="tk-cell">
                  <span className="tk-label">{c.label}</span>
                  <span className="tk-value">{c.value}</span>
                </div>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {open && (
                <motion.ul
                  className="tk-points"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  {points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                  {extra && <li className="tk-extra">{extra}</li>}
                </motion.ul>
              )}
            </AnimatePresence>
            <span className="tk-tear">
              <span className="tk-tear-ico" aria-hidden="true">
                ✂
              </span>
              {open ? t('合上这张票', 'FOLD IT BACK') : t('撕开查看详情', 'TEAR OPEN FOR DETAILS')}
              <span className="tk-tear-arrow" aria-hidden="true">
                {open ? '↑' : '↓'}
              </span>
            </span>
            {/* 打印兜底：屏幕上隐藏，打印时所有票内容都在 */}
            <ul className="tk-points tk-print-points" aria-hidden="true">
              {points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </button>

        <div className="tk-perf" aria-hidden="true">
          <span className="tk-perf-line" />
        </div>

        <div className="tk-stub">
          <div className="tk-stub-l">
            <Barcode code={code} />
            <span className="tk-code">{code}</span>
          </div>
          <div className="tk-stub-r">
            <span className="tk-metric-label">{metric.label[lang]}</span>
            <span className="tk-metric">{metric.value}</span>
          </div>
        </div>
      </article>
    </motion.div>
  )
}

export default function ResumePage() {
  const lang = useStore((s) => s.lang)
  const r = RESUME
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en)
  const code = (prefix: string, i: number) => `${prefix}-${String(i + 1).padStart(2, '0')}-ENGE`

  return (
    <div className="show cv" lang={lang}>
      <div className="show-bg" aria-hidden="true">
        <Canvas dpr={1} camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: false }}>
          <FerrofluidBackground />
        </Canvas>
      </div>
      <div className="show-veil" aria-hidden="true" />

      <SubTop active="resume" />

      <div className="cv-scroll">
        {/* 头票：通行证 */}
        <motion.div
          className="tk-wrap tk-hero-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <article className="tk tk-hero">
            <div className="tk-main is-static">
              <div className="tk-grid" aria-hidden="true" />
              <div className="tk-content">
                <div className="tk-head">
                  <span className="tk-brand">Enge.</span>
                  <span className="tk-tag">{t('通行证 · 2026', 'PASS · 2026')}</span>
                </div>
                <h1 className="tk-name">{r.name[lang]}</h1>
                <div className="tk-role">{r.title[lang]}</div>
                <p className="tk-summary">{r.summary[lang]}</p>
                <div className="tk-cells tk-cells-4">
                  <div className="tk-cell">
                    <span className="tk-label">{t('城市', 'Based in')}</span>
                    <span className="tk-value">{r.location[lang]}</span>
                  </div>
                  <div className="tk-cell">
                    <span className="tk-label">Email</span>
                    <a className="tk-value" href={`mailto:${r.email}`}>
                      {r.email}
                    </a>
                  </div>
                  {r.links.map((l) => (
                    <div key={l.label} className="tk-cell">
                      <span className="tk-label">{l.label}</span>
                      <a className="tk-value" href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.href.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    </div>
                  ))}
                </div>
                <div className="tk-skills">
                  {r.skills.map((g) => (
                    <div key={g.group.en} className="tk-skill">
                      <span className="tk-label">{g.group[lang]}</span>
                      <span className="tk-skill-items">{g.items.join(' · ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="tk-perf" aria-hidden="true">
              <span className="tk-perf-line" />
            </div>
            <div className="tk-stub">
              <div className="tk-stub-l">
                <Barcode code="ENGE-LOU-2026-SG" />
                <span className="tk-code">ENGE-LOU-2026-SG</span>
              </div>
              <div className="tk-stub-m">
                <a className="cv-btn" href={r.pdf} download="LouEnge_CV.pdf">
                  {t('下载 PDF', 'Download PDF')} <span aria-hidden="true">↓</span>
                </a>
                <button className="cv-btn is-ghost" onClick={() => window.print()}>
                  {t('打印', 'Print')}
                </button>
              </div>
              <div className="tk-stub-r">
                <span className="tk-metric-label">{t('通行范围', 'Admit')}</span>
                <span className="tk-metric">ALL</span>
              </div>
            </div>
          </article>
        </motion.div>

        <section className="tk-section">
          <h2 className="tk-h2">
            <span>01</span> {t('经历', 'Experience')}
            <em className="tk-hint">{t('点任意一张票沿虚线撕开，看具体做了什么', 'Click any ticket to tear it open along the perforation')}</em>
          </h2>
          <div className="tk-row">
            {r.experience.map((e, i) => (
              <Ticket
                key={i}
                no={String(i + 1).padStart(2, '0')}
                tag={e.note ? e.note[lang] : t('实习 / 在职', 'INTERN')}
                title={e.org[lang]}
                sub={e.role[lang]}
                cells={[
                  { label: t('时间', 'Period'), value: e.period[lang] },
                  { label: t('地点', 'Where'), value: e.place ? e.place[lang] : '—' },
                ]}
                metric={e.metric}
                code={code('EXP', i)}
                lang={lang}
                points={e.points[lang]}
              />
            ))}
          </div>
        </section>

        <section className="tk-section">
          <h2 className="tk-h2">
            <span>02</span> {t('项目与研究', 'Projects & Research')}
          </h2>
          <div className="tk-row">
            {r.projects.map((p, i) => (
              <Ticket
                key={i}
                no={String(i + 1).padStart(2, '0')}
                tag={t('独立项目', 'PROJECT')}
                title={p.name[lang]}
                sub={p.stack}
                cells={[
                  { label: t('时间', 'Period'), value: p.period[lang] },
                  { label: t('类型', 'Type'), value: t('独立设计与开发', 'Solo build') },
                ]}
                metric={p.metric}
                code={code('PRJ', i)}
                lang={lang}
                points={p.points[lang]}
                extra={
                  p.slug && (
                    <button className="cv-link" onClick={() => navigate('studio')}>
                      {t('去工作室看这件作品 ↗', 'See it in the Studio ↗')}
                    </button>
                  )
                }
              />
            ))}
          </div>
        </section>

        <section className="tk-section">
          <h2 className="tk-h2">
            <span>03</span> {t('教育', 'Education')}
          </h2>
          <div className="tk-row">
            {r.education.map((e, i) => (
              <Ticket
                key={i}
                no={String(i + 1).padStart(2, '0')}
                tag={t('学位', 'DEGREE')}
                title={e.org[lang]}
                sub={e.role[lang]}
                cells={[
                  { label: t('时间', 'Period'), value: e.period[lang] },
                  { label: t('地点', 'Where'), value: e.place ? e.place[lang] : '—' },
                ]}
                metric={e.metric}
                code={code('EDU', i)}
                lang={lang}
                points={e.points[lang]}
              />
            ))}
          </div>
        </section>

        <footer className="cv-foot">
          <span>© 2026 {r.name.en}</span>
          <span>{t('最后更新 2026.10', 'Last updated Oct 2026')}</span>
        </footer>
      </div>
    </div>
  )
}
