import { useStore, navigate, type Route } from '../store'

// 子页面共用顶栏：Enge. · 首页 / 工作室 / 实验场 / 简历 · 右侧身份 + 主题/语言按钮
export default function SubTop({ active }: { active: Route }) {
  const lang = useStore((s) => s.lang)
  const toggleLang = useStore((s) => s.toggleLang)
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en)
  const links: { r: Route; label: string }[] = [
    { r: '', label: t('首页', 'Home') },
    { r: 'studio', label: t('工作室', 'Studio') },
    { r: 'lab', label: t('实验场', 'Lab') },
    { r: 'resume', label: t('简历', 'Résumé') },
  ]
  return (
    <header className="show-top">
      <a className="show-brand" href="#/" onClick={(e) => (e.preventDefault(), navigate(''))}>
        Enge.
      </a>
      <nav className="show-nav" aria-label="Pages">
        {links.map((l) => (
          <a
            key={l.r || 'home'}
            href={`#/${l.r}`}
            className={l.r && l.r === active ? 'is-active' : ''}
            onClick={(e) => (e.preventDefault(), navigate(l.r))}
          >
            {l.label}
          </a>
        ))}
      </nav>
      <div className="show-id">
        <span className="show-id-role">{t('应用型 AI AGENT 开发者', 'APPLIED AI AGENT DEVELOPER')}</span>
        <span className="show-id-line">{t('把 AI 想法做成能跑的系统。', 'Turning AI ideas into systems that run.')}</span>
        <div className="show-ctl">
          <button className="show-ctl-btn" onClick={toggleTheme} aria-label="theme">
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <button className="show-ctl-btn" onClick={toggleLang} aria-label="language">
            {lang === 'en' ? '中' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  )
}
