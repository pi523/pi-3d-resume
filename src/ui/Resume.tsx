import { motion } from 'framer-motion'
import { ZooopLogo } from './ZooopLogo'
import { SOCIAL_ICONS } from './SocialIcons'
import { FOCUS_POINTS } from '../data/focusPoints'

// 联系方式（时间轴末尾 + 页脚共用）
export const CONTACT_LINKS = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/pi523' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/enge-lou-b77aa3214' },
  { id: 'mail', label: 'Email', href: 'mailto:monicalou0523@gmail.com' },
]

// 履历数据（双语）。英文为译稿，可按需润色。
interface ResumeGroup {
  heading?: string
  logo?: string
  logoImg?: string
  sub?: string
  link?: string
  items?: string[]
  links?: { id: string; label: string; href: string }[]
}
interface ResumeEntry {
  period: string
  place: string
  role?: string
  logo?: { src: string; alt: string }
  points?: string[]
  groups?: ResumeGroup[]
}
const RESUME: Record<'en' | 'zh', { title: string; entries: ResumeEntry[] }> = {
  en: {
    title: 'Résumé',
    entries: [
      {
        period: 'Aug 2025 – Dec 2026',
        place: 'Nanyang Technological University, Singapore',
        role: 'Master of Science in Artificial Intelligence',
      },
      {
        period: 'Jul 2022 – Jun 2025',
        place: 'B.Eng. Electrical & Electronic Engineering',
        role: 'Specialization: Data Analysis & Machine Learning (Computing & Intelligent Systems)',
        points: [
          'First Class Honours (AY22/23)',
          'Machine Learning Design & Application · AI & Data Mining',
        ],
      },
      {
        period: 'Jan 2026 – May 2026',
        place: 'Desay SV Automotive, Singapore',
        role: 'LLM Applications Engineer Intern',
        points: [
          'Multilingual translation plugin on local LLMs + RAG, deployed internally',
          'Co-authored IEEE-ITSC paper (accepted): runtime safety monitoring for DMS',
          'PRD–UE–UI automated audit system — 95% detection rate in pilot',
          'ROS2 robotic-arm integration + scheduled AI news-digest service',
        ],
      },
      {
        period: 'Aug 2025 – Jan 2026',
        place: 'A*STAR CFAR, Singapore',
        role: 'Junior Scientist I',
        points: [
          'PyTorch pipelines with ESM protein language models for enzyme activity prediction',
          'Reproducible workflows for large, imbalanced datasets',
          '400k+ dataset built with RhoFold for RNA–ligand binding prediction',
        ],
      },
      {
        period: 'May 2025 – Jul 2025',
        place: 'MiraclePlus, Beijing',
        role: 'Brand Marketing & Content Strategy',
        points: [
          'In-depth interviews with 10+ AI founders',
          '5+ research reports — readership up 12%',
          'Built a systematic AI industry-trend research framework',
        ],
      },
    ],
  },
  zh: {
    title: 'Résumé',
    entries: [
      {
        period: 'Aug 2025 – Dec 2026',
        place: '南洋理工大学 · 新加坡',
        role: '人工智能理学硕士',
      },
      {
        period: 'Jul 2022 – Jun 2025',
        place: '电气与电子工程学士',
        role: '专业方向：数据分析与机器学习（计算与智能系统）',
        points: [
          '一等荣誉学位（AY22/23）',
          '机器学习设计与应用 · 人工智能与数据挖掘',
        ],
      },
      {
        period: 'Jan 2026 – May 2026',
        place: '德赛西威 · 新加坡',
        role: 'LLM 应用工程实习生',
        points: [
          '本地 LLM + RAG 多语言翻译插件，已部署内部使用',
          'IEEE-ITSC 论文合著（已录用）：驾驶员监测系统运行时安全监控',
          'PRD–UE–UI 自动审查系统，试点检测率 95%',
          'ROS2 机械臂集成 + 定时 AI 资讯摘要服务',
        ],
      },
      {
        period: 'Aug 2025 – Jan 2026',
        place: 'A*STAR CFAR · 新加坡',
        role: 'Junior Scientist I',
        points: [
          'PyTorch + ESM 蛋白质语言模型管线，预测酶活性',
          '大规模不均衡数据集下的可复现工作流',
          '用 RhoFold 构建 40 万+ RNA–配体结合预测数据集',
        ],
      },
      {
        period: 'May 2025 – Jul 2025',
        place: '奇绩创坛 · 北京',
        role: '品牌营销与内容策略',
        points: [
          '深度访谈 10+ 位 AI 创始人',
          '产出 5+ 篇研究报告，阅读量提升 12%',
          '搭建系统性 AI 行业趋势研究框架',
        ],
      },
    ],
  },
}

// 履历条目依次对应 glb 里的聚焦锚点（相机停靠点），顺序须与 entries 一致。
// 名单是唯一真源，见 data/focusPoints.ts（Scene.tsx 也从那里取）。
const POINT_ORDER = FOCUS_POINTS

const EASE = [0.22, 1, 0.36, 1]
const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
}
const itemV = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
}

function Group({ group }: { group: ResumeGroup }) {
  const heading =
    group.logo === 'zooop' ? (
      <a
        className="zooop-logo-link"
        href={group.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ZOOOP"
      >
        <ZooopLogo className="zooop-logo" animated />
      </a>
    ) : group.link ? (
      <a className="about-link" href={group.link} target="_blank" rel="noopener noreferrer">
        {group.heading}
      </a>
    ) : (
      <span>{group.heading}</span>
    )

  return (
    <motion.div className="tl-group" variants={itemV}>
      <div className="tl-group-head">
        {group.logoImg && (
          <span className="tl-group-logo">
            <img src={group.logoImg} alt={group.heading || ''} loading="lazy" />
          </span>
        )}
        {heading}
        {group.sub && <span className="tl-group-sub">{group.sub}</span>}
      </div>
      {group.items && (
        <ul className="tl-points">
          {group.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )}
      {group.links && (
        <div className="tl-logos">
          {group.links.map((l) => {
            const Icon = SOCIAL_ICONS[l.id as keyof typeof SOCIAL_ICONS]
            return (
              <a
                key={l.id}
                className="tl-logo"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={l.label}
                title={l.label}
              >
                <Icon />
              </a>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

function Entry({ entry, index }: { entry: ResumeEntry; index: number }) {
  return (
    <motion.div
      className="tl-entry"
      data-point={POINT_ORDER[index]}
      variants={containerV}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
    >
      <motion.span className="tl-dot" variants={itemV} aria-hidden="true" />
      {/* tl-body 包住文字内容（点保持在外做时间轴标记）：移动端可给它加卡片衬底，
          且它紧贴内容高度，不含 tl-entry 用于排布的大 padding。
          用普通 div（非 motion）：framer 变体经 React context 穿透它，叶子元素仍是
          tl-entry 的直接 stagger 子级，入场动画与包裹前完全一致。 */}
      <div className="tl-body">
        <motion.div className="tl-period" variants={itemV}>
          {entry.period}
        </motion.div>
        <motion.div className="tl-head" variants={itemV}>
          {entry.logo && (
            <span className="tl-logo-chip">
              <img src={entry.logo.src} alt={entry.logo.alt} loading="lazy" />
            </span>
          )}
          <h3 className="tl-place">{entry.place}</h3>
        </motion.div>
        {entry.role && (
          <motion.div className="tl-role" variants={itemV}>
            {entry.role}
          </motion.div>
        )}
        {entry.points && (
          <motion.ul className="tl-points" variants={itemV}>
            {entry.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </motion.ul>
        )}
        {entry.groups && entry.groups.map((g, i) => <Group key={i} group={g} />)}
      </div>
    </motion.div>
  )
}

export default function Resume({ lang }: { lang: 'en' | 'zh' }) {
  const data = RESUME[lang]
  return (
    <section className="resume" lang={lang}>
      <motion.h2
        className="resume-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {data.title}
      </motion.h2>
      <div className="timeline">
        {data.entries.map((e, i) => (
          <Entry key={i} entry={e} index={i} />
        ))}
      </div>
    </section>
  )
}
