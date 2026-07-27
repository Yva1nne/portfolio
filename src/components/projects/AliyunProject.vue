<template>
  <section
    class="aliyun-project"
    :style="{ '--accent': project.accent }"
    aria-labelledby="aliyun-project-title"
  >
    <header class="project-head">
      <div>
        <p class="kicker">{{ project.kicker }}</p>
        <h3 id="aliyun-project-title">{{ project.title }}</h3>
      </div>
      <p class="role"><span class="tag tag--confirmed">已确认</span>{{ project.role }}</p>
    </header>

    <p class="summary">{{ project.summary }}</p>

    <div class="system-label" aria-hidden="true"><span>DATABASE CONTEXT</span><i></i></div>
    <nav class="track-tabs" aria-label="选择阿里云工作主线">
      <button
        v-for="track in tracks"
        :key="track.id"
        type="button"
        :class="{ 'is-active': activeTrack === track.id }"
        :aria-pressed="activeTrack === track.id"
        :aria-controls="`aliyun-${track.id}`"
        @click="activeTrack = track.id"
      >
        <span>{{ track.number }}</span>
        <strong>{{ track.title }}</strong>
        <small>{{ track.flow }}</small>
      </button>
    </nav>

    <section
      v-show="activeTrack === 'database'"
      id="aliyun-database"
      class="track-panel"
      aria-labelledby="aliyun-database-title"
    >
      <header class="track-head">
        <div>
          <p class="kicker">01 / DATABASE AI ASSISTANT</p>
          <h4 id="aliyun-database-title">把模型能力组织成可以交付的产品功能。</h4>
        </div>
        <span class="tag tag--confirmed">个人工作主线 · 已确认</span>
      </header>
      <p class="intro">
        从数据库用户任务出发，明确助手理解什么、调用什么能力、怎样给出可执行结果。这里只陈述已确认的参与事项，不把候选方法写成既有成果。
      </p>

      <div class="content-grid">
        <ol class="step-list" aria-label="数据库 AI 助手产品链路">
          <li v-for="step in databaseSteps" :key="step.id">
            <button
              type="button"
              :class="{ 'is-selected': selectedDatabaseStep === step.id }"
              :aria-pressed="selectedDatabaseStep === step.id"
              @click="selectedDatabaseStep = step.id"
            >
              <span>{{ step.number }}</span>
              <strong>{{ step.title }}</strong>
              <small>{{ step.status }}</small>
            </button>
          </li>
        </ol>

        <aside class="detail" aria-live="polite">
          <header>
            <strong>{{ selectedDatabaseStepData.number }} / {{ selectedDatabaseStepData.title }}</strong>
            <span class="tag" :class="selectedDatabaseStepData.confirmed ? 'tag--confirmed' : 'tag--pending'">
              {{ selectedDatabaseStepData.status }}
            </span>
          </header>
          <p>{{ selectedDatabaseStepData.detail }}</p>
          <small>{{ selectedDatabaseStepData.boundary }}</small>
        </aside>
      </div>
    </section>

    <section
      v-show="activeTrack === 'operations'"
      id="aliyun-operations"
      class="track-panel"
      aria-labelledby="aliyun-operations-title"
    >
      <header class="track-head">
        <div>
          <p class="kicker">02 / INTERNAL OPERATIONS ASSISTANT</p>
          <h4 id="aliyun-operations-title">把 Agent 接入运维系统的目标链路讲清楚。</h4>
        </div>
        <span class="tag tag--pending">前期梳理完成 · 接入待实施</span>
      </header>
      <p class="intro">
        下图是脱敏后的目标关系模型，仅用于解释平台、AG-UI 与 Hermes 的拟议接入方式，不代表已完成架构、内部系统截图、部署拓扑或线上监控台。
      </p>

      <div class="content-grid">
        <div>
          <div class="architecture" aria-label="运维平台、AG-UI 与 Hermes 的目标双向连接">
            <template v-for="(node, index) in operationNodes" :key="node.id">
              <button
                type="button"
                class="architecture-node"
                :class="{ 'is-selected': selectedOperationNode === node.id }"
                :aria-pressed="selectedOperationNode === node.id"
                @click="selectedOperationNode = node.id"
              >
                <span>{{ node.eyebrow }}</span>
                <strong>{{ node.title }}</strong>
                <small>{{ node.brief }}</small>
              </button>
              <i v-if="index < operationNodes.length - 1" class="connector" aria-hidden="true">
                ⇄<b></b><b></b>
              </i>
            </template>
          </div>
          <div class="capabilities" aria-label="Hermes 侧公开概念层">
            <span v-for="capability in hermesCapabilities" :key="capability">{{ capability }}</span>
          </div>
        </div>

        <aside class="detail" aria-live="polite">
          <header>
            <strong>{{ selectedOperationNodeData.title }}</strong>
            <span class="tag" :class="`tag--${selectedOperationNodeData.kind}`">
              {{ selectedOperationNodeData.status }}
            </span>
          </header>
          <p>{{ selectedOperationNodeData.detail }}</p>
          <small>{{ selectedOperationNodeData.boundary }}</small>
        </aside>
      </div>

      <details class="event-stream">
        <summary>
          <span>展开脱敏事件流时间线</span>
          <small>公开事件族示意 · 非线上日志</small>
        </summary>
        <ol>
          <li v-for="event in eventTimeline" :key="event.name">
            <code>{{ event.name }}</code><span>{{ event.description }}</span>
          </li>
        </ol>
        <p>时间线只解释双向、流式和状态更新关系；顺序、参数与文案均不代表真实内部任务。</p>
      </details>

      <section class="harness" aria-labelledby="harness-title">
        <header class="track-head">
          <div>
            <p class="kicker">HARNESS IMPROVEMENT</p>
            <h5 id="harness-title">从一次 badcase，到一次受控更新。</h5>
          </div>
          <span class="tag tag--pending">抽象闭环 · 细节待确认</span>
        </header>
        <ol>
          <li v-for="(step, index) in harnessSteps" :key="step">
            <span>{{ String(index + 1).padStart(2, '0') }}</span><strong>{{ step }}</strong>
          </li>
        </ol>
      </section>
    </section>

    <footer class="trust-boundary">
      <div class="legend" aria-label="内容可信度图例">
        <span><i class="is-confirmed"></i>已确认：个人确认的工作事实</span>
        <span><i class="is-public"></i>公开概念：仅解释系统关系</span>
        <span><i class="is-pending"></i>待确认：不作为个人成果</span>
      </div>
      <div class="sources">
        <strong>公开概念来源</strong>
        <a href="https://docs.ag-ui.com/" target="_blank" rel="noreferrer" data-cursor-label="VISIT">AG-UI 官方文档 ↗</a>
        <a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noreferrer" data-cursor-label="VISIT">Hermes Agent 官方仓库 ↗</a>
      </div>
      <details class="pending">
        <summary>查看待确认与不可披露边界</summary>
        <ul><li v-for="item in pendingBoundaries" :key="item">{{ item }}</li></ul>
      </details>
      <p class="security-note">{{ project.boundary }}</p>
    </footer>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { projects } from '../../data/portfolio.js'

const project = projects.aliyun
const activeTrack = ref('database')
const selectedDatabaseStep = ref('function-design')
const selectedOperationNode = ref('ag-ui')

const tracks = [
  { id: 'database', number: '01', title: '数据库 AI 助手', flow: '功能设计 → Skills 优化 → 场景验证 → 商业化落地' },
  { id: 'operations', number: '02', title: '内部运维 AI 助手', flow: '目标链路：运维平台 ⇄ AG-UI ⇄ 云端 Hermes' },
]

const databaseSteps = [
  {
    id: 'function-design', number: '01', title: '功能设计', status: '已确认参与', confirmed: true,
    detail: '从用户任务、入口、上下文与操作风险出发，参与定义数据库 AI 助手的功能边界与交互链路。',
    boundary: '不公开具体功能名、目标用户角色、客户信息或内部方案截图。',
  },
  {
    id: 'skills', number: '02', title: 'Skills 优化', status: '已确认参与', confirmed: true,
    detail: '参与数据库领域 Skills 的优化，让能力更适合进入具体产品任务。',
    boundary: '触发条件、工具调用、输出格式与失败兜底仍是待核对维度，不声称尚未确认的具体做法。',
  },
  {
    id: 'validation', number: '03', title: '场景验证', status: '展示维度待确认', confirmed: false,
    detail: '这一环说明能力进入目标场景后，需要通过测试、badcase 与回归判断是否更可用。',
    boundary: '未公开测试集规模、指标或效率结果，因此不展示数字，也不把候选方法写成已完成工作。',
  },
  {
    id: 'commercialization', number: '04', title: '商业化落地', status: '已确认参与', confirmed: true,
    detail: '参与把能力连接到可交付场景，关注谁使用、解决什么问题，以及由什么产品形态承载。',
    boundary: '不公开客户、版本、收入、转化率或尚未确认的交付路径与结果。',
  },
]

const operationNodes = [
  {
    id: 'platform', eyebrow: 'CONTEXT', title: '脱敏运维平台', brief: '任务与状态入口',
    status: '已确认 · 前期梳理', kind: 'confirmed',
    detail: '个人已确认完成现有能力与接入情况梳理，并形成相关功能文档和需求；页面以通用名称表示目标平台。',
    boundary: '不公开平台真名、账号、界面、任务数据或权限结构。',
  },
  {
    id: 'ag-ui', eyebrow: 'PROTOCOL', title: 'AG-UI', brief: '双向流式交互',
    status: '公开概念 + 待实施方案', kind: 'public',
    detail: 'AG-UI 在这里解释 Agent 与前端之间的双向事件、流式内容和状态更新；已确认事实仅到接入需求与方案梳理。',
    boundary: '公开事件族仅作教学示意；相关接入尚待实施，不代表内部协议抓包、实际参数或完整实现。',
  },
  {
    id: 'hermes', eyebrow: 'AGENT RUNTIME', title: '云端 Hermes', brief: '按需调用能力',
    status: '公开概念 + 待实施目标', kind: 'public',
    detail: '以脱敏方式表达云端 Hermes 与目标平台的拟议连接，以及 Agent 使用工具、Skills 和经验上下文的产品关系。',
    boundary: '相关接入和优化尚待实施；不公开部署拓扑、模型参数、工具清单、Memory 结构或内部运行数据。',
  },
]

const hermesCapabilities = ['Tools / Skills', 'Memory / Experience', 'Harness Improvement']
const eventTimeline = [
  { name: 'RUN_STARTED', description: '建立一次任务运行的开始状态。' },
  { name: 'TEXT_MESSAGE_START / CONTENT / END', description: '分段返回可见文本内容。' },
  { name: 'TOOL_CALL_START / ARGS / END', description: '表达工具调用及参数传递阶段。' },
  { name: 'STATE_DELTA', description: '把增量状态同步回交互界面。' },
  { name: 'RUN_FINISHED', description: '结束本次脱敏任务示意。' },
]
const harnessSteps = ['发现 badcase', '提炼经验 / Skill', '回归验证', '受控更新']
const pendingBoundaries = [
  '数据库 AI 助手的具体目标用户、功能名称与 Skills 示例。',
  '个人独立负责、参与和协同事项的更细颗粒度边界。',
  '可公开的测试集规模、质量变化、效率变化与商业化结果。',
  '内部平台、Hermes 部署、Memory 与 Harness 结构可披露到什么层级。',
]

const selectedDatabaseStepData = computed(() => (
  databaseSteps.find((step) => step.id === selectedDatabaseStep.value) || databaseSteps[0]
))
const selectedOperationNodeData = computed(() => (
  operationNodes.find((node) => node.id === selectedOperationNode.value) || operationNodes[0]
))
</script>

<style scoped>
.aliyun-project {
  --paper: #f7f4ed;
  --ink: #20211f;
  --muted: #6a6a64;
  --accent-text: #a84316;
  --line: rgba(32, 33, 31, 0.17);
  --strong-line: rgba(32, 33, 31, 0.38);
  container: aliyun / inline-size;
  width: 100%;
  min-height: 100%;
  padding: clamp(18px, 2.6cqw, 32px);
  background: var(--paper);
  color: var(--ink);
  font-family: 'Manrope', 'Noto Sans SC', system-ui, sans-serif;
  scrollbar-color: rgba(32, 33, 31, 0.28) transparent;
  scrollbar-width: thin;
}

.aliyun-project :where(button, a, summary) { font: inherit; }
.aliyun-project :where(button, summary) { color: inherit; }
.aliyun-project :where(button, a, summary):focus-visible {
  outline: 2px solid var(--accent-text);
  outline-offset: 3px;
}

.project-head,
.track-head,
.detail header,
.event-stream summary,
.sources {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.kicker {
  margin: 0 0 7px;
  color: var(--accent-text);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.project-head h3,
.track-head h4,
.track-head h5 {
  margin: 0;
  font-family: 'Fraunces', 'Noto Serif SC', serif;
  line-height: 1.1;
}
.project-head h3 { max-width: 18em; font-size: clamp(22px, 3.2cqw, 34px); }
.track-head h4 { font-size: clamp(18px, 2.5cqw, 26px); }
.track-head h5 { font-size: clamp(16px, 2cqw, 21px); }

.role {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 10px;
}
.summary,
.intro { color: var(--muted); line-height: 1.7; }
.summary { max-width: 74em; margin: 17px 0 22px; font-size: clamp(13px, 1.55cqw, 16px); }
.intro { max-width: 72em; margin: 12px 0 19px; font-size: 14px; }

.tag {
  display: inline-flex;
  width: max-content;
  padding: 2px 6px;
  border: 1px solid currentColor;
  border-radius: 3px;
  font-size: 8px;
  font-weight: 800;
  line-height: 1.3;
  white-space: nowrap;
}
.tag--confirmed { color: #607459; }
.tag--public { color: #526b82; }
.tag--pending { color: #8a6d42; }

.system-label {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  gap: 12px;
  color: var(--muted);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.12em;
}
.system-label i { height: 1px; background: var(--strong-line); }

.track-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-bottom: 1px solid var(--strong-line);
}
.track-tabs button {
  position: relative;
  display: grid;
  grid-template-columns: 25px 1fr;
  gap: 5px 9px;
  min-width: 0;
  padding: 14px 12px;
  border: 0;
  border-left: 1px solid var(--line);
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.track-tabs button:last-child { border-right: 1px solid var(--line); }
.track-tabs button::after {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  background: var(--accent);
  content: '';
  opacity: 0;
  transform: scaleX(0.35);
  transition: 180ms ease;
}
.track-tabs button:hover,
.track-tabs button.is-active { background: rgba(255, 255, 255, 0.35); }
.track-tabs button.is-active::after { opacity: 1; transform: scaleX(1); }
.track-tabs button > span { grid-row: 1 / 3; color: var(--accent-text); font-size: 10px; font-weight: 800; }
.track-tabs strong { font-size: clamp(12px, 1.5cqw, 15px); }
.track-tabs small {
  overflow: hidden;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-panel { padding: clamp(22px, 3cqw, 34px) 0; border-bottom: 1px solid var(--strong-line); }
.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(210px, 0.85fr);
  gap: clamp(18px, 2.5cqw, 30px);
}

.step-list,
.harness ol,
.event-stream ol {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.step-list { grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid var(--strong-line); }
.step-list li { min-width: 0; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.step-list li:first-child { border-left: 1px solid var(--line); }
.step-list button,
.architecture-node {
  display: grid;
  align-content: start;
  gap: 7px;
  width: 100%;
  min-height: 108px;
  padding: 12px 10px;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.step-list button:hover,
.step-list button.is-selected,
.architecture-node:hover,
.architecture-node.is-selected { background: rgba(215, 107, 44, 0.07); }
.step-list button.is-selected,
.architecture-node.is-selected { box-shadow: inset 0 -2px var(--accent); }
.step-list button > span,
.architecture-node > span,
.harness li span { color: var(--accent-text); font-size: 8px; font-weight: 800; }
.step-list strong,
.architecture-node strong { font-size: 11px; }
.step-list small,
.architecture-node small { color: var(--muted); font-size: 8px; line-height: 1.45; }

.detail {
  display: grid;
  align-content: start;
  gap: 11px;
  min-width: 0;
  padding: 13px 0 13px 17px;
  border-left: 2px solid var(--accent);
  background: rgba(255, 255, 255, 0.2);
}
.detail header { flex-wrap: wrap; color: var(--muted); font-size: 8px; letter-spacing: 0.03em; }
.detail p { margin: 0; font-size: 14px; line-height: 1.65; }
.detail > small { color: var(--muted); font-size: 12px; line-height: 1.55; }

.architecture { display: flex; align-items: stretch; border: 1px solid var(--line); border-bottom: 0; }
.architecture-node { flex: 1 1 0; min-width: 0; border-bottom: 1px solid var(--line); }
.connector {
  position: relative;
  z-index: 1;
  display: grid;
  flex: 0 0 28px;
  place-items: center;
  align-self: center;
  height: 18px;
  margin: 0 -14px;
  background: var(--paper);
  color: var(--accent-text);
  font-style: normal;
  pointer-events: none;
}
.connector b {
  position: absolute;
  top: 8px;
  left: 3px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--accent);
  animation: event-flow 2.8s linear infinite;
}
.connector b:last-child { right: 3px; left: auto; animation-direction: reverse; animation-delay: -1.4s; }
.capabilities {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-left: 66.666%;
  color: var(--muted);
  font-size: 8px;
  text-align: center;
}
.capabilities span { position: relative; padding: 9px 3px 0; }
.capabilities span::before {
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  height: 6px;
  background: var(--strong-line);
  content: '';
}

.event-stream,
.pending { border-bottom: 1px solid var(--line); }
.event-stream { margin-top: 22px; border-top: 1px solid var(--line); }
.event-stream summary,
.pending summary { padding: 10px 0; cursor: pointer; list-style: none; font-size: 10px; font-weight: 800; }
.event-stream summary::-webkit-details-marker,
.pending summary::-webkit-details-marker { display: none; }
.event-stream summary::after,
.pending summary::after { color: var(--accent-text); content: '+'; }
.event-stream[open] summary::after,
.pending[open] summary::after { content: '−'; }
.event-stream summary small { margin-left: auto; color: var(--muted); font-size: 8px; }
.event-stream ol { grid-template-columns: repeat(5, minmax(0, 1fr)); padding-top: 4px; }
.event-stream li { display: grid; gap: 7px; min-width: 0; padding: 12px 8px; border-top: 1px solid var(--strong-line); }
.event-stream code { overflow-wrap: anywhere; color: var(--accent-text); font-size: 7px; font-weight: 800; }
.event-stream li span,
.event-stream > p { color: var(--muted); font-size: 12px; line-height: 1.5; }
.event-stream > p { margin: 0 0 12px; }

.harness { margin-top: 22px; }
.harness ol { grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: 14px; border-top: 1px solid var(--strong-line); }
.harness li {
  position: relative;
  display: grid;
  gap: 5px;
  padding: 11px 9px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.harness li:first-child { border-left: 1px solid var(--line); }
.harness li:not(:last-child)::after {
  position: absolute;
  top: 50%;
  right: -7px;
  z-index: 1;
  width: 14px;
  background: var(--paper);
  color: var(--accent-text);
  content: '→';
  text-align: center;
  transform: translateY(-50%);
}
.harness li strong { font-size: 9px; }

.trust-boundary { display: grid; gap: 11px; padding-top: 17px; }
.legend,
.sources {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px 15px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.45;
}
.legend span { display: inline-flex; align-items: center; gap: 5px; }
.legend i { width: 6px; height: 6px; border-radius: 50%; }
.legend .is-confirmed { background: #607459; }
.legend .is-public { background: #526b82; }
.legend .is-pending { background: #8a6d42; }
.sources { padding: 9px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.sources a { color: var(--ink); text-underline-offset: 3px; }
.sources a:hover { text-decoration-color: var(--accent); }
.pending ul { display: grid; gap: 6px; margin: 0; padding: 0 0 12px 1.2em; color: var(--muted); font-size: 12px; line-height: 1.5; }
.security-note { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.55; }

@keyframes event-flow { to { transform: translateX(18px); } }

@container aliyun (max-width: 720px) {
  .project-head,
  .track-head { display: grid; }
  .role { justify-self: start; }
  .content-grid { grid-template-columns: 1fr; }
  .detail { min-height: 110px; }
  .capabilities { margin-left: 58%; }
}

@container aliyun (max-width: 520px) {
  .track-tabs,
  .step-list,
  .event-stream ol,
  .harness ol { grid-template-columns: 1fr; }
  .track-tabs small { white-space: normal; }
  .step-list li,
  .step-list li:first-child { border-left: 1px solid var(--line); }
  .step-list button { min-height: 78px; }
  .architecture { display: grid; }
  .architecture-node { min-height: 78px; border-right: 0; }
  .connector { display: none; }
  .capabilities { grid-template-columns: 1fr; margin-left: 0; text-align: left; }
  .capabilities span { padding-left: 15px; }
  .capabilities span::before { top: 50%; left: 2px; width: 7px; height: 1px; }
  .harness li,
  .harness li:first-child { border-left: 1px solid var(--line); }
  .harness li:not(:last-child)::after { top: auto; right: auto; bottom: -8px; left: 50%; content: '↓'; transform: translateX(-50%); }
  .event-stream summary small { display: none; }
}

@media (max-width: 760px) {
  .aliyun-project { padding: 16px; }
  .summary,
  .intro,
  .detail p,
  .detail > small,
  .event-stream li span,
  .event-stream > p,
  .pending ul,
  .security-note {
    font-size: 15px;
  }
  .role,
  .legend,
  .sources { font-size: 13px; }
  .tag { font-size: 11px; }
  .step-list strong,
  .architecture-node strong { font-size: 15px; }
  .step-list small,
  .architecture-node small { font-size: 12px; }
  .event-stream code { font-size: 11px; }
}
@media (prefers-reduced-motion: reduce) {
  .track-tabs button::after { transition: none; }
  .connector b { display: none; animation: none; }
}
</style>
