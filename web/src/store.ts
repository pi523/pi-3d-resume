import { create } from 'zustand'

export type Theme = 'dark' | 'light'
export type Lang = 'en' | 'zh'

// 语言：默认中文，切换后记在 localStorage（主页与子页面共用）
const LANG_KEY = 'enge-lang'
function loadLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY)
    if (v === 'en' || v === 'zh') return v
  } catch {
    /* ignore */
  }
  return 'zh'
}

// 路由：hash 路由（GitHub Pages 无需配置、后退可用）。'' = 主页，'studio' / 'lab' = 子页面
export type Route = '' | 'studio' | 'lab' | 'resume' | 'admin'
export function readRoute(): Route {
  const h = location.hash.replace(/^#\/?/, '').split(/[?/]/)[0]
  return h === 'studio' || h === 'lab' || h === 'resume' || h === 'admin' ? h : ''
}
export function navigate(r: Route) {
  // 主页用 '#/' 而不是空 hash：空 hash 会让浏览器滚回顶部，丢掉返回时的滚动位置
  location.hash = `/${r}`
}

// 主题：默认深色（站点本色）；用户切换后记在 localStorage。
// 应用方式是 <html data-theme>，CSS 令牌在 styles.css 的 :root / [data-theme='light'] 里；
// 3D 侧（铁磁流体底色、作品区蒙层）从 store 读 theme 自行换色。
const THEME_KEY = 'enge-theme'
function loadTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* 隐私模式等情况下 localStorage 不可用 */
  }
  return 'dark'
}
function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t
  try {
    localStorage.setItem(THEME_KEY, t)
  } catch {
    /* ignore */
  }
}

// 全站交互状态：当前展开的领域 / 悬停的领域 / 是否已进入 / 主题
interface StoreState {
  active: string | null // 当前展开的 domain id（null = 总览）
  hovered: string | null // 悬停的 domain id
  entered: boolean // 是否已通过入场
  theme: Theme
  lang: Lang
  route: Route
  setLang: (l: Lang) => void
  toggleLang: () => void
  setRoute: (r: Route) => void
  setActive: (id: string | null) => void
  setHovered: (id: string | null) => void
  enter: () => void
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

const initialTheme = loadTheme()
applyTheme(initialTheme)

export const useStore = create<StoreState>((set, get) => ({
  active: null,
  hovered: null,
  entered: false,
  theme: initialTheme,
  lang: loadLang(),
  route: readRoute(),
  setLang: (l) => {
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {
      /* ignore */
    }
    set({ lang: l })
  },
  toggleLang: () => get().setLang(get().lang === 'en' ? 'zh' : 'en'),
  setRoute: (r) => set({ route: r }),
  setActive: (id) => set({ active: id }),
  setHovered: (id) => set({ hovered: id }),
  enter: () => set({ entered: true }),
  setTheme: (t) => {
    applyTheme(t)
    set({ theme: t })
  },
  toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
}))

// 开发期调试钩子：可在 console 用 __store.getState().setActive('ads')
declare global {
  interface Window {
    __store?: typeof useStore
  }
}
if (import.meta.env.DEV) window.__store = useStore

// hash 变化 → store.route（点击内部链接、浏览器前进后退都走这里）
window.addEventListener('hashchange', () => useStore.getState().setRoute(readRoute()))
