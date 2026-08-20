// 作品详情内容规范：每个作品一个 markdown 文件，放在 src/content/works/<slug>.md
//
// frontmatter（--- 之间）字段（均可选）：
//   title   标题（缺省回退列表里的作品名）
//   banner  顶部 banner 图路径（如 /works/guqin/banner.jpg；缺省用渐变占位）
//   year    年份
//   role    角色 / 担当
//   tags    标签数组：[互动项目, 虎啸奖]
//   link    外链（“访问作品”按钮）
// 正文（frontmatter 之后）写 markdown：文字 / 图 ![](...) / 视频 <video src=...>。
//
// 资源（图/视频）放到 public/works/ 下，用 /works/... 绝对路径引用。
// 列表（works.ts 的 item）通过 `slug` 关联到此处的 md；没有 slug 的 item 仍走占位详情。

export interface WorkDoc {
  slug: string
  title?: string
  banner?: string
  year?: string
  role?: string
  tags?: string[]
  link?: string
  body: string
}

// 构建期把全部 md 作为原始字符串内联进来
const files = import.meta.glob('../content/works/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// 极简 frontmatter 解析（key: value，数组用 [a, b]）——避免引入依赖 Buffer 的库
function parseFrontmatter(raw: string): {
  data: Record<string, string | string[]>
  body: string
} {
  const m = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw)
  if (!m) return { data: {}, body: raw }
  const data: Record<string, string | string[]> = {}
  for (const line of m[1].split('\n')) {
    const mm = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line.trim())
    if (!mm) continue
    const rawVal = mm[2].trim()
    let val: string | string[]
    if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
      val = rawVal
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    } else {
      val = rawVal.replace(/^['"]|['"]$/g, '')
    }
    data[mm[1]] = val
  }
  return { data, body: m[2].trim() }
}

// md 里约定用 /works/... 根绝对路径引用资源；站点可能部署在子路径（如 GitHub Pages
// 的 /pi-3d-resume/），加载时统一改写为相对 BASE_URL 的路径（// 开头的协议相对地址不动）
const BASE = import.meta.env.BASE_URL
const rebaseBody = (body: string) =>
  body
    .replace(/\b(src|poster|href)="\/(?!\/)/g, `$1="${BASE}`)
    .replace(/\]\(\/(?!\/)/g, `](${BASE}`)
const rebaseUrl = (u?: string) => (u && u.startsWith('/') && !u.startsWith('//') ? BASE + u.slice(1) : u)

const docs: Record<string, WorkDoc> = {}
for (const path in files) {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  const { data, body } = parseFrontmatter(files[path])
  const doc = { slug, ...data, body: rebaseBody(body) } as WorkDoc
  doc.banner = rebaseUrl(doc.banner)
  docs[slug] = doc
}

// 语言分版：<slug>.zh.md / <slug>.en.md 按站点语言取用；没有分版时回退 <slug>.md
export function getWorkDoc(slug?: string, lang?: 'zh' | 'en'): WorkDoc | null {
  if (!slug) return null
  return (lang && docs[`${slug}.${lang}`]) || docs[slug] || null
}
