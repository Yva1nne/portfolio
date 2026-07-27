export const profile = {
  name: '叶奕含',
  direction: 'AI / DATABASE PRODUCT MANAGER',
  edition: 'Portfolio · 2026',
  headline: '从问题出发，做 AI 产品。',
  introduction: [
    '我享受从复杂、抽象的问题里拆出清晰的用户任务、业务链路和产品方案。能写 Prompt、画原型，也会借助 AI Coding 做出可运行原型，让判断进入真实交互。',
    '我习惯先定义问题、拆解场景，再决定哪些交给模型，哪些由确定性流程和数据约束。AI 能力最终需要对应清晰的用户任务与产品边界。',
  ],
  meta: [
    { label: 'EDUCATION', value: '浙江大学 · 电子信息硕士（预计 2027.06）' },
    { label: 'BASE', value: '杭州' },
    { label: 'EMAIL', value: 'yhye@zju.edu.cn', href: 'mailto:yhye@zju.edu.cn' },
    { label: 'GITHUB', value: 'github.com/yva1nne', href: 'https://github.com/yva1nne' },
  ],
}

export const capabilities = [
  {
    id: 'product',
    number: '01',
    label: 'PRODUCT JUDGMENT',
    keywords: '问题定义、场景拆解、PRD、原型、需求优先级。',
    evidence: '在数据库 AI 助手项目中梳理入口逻辑、版本能力与 Skill / Tool 配置，并参与测试和商业化推进。',
  },
  {
    id: 'agent',
    number: '02',
    label: 'AGENT & WORKFLOW',
    keywords: 'Prompt、Skills、Agent、Workflow、AG-UI、记忆与评估。',
    evidence: '判断模型自由度与确定性流程的边界，并通过 badcase 和回归持续优化。',
  },
  {
    id: 'engineering',
    number: '03',
    label: 'AI & ENGINEERING',
    keywords: 'Python、PyTorch、CV、API 集成、Docker。',
    evidence: '能够读懂系统与模型约束，也能做出可运行原型推进方案讨论。',
  },
  {
    id: 'prototype',
    number: '04',
    label: 'PROTOTYPE & AI CODING',
    keywords: 'Figma、Axure、Prompt、AI Coding、交互原型。',
    evidence: '用原型工具与 AI Coding 把需求快速做成可体验的界面，让方案进入真实交互。',
  },
]

export const timelineItems = [
  {
    id: 'bachelor',
    category: 'education',
    year: '2020',
    date: '2020.09 — 2024.06',
    title: '浙江大学 · 本科',
    role: '电子科学与技术',
    summary: '建立电子信息与工程技术基础。',
    evidence: [
      '电子科学与技术本科，2024 年毕业。',
      '获校级优秀毕业论文，并多次获得校奖学金。',
    ],
  },
  {
    id: 'master',
    category: 'education',
    year: '2024',
    date: '2024.09 — 2027.06（预计）',
    title: '浙江大学 · 硕士',
    role: '电子信息',
    summary: '研究与项目逐步从算法验证延伸到产品定义、系统集成与真实场景应用。',
    evidence: [
      '研究与实践聚焦工业视觉模型训练、系统集成和 AI 产品设计。',
    ],
    current: true,
  },
  {
    id: 'defect',
    category: 'project',
    year: '2024',
    date: '2024.09 — 2025.07',
    title: '智能缺陷分析系统',
    role: '产品 + 核心开发成员',
    summary: '面向半导体产线 YE 工程师 RCA 阶段，整合分类、分割、语义和根因检索。',
    evidence: [
      '主责 DRNet 根因检索、GUI 搭建与系统集成。',
      '检索模块 Rank-1 准确率 96.2%，单次检索时延 0.03s。',
    ],
    projectId: 'defect',
  },
  {
    id: 'eda',
    category: 'project',
    year: '2025',
    date: '2025.08 — 2025.12',
    title: '基于 AI 的跨工艺集成电路行为建模',
    role: '核心开发成员',
    summary: '参与跨工艺参数推演与工程化交付，项目获创“芯”大赛 EDA 精英挑战赛全国三等奖。',
    evidence: [],
  },
  {
    id: 'ganttodo',
    category: 'project',
    year: '2025',
    date: '2025.09 — 2025.12',
    title: 'Smart Ganttodo',
    role: 'AI 产品经理 / 独立开发',
    summary: '验证自然语言多意图解析、结构化 actions、甘特图状态与拖拽修正的个人任务规划链路。',
    evidence: [
      '设计 Prompt 约束、日历参照表与时区锁定，处理相对日期、星期与时区等时间理解问题。',
      '将一句话中的创建、修改、删除等多意图解析为结构化 JSON actions，并映射到可拖拽甘特图。',
    ],
    projectId: 'ganttodo',
  },
  {
    id: 'zhipu',
    category: 'project',
    year: '2025',
    date: '2025.12 — 2026.05',
    title: '智谱华章 · AI 产品经理实习',
    role: 'AI 产品经理实习生',
    summary: '在“城智大模型体系”一期交付末期，梳理 4 家单位的业务场景与项目材料，主导 5 个大屏、14 个页面的内容组织、讲解稿和演示脚本，并通过 ASR 纠错与意图路由，把智能中控、智能讲解和智能问答接入可控的 LLM-driven workflow。',
    evidence: [
      '主导 5 个大屏、14 个页面的展示方案、内容组织与演示脚本。',
      '设计智能中控、智能讲解、智能问答三类能力。',
    ],
    projectId: 'zhipu',
  },
  {
    id: 'aliyun',
    category: 'project',
    year: '2026',
    date: '2026.06 — 至今',
    title: '阿里云 · 数据库产品经理实习',
    role: '数据库产品经理实习生',
    summary: '围绕数据库 AI 助手推进功能设计、Skills 优化、测试与商业化；内部运维 AI 助手当前聚焦能力梳理、功能文档与接入需求。',
    evidence: [
      '数据库 AI 助手：功能设计、Skills 优化与商业化落地。',
      '内部运维 AI 助手：梳理现有能力和接入情况，形成需求文档；新一轮接入与优化尚待实施。',
    ],
    projectId: 'aliyun',
    current: true,
  },
]

export const projectOrder = ['aliyun', 'zhipu', 'defect', 'ganttodo']

export const projects = {
  aliyun: {
    id: 'aliyun',
    folderName: '阿里云数据库实习',
    kicker: '2026.06 — NOW / ALIBABA CLOUD',
    title: '数据库 AI，从回答走向执行。',
    summary: '两条工作主线：推进数据库 AI 助手的功能、Skills 与商业化；梳理内部运维 AI 助手的能力与接入需求。',
    role: '数据库产品经理实习生',
    problem: '如何从数据库用户的真实任务出发，把模型、Skills、工具和平台状态组织成可交付、可验证的产品能力。',
    responsibilities: [
      '参与数据库 AI 助手的功能设计、Skills 优化与商业化落地。',
      '梳理内部运维 AI 助手现有能力与接入情况，沉淀功能文档。',
      '提出云端 Hermes 通过 AG-UI 接入内部运维平台的需求；接入与优化尚待实施。',
    ],
    system: '数据库 AI 助手：功能设计 → Skills 优化 → 场景验证 → 商业化落地；内部运维 AI 助手目标链路：运维平台 ⇄ AG-UI ⇄ Hermes，并连接 Tools / Skills、Memory / Experience 与 Harness Improvement。',
    evidence: [
      '两条已确认工作主线均以脱敏产品逻辑呈现。',
      'Harness 优化只展示抽象闭环：发现 badcase → 提炼经验 / Skill → 回归验证 → 受控更新。',
    ],
    boundary: '只展示可公开、已脱敏的产品逻辑；不展示客户、内部平台真名、账号、数据、未公开截图、敏感参数或未确认指标。',
    accent: '#d76b2c',
  },
  zhipu: {
    id: 'zhipu',
    folderName: '智谱华章实习',
    kicker: '2025.12 — 2026.05 / ZHIPU AI',
    title: '让复杂项目可讲、可演、可追问。',
    summary: '围绕城智大模型展示，组织 4 家单位材料、5 个大屏与 14 个页面，并设计 ASR 纠错、意图路由和受控问答。',
    role: 'AI 产品经理实习生',
    problem: '在项目交付末期，把分散的业务材料、项目成果和演示诉求组织成稳定的展示与自然语言交互链路。',
    responsibilities: [
      '主导 5 个大屏、14 个页面的展示方案、内容组织和演示脚本。',
      '设计智能中控、智能讲解、智能问答三类能力。',
      '设计 ASR 纠错、Router、场景 QA、澄清、拒答和兜底链路。',
    ],
    system: '语音 / 文本输入 → ASR 纠错 / 文本归一化 → Router → navigate / explain / qa / general / clarify / other → 前端动作或对应子工作流。',
    evidence: [
      '覆盖 4 家单位的业务场景、痛点与项目边界。',
      '展示方案包含 5 个大屏、14 个页面。',
    ],
    boundary: 'LLM 负责自然语言理解、路由匹配和受控生成；Workflow 负责确定性跳屏、讲解流程、问答子链路、兜底、日志和回归。项目定位为展示型 LLM-driven workflow，不涉及完全自治 Agent 或底层模型训练。',
    accent: '#596a87',
  },
  defect: {
    id: 'defect',
    folderName: '智能缺陷分析系统',
    kicker: '2024.09 — 2025.07 / INDUSTRIAL AI',
    title: '四路模型结果，汇成工程辅助报告。',
    summary: '分类、分割、形貌描述与相似案例检索，在一分钟演示里完成串联。',
    role: '产品 + 核心开发成员',
    problem: '缺陷分析结果分散，工程师需要在 RCA 阶段快速理解缺陷并定位可复用的历史线索。',
    responsibilities: [
      '负责产品方案与系统交互。',
      '主责 DRNet 根因检索模块。',
      '负责 GUI 搭建、系统集成和 Top-K 相似缺陷结果交互。',
    ],
    system: '分类 / 分割 / 语义 / 检索四个模块共同生成多维辅助分析报告。',
    evidence: [
      '使用 2000+ 张真实产线数据完成验证。',
      '检索模块单次时延 0.03s，Rank-1 准确率 96.2%。',
      '获“华为杯”中国研究生人工智能创新大赛全国一等奖。',
    ],
    boundary: '系统提供分类、位置、形貌和历史相似案例等辅助信息，最终根因仍由 YE 工程师判断。',
    videoSrc: '/新版一分钟展示.mp4',
    accent: '#687d74',
  },
  ganttodo: {
    id: 'ganttodo',
    folderName: '甘特图风格化待办系统',
    kicker: '2025.09 — 2025.12 / INDEPENDENT MVP',
    title: '一句话排计划，拖动甘特图修正。',
    summary: '自然语言生成结构化 actions，再由用户拖拽调整任务时间。',
    role: 'AI 产品经理 / 独立开发',
    problem: '传统待办列表不擅长表达跨天和并行任务，重型项目管理工具又增加了个人使用成本。',
    responsibilities: [
      '定义自然语言排期与甘特图修正的核心链路。',
      '设计多意图解析、结构化 JSON actions 与时间治理约束。',
      '独立完成可拖拽 MVP 并部署在线体验。',
    ],
    system: '自然语言输入 → 多意图识别 → JSON actions → Gantt state → 拖拽编辑。',
    evidence: [
      '支持创建、修改、删除任务和一句话多任务解析。',
      '使用 Prompt 约束、日历参照表和时区锁定降低时间推理错误。',
      '在线 MVP 保留 AI 初稿后的人工编辑权。',
    ],
    boundary: '当前定位是轻量个人工作流 MVP，不包装成完整项目管理工具；多人协同、复杂依赖、通知、多端同步和后端存储不在已验证范围内。',
    demoUrl: 'https://yva1nne.github.io/Smart-Ganttodo/',
    accent: '#786a8f',
  },
}

export const projectList = projectOrder.map((projectId) => projects[projectId])

export const projectOverview = {
  title: '项目作品',
  summary: '四个项目覆盖数据库产品与运维 Agent、ToB 展示工作流、工业缺陷分析和个人效率工具，分别呈现任务定义、系统分工、交互设计与落地边界。',
}
