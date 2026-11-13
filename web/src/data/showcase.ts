// 两个子页面（#/studio 工作室、#/lab AIGC 实验场）的数据。页面组件 ui/Showcase.tsx 只负责渲染。
//
//   items[]    tab 顺序即展示顺序；每件作品：
//     slug      关联 content/works/<slug>.{zh,en}.md（点"查看"打开详情，复用 Works 的详情层）
//     label     左下大标签（英文 / 中文），如 ISOLID / 督促者
//     blurb     标签下一句话
//     meta      右下小字（技术栈等，全大写）
//     media[]   封面或多张/多段媒体。第一项是封面；多项时（如剧集）中间区出现 EP 切换
//       { type: 'image' | 'video', src, poster?, title? }
//   资源放 public/ 下，用 BASE_URL 拼
import type { Lang } from '../store'

export interface ShowcaseMedia {
  type: 'image' | 'video'
  src: string
  poster?: string
  title?: Record<Lang, string>
}

export interface ShowcaseItem {
  slug: string
  label: Record<Lang, string>
  blurb: Record<Lang, string>
  meta: string
  media: ShowcaseMedia[]
}

export interface ShowcasePage {
  id: 'studio' | 'lab'
  no: string
  kicker: Record<Lang, string> // 左上 "03 SELECTED WORKS / 作品预览" 里的文字部分
  title: Record<Lang, string> // 居中大标题
  side: Record<Lang, [string, string]> // 右上两行小字
  intro: Record<Lang, string> // 页底一句话（为空则不显示）
  items: ShowcaseItem[]
}

const B = import.meta.env.BASE_URL

export const SHOWCASE: Record<'studio' | 'lab', ShowcasePage> = {
  studio: {
    id: 'studio',
    no: '02',
    kicker: { en: 'STUDIO / 工作室', zh: 'STUDIO / 工作室' },
    title: { en: 'Things that run.', zh: '跑在生产里的东西' },
    side: {
      en: ['AGENTS · ON-CHAIN · ENTERPRISE', 'SCROLL, DRAG OR ← → '],
      zh: ['AGENT · 链上 · 企业落地', '滚动、拖动或 ← →'],
    },
    intro: {
      en: "Agents I've shipped — not demos. Each one runs somewhere real.",
      zh: '不是 demo，是真的跑在某个地方的 Agent。',
    },
    items: [
      {
        slug: 'isolid',
        label: { en: 'ISOLID', zh: '督促者' },
        blurb: {
          en: 'Turns a vague idea into a PRD, a GTD list, and a nudge that keeps coming back.',
          zh: '把一团模糊的念头变成 PRD、GTD 清单，再定时回来追问进度。',
        },
        meta: 'LANGGRAPH · CLAUDE / GPT · DOCKER',
        media: [{ type: 'image', src: `${B}works/isolid/banner.jpg` }],
      },
      {
        slug: 'chain-agent',
        label: { en: 'ON-CHAIN', zh: '链上交易 Agent' },
        blurb: {
          en: 'Signal → execution → settlement → audit, unattended, with real money on the line.',
          zh: '信号 → 执行 → 结算 → 审计，无人值守，用真钱验证。',
        },
        meta: 'POLYGON · ASYNC DAEMONS · 5 RISK GUARDS',
        media: [{ type: 'image', src: `${B}works/chain-agent/banner.jpg` }],
      },
      {
        slug: 'cs-ops',
        label: { en: 'CUSTOMER-OPS', zh: '客服运营平台' },
        blurb: {
          en: "A company's operating playbook, rebuilt as AI workflows and handed over in production.",
          zh: '把一家企业的运营方法论做成 AI 工作流，交付到生产。',
        },
        meta: 'FORWARD DEPLOYED · INTENT · ESCALATION',
        media: [{ type: 'image', src: `${B}works/cs-ops/banner.jpg` }],
      },
      {
        slug: 'shieldflow',
        label: { en: 'SHIELDFLOW', zh: '多智能体分析引擎' },
        blurb: {
          en: 'Natural language in, Plotly charts out — with every generated line audited and sandboxed.',
          zh: '自然语言进、Plotly 图表出——每行生成代码先审计再进沙箱。',
        },
        meta: 'COORDINATOR · ANALYST · VERIFIER',
        media: [{ type: 'image', src: `${B}works/shieldflow/banner.jpg` }],
      },
    ],
  },
  lab: {
    id: 'lab',
    no: '03',
    kicker: { en: 'AIGC LAB / 实验场', zh: 'AIGC LAB / 实验场' },
    title: { en: 'Now showing.', zh: '正在放映' },
    side: {
      en: ['FILMS · SERIES · EXPERIMENTS', 'CLICK TO PLAY'],
      zh: ['短片 · 短剧 · 实验', '点击播放'],
    },
    intro: {
      en: 'Warm little films and, soon, AI short dramas — made to see where generation holds together and where it breaks.',
      zh: '温馨小片，之后还有 AI 短剧——想看看生成在哪里站得住、在哪里会散。',
    },
    items: [
      {
        slug: 'aigc-film',
        label: { en: 'A WARM SHORT', zh: '儿童温馨短片' },
        blurb: {
          en: 'A fox by the fireplace, 47 seconds. Character, storyboard, visuals and narration — all generated.',
          zh: '壁炉边的小狐狸，47 秒。角色、分镜、画面、旁白全部生成。',
        },
        meta: 'VIDEO GEN · STORYBOARD · CONSISTENCY',
        media: [
          {
            type: 'video',
            src: `${B}works/aigc/short-film.mp4`,
            poster: `${B}works/aigc/poster.jpg`,
            title: { en: 'By the fireplace', zh: '壁炉边' },
          },
        ],
      },
    ],
  },
}
