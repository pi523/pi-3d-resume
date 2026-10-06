// 作品集数据（双语）。5 大板块 → 点击展开作品详情。
// 纯数据驱动：增删板块 / 作品只改本文件，Works.jsx 仅负责渲染。
//
// 板块字段：
//   id        唯一标识（用于 framer layoutId 共享元素动画）
//   no        编号 '01'…'05'
//   title     板块标题
//   tagline   索引行右侧一句话
//   items[]   扁平作品列表：{ name, meta?, tags?, link? }
//             点击 item 弹出全屏详情，可补充可选媒体/文案字段：
//             { image?, video?, year?, desc? }（缺省时媒体用占位、简介回退 meta/标签）
//   groups[]  分组作品（与 items 二选一）：{ heading, items: string[] }
//   awards[]  奖项 chip（可选）
//   footer    底部技术/备注一行（可选）

export interface WorkListItem {
  name: string
  meta?: string
  tags?: string[]
  link?: string
  slug?: string
}

export interface WorkGroup {
  heading: string
  items: string[]
}

export interface WorkSection {
  id: string
  no: string
  title: string
  tagline: string
  items?: WorkListItem[]
  groups?: WorkGroup[]
  awards?: string[]
  footer?: string
}

export interface WorksLang {
  title: string
  closeLabel: string
  openLabel: string
  hint: string
  awardsLabel: string
  visitLabel: string
  detailPlaceholder: string
  phImageLabel: string
  phButtonLabel: string
  countLabel: (n: number) => string
  sections: WorkSection[]
}

export const WORKS: Record<'zh' | 'en', WorksLang> = {
  zh: {
    title: 'Works',
    closeLabel: '返回',
    openLabel: '展开作品',
    hint: '继续下滑',
    awardsLabel: '获奖',
    visitLabel: '访问作品',
    detailPlaceholder: '你的作品介绍',
    phImageLabel: '图片 / 视频',
    phButtonLabel: '跳转按钮',
    countLabel: (n) => `${n} 件作品`,
    sections: [
      {
        id: 'isolid',
        no: '01',
        title: 'iSolid',
        tagline: '一个不让想法烂在你脑子里的督促者',
        items: [
          {
            name: 'iSolid',
            meta: '2026 · 网页应用 · AI 督促者',
            tags: ['LangGraph', 'Claude / GPT', 'Docker'],
            slug: 'isolid',
          },
        ],
      },
      {
        id: 'chain-agent',
        no: '02',
        title: '链上自动化交易 Agent',
        tagline: 'Polygon 上的端到端自主管道——从信号到结算，全程护栏',
        items: [
          {
            name: '自主交易 Agent 系统',
            meta: '2026 · 独立项目 · 链上自动化',
            tags: ['Polygon', '异步守护进程', '风控'],
            slug: 'chain-agent',
          },
        ],
      },
      {
        id: 'cs-ops',
        no: '03',
        title: 'AI 客服运营平台',
        tagline: 'Forward Deployed——把一家企业的运营方法论做成跑在生产里的 AI 工作流',
        items: [
          {
            name: 'AI 客服运营平台',
            meta: '2026 · 项目制合作 · 远程',
            tags: ['Agent Workflow', '系统集成', '生产交付'],
            slug: 'cs-ops',
          },
        ],
      },
      {
        id: 'shieldflow',
        no: '04',
        title: 'ShieldFlow',
        tagline: '多智能体数据分析引擎',
        items: [
          {
            name: 'ShieldFlow',
            meta: '2025 · Multi-Agent · 数据分析',
            tags: ['Docker 沙箱', 'Schema RAG', 'Plotly'],
            slug: 'shieldflow',
          },
        ],
      },
      {
        id: 'aigc',
        no: '05',
        title: 'AIGC 实验场',
        tagline: '自由探索——用 AI 做给孩子看的温馨小片',
        items: [
          {
            name: '儿童温馨短片',
            meta: '2026 · AIGC · 视频生成',
            tags: ['分镜', '角色一致性'],
            slug: 'aigc-film',
          },
        ],
      },
    ],
  },
  en: {
    title: 'Works',
    closeLabel: 'Back',
    openLabel: 'Explore',
    hint: 'Keep scrolling',
    awardsLabel: 'Awards',
    visitLabel: 'Visit site',
    detailPlaceholder: 'Your work description',
    phImageLabel: 'Image / Video',
    phButtonLabel: 'Link button',
    countLabel: (n) => `${n} works`,
    sections: [
      {
        id: 'isolid',
        no: '01',
        title: 'iSolid',
        tagline: "An accountability agent that won't let ideas rot in your head",
        items: [
          {
            name: 'iSolid',
            meta: '2026 · Web app · AI accountability',
            tags: ['LangGraph', 'Claude / GPT', 'Docker'],
            slug: 'isolid',
          },
        ],
      },
      {
        id: 'chain-agent',
        no: '02',
        title: 'On-chain Trading Agent',
        tagline: 'End-to-end autonomous pipeline on Polygon — signal to settlement, guardrails throughout',
        items: [
          {
            name: 'Autonomous Trading Agent System',
            meta: '2026 · Independent project · On-chain automation',
            tags: ['Polygon', 'Async daemons', 'Risk guards'],
            slug: 'chain-agent',
          },
        ],
      },
      {
        id: 'cs-ops',
        no: '03',
        title: 'AI Customer-Ops Platform',
        tagline: "Forward deployed — turning a company's operating playbook into AI workflows running in production",
        items: [
          {
            name: 'AI Customer-Ops Platform',
            meta: '2026 · Project-based · Remote',
            tags: ['Agent workflows', 'Systems integration', 'Production handover'],
            slug: 'cs-ops',
          },
        ],
      },
      {
        id: 'shieldflow',
        no: '04',
        title: 'ShieldFlow',
        tagline: 'Multi-Agent Data Analysis Engine',
        items: [
          {
            name: 'ShieldFlow',
            meta: '2025 · Multi-agent · Data analysis',
            tags: ['Docker sandbox', 'Schema RAG', 'Plotly'],
            slug: 'shieldflow',
          },
        ],
      },
      {
        id: 'aigc',
        no: '05',
        title: 'AIGC Playground',
        tagline: 'Free exploration — warm little films for kids, made with AI',
        items: [
          {
            name: 'A Warm Short for Kids',
            meta: '2026 · AIGC · Video generation',
            tags: ['Storyboard', 'Character consistency'],
            slug: 'aigc-film',
          },
        ],
      },
    ],
  },
}

// 板块配图（横向画廊每张卡片左侧的整高封面）。放到 public/works/covers/ 下。
// 缺图时左栏用大编号渐变占位，放入图片后自动点亮。
export const SECTION_COVERS: Record<string, string> = {
  isolid: `${import.meta.env.BASE_URL}works/covers/isolid.jpg`,
  'chain-agent': `${import.meta.env.BASE_URL}works/covers/chain-agent.jpg`,
  'cs-ops': `${import.meta.env.BASE_URL}works/covers/cs-ops.jpg`,
  shieldflow: `${import.meta.env.BASE_URL}works/covers/shieldflow.jpg`,
  aigc: `${import.meta.env.BASE_URL}works/covers/aigc.jpg`,
}

// 统计一个板块的作品数（items 或 groups 求和），用于索引行 hover 显示
export function sectionCount(section: WorkSection): number {
  if (section.items) return section.items.length
  if (section.groups) return section.groups.reduce((n, g) => n + g.items.length, 0)
  return 0
}
