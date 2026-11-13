// 简历页（#/resume）数据：与 ~/Desktop/LouEnge_CV.pdf 同源，双语。改简历只改这里。
// 注意：Vector Future 那段按用户决定不写公司名（站内统一口径：项目制合作、不写客户绝对量）。
import type { Lang } from '../store'

type T = Record<Lang, string>

// 票面右下角的"座位号"：这段经历最硬的一个数字 + 一句标签
export interface Metric {
  value: string
  label: T
}

export interface ResumeEntry {
  org: T
  role: T
  period: T
  place?: T // 票面"地点"格
  note?: T // 括注，如 "Part-time, Project-based"
  metric: Metric
  points: Record<Lang, string[]>
}

export interface ResumeProject {
  name: T
  period: T
  slug?: string // 关联作品详情（可点进工作室对应页）
  stack: string // 票面"技术栈"格
  metric: Metric
  points: Record<Lang, string[]>
}

export interface ResumeData {
  name: T
  title: T
  location: T
  email: string
  links: { label: string; href: string }[]
  summary: T
  education: ResumeEntry[]
  experience: ResumeEntry[]
  projects: ResumeProject[]
  skills: { group: T; items: string[] }[]
  pdf: string
}

const B = import.meta.env.BASE_URL

export const RESUME: ResumeData = {
  name: { en: 'Enge Lou', zh: '楼恩鸽' },
  title: { en: 'Applied AI Agent Developer', zh: '应用型 AI Agent 开发者' },
  location: { en: 'Singapore', zh: '新加坡' },
  email: 'monicalou0523@gmail.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/pi523' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/enge-lou-b77aa3214' },
  ],
  summary: {
    en: "I build AI agents that run in production — not demos. MSc AI at NTU, currently building an agent-driven game production pipeline at Lobah Play.",
    zh: '我做跑在生产环境里的 AI Agent，而不是 demo。南洋理工大学 AI 硕士在读，目前在 Lobah Play 搭建 Agent 驱动的游戏生产管线。',
  },
  education: [
    {
      org: { en: 'Nanyang Technological University, Singapore', zh: '南洋理工大学 · 新加坡' },
      role: { en: 'Master of Science in Artificial Intelligence', zh: '人工智能理学硕士' },
      period: { en: 'Aug 2025 – Dec 2026', zh: '2025.08 – 2026.12' },
      place: { en: 'Singapore', zh: '新加坡' },
      metric: { value: '2026', label: { en: 'Graduating Dec', zh: '12 月毕业' } },
      points: {
        en: ['Relevant modules: Multi-Agent Systems · Generative AI · Time Series Analysis · Large Language Models'],
        zh: ['相关课程：多智能体系统 · 生成式 AI · 时间序列分析 · 大语言模型'],
      },
    },
    {
      org: { en: 'Nanyang Technological University, Singapore', zh: '南洋理工大学 · 新加坡' },
      role: {
        en: 'B.Eng. Electrical & Electronic Engineering',
        zh: '电气与电子工程学士',
      },
      period: { en: 'Jul 2022 – Jun 2025', zh: '2022.07 – 2025.06' },
      place: { en: 'Singapore', zh: '新加坡' },
      metric: { value: '4.25', label: { en: 'CGPA / 5 · First Class', zh: 'CGPA / 5 · 一等荣誉' } },
      points: {
        en: [
          'CGPA 4.25 / 5.00 · First Class Honours',
          'Specialisation: Data Analysis & Machine Learning (Computing & Intelligent Systems)',
          'Relevant modules: Machine Learning Design & Application · Artificial Intelligence & Data Mining',
        ],
        zh: [
          'CGPA 4.25 / 5.00 · 一等荣誉',
          '专业方向：数据分析与机器学习（计算与智能系统）',
          '相关课程：机器学习设计与应用 · 人工智能与数据挖掘',
        ],
      },
    },
  ],
  experience: [
    {
      org: { en: 'Lobah Play, Singapore', zh: 'Lobah Play · 新加坡' },
      role: { en: 'AI Research Engineer Intern', zh: 'AI Research Engineer 实习生' },
      period: { en: 'Aug 2026 – Present', zh: '2026.08 – 至今' },
      place: { en: 'Singapore', zh: '新加坡' },
      metric: { value: '3×', label: { en: 'Game throughput', zh: '游戏产能' } },
      points: {
        en: [
          'Translate requirements from the business team and end users into mobile game deliverables, owning each title from spec to delivery.',
          'Built "Dark Factory", an agent-driven game production pipeline that raised throughput from 4–5 games per week to 4–5 games every 2–3 days; now extending it toward unattended 24/7 operation.',
        ],
        zh: [
          '把业务团队与玩家的需求转成手游交付物，每款游戏从需求到上线全程负责。',
          '搭建 Agent 驱动的游戏生产管线「Dark Factory」，产能从每周 4–5 款提升到每 2–3 天 4–5 款；正在推进 24/7 无人值守运行。',
        ],
      },
    },
    {
      org: { en: 'AI customer-operations platform (client project)', zh: 'AI 客服运营平台（客户项目）' },
      role: { en: 'Forward Deployed AI Engineer', zh: 'Forward Deployed AI Engineer' },
      period: { en: 'Apr 2026 – Jul 2026', zh: '2026.04 – 2026.07' },
      note: { en: 'Part-time · Project-based', zh: '兼职 · 项目制' },
      place: { en: 'Remote', zh: '远程' },
      metric: { value: '−60%', label: { en: 'Response time', zh: '客服响应时间' } },
      points: {
        en: [
          'Worked with the client team in an iterative co-delivery model: scoped requirements, prototyped workflows, delivered through production handover.',
          "Translated the client's operating methodology into AI workflows for customer profiling, intent detection, product recommendations, after-sales support and human escalation; integrated WeChat, CRM, order, logistics, coupon and internal data systems.",
          'After handover to the customer-operations team, average response time dropped by about 60%.',
        ],
        zh: [
          '以迭代共交付的方式与客户团队协作：梳理需求、原型验证、交付到生产并完成移交。',
          '把客户的运营方法论拆成客户画像、意图识别、商品推荐、售后支持、人工升级五条 AI 工作流；接入微信、CRM、订单、物流、优惠券及内部数据系统。',
          '平台移交客服运营团队后，平均响应时间缩短约 60%。',
        ],
      },
    },
    {
      org: { en: 'Desay SV Automotive, Singapore', zh: '德赛西威 · 新加坡' },
      role: { en: 'LLM Applications Engineer Intern', zh: 'LLM 应用工程实习生' },
      period: { en: 'Jan 2026 – May 2026', zh: '2026.01 – 2026.05' },
      place: { en: 'Singapore', zh: '新加坡' },
      metric: { value: '95%', label: { en: 'Audit detection · IEEE-ITSC paper', zh: '审查检测率 · IEEE-ITSC 论文' } },
      points: {
        en: [
          'Built and deployed an internal multilingual translation plugin (text and PDF; ZH/EN/JA/ES/DE) on locally-deployed LLMs with a RAG-enhanced knowledge base for terminology consistency.',
          'Built a PRD–UX–UI consistency audit system with the product and design departments; evaluated OpenCV, YOLOv8, OCR and LLM approaches; pilot reached 95% inconsistency detection with a roadmap for automated QA.',
          'Co-authored "Structured Runtime Safe Monitoring for Camera-Based Driver Monitoring Systems", accepted at IEEE-ITSC 2026: designed the core algorithm framework, ran experiments, co-wrote the manuscript.',
          'Integrated OpenClaw with ROS2 and Gazebo to prototype LLM-driven robotic-arm control; validated the first-phase command loop in simulation.',
          'Built a scheduled LLM news-digest service for internal technology-trend tracking.',
        ],
        zh: [
          '基于本地部署的 LLM + RAG 知识库构建并部署内部多语言翻译插件（文本与 PDF，中英日西德），保证术语一致。',
          '与产品、设计部门共建 PRD–UX–UI 一致性审查系统，评估 OpenCV、YOLOv8、OCR 与 LLM 方案，试点检测率 95%，并给出自动化 QA 路线图。',
          '合著论文《Structured Runtime Safe Monitoring for Camera-Based Driver Monitoring Systems》，IEEE-ITSC 2026 录用：设计核心算法框架、完成实验、共同撰写。',
          '集成 OpenClaw + ROS2 + Gazebo，做 LLM 驱动的机械臂控制原型，在仿真中验证第一阶段指令闭环。',
          '搭建定时 LLM 资讯摘要服务，自动追踪内部技术趋势。',
        ],
      },
    },
    {
      org: { en: 'A*STAR CFAR, Singapore', zh: 'A*STAR CFAR · 新加坡' },
      role: { en: 'Junior Scientist I', zh: 'Junior Scientist I' },
      period: { en: 'Aug 2025 – Jan 2026', zh: '2025.08 – 2026.01' },
      place: { en: 'Singapore', zh: '新加坡' },
      metric: { value: '400k+', label: { en: 'RNA–ligand records', zh: 'RNA–配体数据集' } },
      points: {
        en: [
          'Built PyTorch pipelines using ESM protein language models for enzyme-activity prediction on large, imbalanced datasets.',
          'Automated 3D structure generation with RhoFold and API-based sequence retrieval to construct a 400k+ record dataset for RNA–ligand binding prediction; maintained reproducible preprocessing, training and inference workflows.',
        ],
        zh: [
          '基于 ESM 蛋白质语言模型搭建 PyTorch 管线，在大规模不均衡数据集上预测酶活性。',
          '用 RhoFold 自动生成 3D 结构、通过 API 检索序列，构建 40 万+ 条 RNA–配体结合预测数据集；维护可复现的预处理、训练与推理流程。',
        ],
      },
    },
    {
      org: { en: 'MiraclePlus, Beijing', zh: '奇绩创坛 · 北京' },
      role: { en: 'Brand Marketing & Content Strategy', zh: '品牌营销与内容策略' },
      period: { en: 'May 2025 – Jul 2025', zh: '2025.05 – 2025.07' },
      place: { en: 'Beijing', zh: '北京' },
      metric: { value: '10+', label: { en: 'Founder interviews', zh: '创始人访谈' } },
      points: {
        en: [
          'In-depth interviews with 10+ AI founders on product strategy, positioning, technical roadmap and team building.',
          '5+ research reports supporting brand marketing and platform content — readership up 12%; built a systematic AI industry-trend research framework.',
        ],
        zh: [
          '深度访谈 10+ 位 AI 创始人，覆盖产品策略、市场定位、技术路线与团队建设。',
          '产出 5+ 篇研究报告支持品牌营销与平台内容，阅读量提升 12%；搭建系统性 AI 行业趋势研究框架。',
        ],
      },
    },
  ],
  projects: [
    {
      name: { en: 'iSolid — AI-Powered Idea Structuring System', zh: 'iSolid — AI 想法结构化系统' },
      period: { en: 'May 2026 – Aug 2026', zh: '2026.05 – 2026.08' },
      slug: 'isolid',
      stack: 'LangGraph · Claude / GPT · Docker',
      metric: { value: '50', label: { en: 'Closed-beta users', zh: '闭测用户' } },
      points: {
        en: [
          'Built and shipped a full-stack agent product that turns vague ideas into production-ready PRDs, GTD lists and automated accountability pings; closed beta with 50 early-access users, focused on structured-output reliability.',
          'Three-graph LangGraph system (intake → finalize → monitor) with state isolation and dynamic node routing; tiered LLM dispatch (Claude Sonnet 4.6 & GPT-5.5) balancing reasoning quality and cost.',
          'Multi-layer Pydantic validation unifying structured data across providers for zero-crash model fallback; prompt-injection defences at the system-message level across all inference sites.',
          'Deployed on a VPS via Docker Compose + Nginx; reverse proxy tuned for 30–300 s LLM streaming; lightweight i18n with server-side persistence.',
        ],
        zh: [
          '独立完成并上线的全栈 Agent 产品：把模糊想法变成可落地的 PRD、GTD 清单和定时督促；50 位早期用户闭测，重点打磨结构化输出可靠性。',
          'LangGraph 三图系统（intake → finalize → monitor），状态隔离与动态路由；Claude Sonnet 4.6 与 GPT-5.5 分层调度，平衡推理质量与成本。',
          '多层 Pydantic 校验统一各家模型的结构化输出，实现零崩溃模型回退；在所有推理入口的系统提示层做提示注入防御。',
          'Docker Compose + Nginx 部署到 VPS，反向代理针对 30–300 秒 LLM 流式输出调优；轻量 i18n 并服务端持久化。',
        ],
      },
    },
    {
      name: { en: 'On-Chain Automated Trading Engine', zh: '链上自动化交易引擎' },
      period: { en: 'Jul 2026 – Present', zh: '2026.07 – 至今' },
      slug: 'chain-agent',
      stack: 'Polygon · Async daemons · RPC failover',
      metric: { value: '62%', label: { en: 'Directional win rate', zh: '方向胜率' } },
      points: {
        en: [
          'Autonomous end-to-end trading system driven by 3 asynchronous daemons (Signal → Execution → Settlement → Audit); 26 active positions across multiple accounts with 8-second end-to-end signal latency.',
          'Multi-layer risk framework filtering every signal through 5 guards — 62% directional win rate on early settled positions.',
          'Fault-tolerant execution with multi-node RPC failover (zero downtime); independent P&L reconciliation recomputing equity from on-chain state, automating settlement and redemption.',
        ],
        zh: [
          '3 个异步守护进程驱动的端到端自主交易系统（信号 → 执行 → 结算 → 审计）；跨账户管理 26 个活跃持仓，端到端信号延迟 8 秒。',
          '多层风控框架，每个信号过 5 道守卫——早期已结算仓位方向胜率 62%。',
          '多节点 RPC 容灾的执行层（零停机）；独立盈亏对账层直接从链上状态重算权益，自动结算与赎回。',
        ],
      },
    },
    {
      name: { en: 'ShieldFlow — Multi-Agent Data Analysis Engine', zh: 'ShieldFlow — 多智能体数据分析引擎' },
      period: { en: 'Aug 2025 – Jan 2026', zh: '2025.08 – 2026.01' },
      slug: 'shieldflow',
      stack: 'AST audit · Docker sandbox · Schema RAG',
      metric: { value: '3', label: { en: 'Agents, one engine', zh: '个 Agent 协作' } },
      points: {
        en: [
          'Autonomous Coordinator–Analyst–Verifier engine converting natural language into interactive Plotly visualizations, with a self-correction loop that refines generated code on execution errors.',
          'Secure execution stack: AST-based static auditing + network-isolated Docker sandbox; Schema RAG (ChromaDB) injecting column metadata to reduce mapping errors; SQLite persistence for multi-turn memory and cost observability.',
        ],
        zh: [
          'Coordinator–Analyst–Verifier 自主引擎，自然语言转交互式 Plotly 图表；执行报错触发自我修正循环。',
          '安全执行栈：AST 静态审计 + 网络隔离 Docker 沙箱；Schema RAG（ChromaDB）注入列元数据减少映射错误；SQLite 持久化多轮记忆与成本观测。',
        ],
      },
    },
  ],
  skills: [
    {
      group: { en: 'Languages', zh: '语言' },
      items: ['English (proficient)', 'Chinese (native)'],
    },
    {
      group: { en: 'Technical', zh: '技术' },
      items: ['Python (LangGraph, LiteLLM, FastAPI, PyTorch)', 'SQL', 'Java', 'Docker Compose', 'Nginx', 'Linux'],
    },
    {
      group: { en: 'Agentic AI & LLMs', zh: 'Agent 与 LLM' },
      items: [
        'Multi-Agent Workflows',
        'Schema RAG',
        'Vector Embeddings (ChromaDB)',
        'Structured Output & Validation',
        'LLM Evals',
        'Prompt Injection Defence',
        'Cost & Latency Observability',
      ],
    },
    {
      group: { en: 'AI Methods', zh: 'AI 方法' },
      items: ['Time Series Analysis', 'Computer Vision (YOLOv8, OpenCV)', 'Self-Attention', 'Transfer Learning', 'Data Augmentation'],
    },
  ],
  pdf: `${B}LouEnge_CV.pdf`,
}
