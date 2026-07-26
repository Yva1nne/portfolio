<template>
  <article class="zhipu-project" :style="{ '--project-accent': project.accent }">
    <header class="project-lead">
      <p>{{ project.kicker }}</p>
      <h3>{{ project.title }}</h3>
      <span>{{ project.summary }}</span>
    </header>

    <nav class="project-index" aria-label="智谱项目内容索引">
      <a v-for="anchor in anchors" :key="anchor.id" :href="`#${anchor.id}`">
        <span>{{ anchor.number }}</span>
        {{ anchor.label }}
      </a>
    </nav>

    <section id="zhipu-problem" class="reading-section reading-section-split">
      <header>
        <p>01 / PROBLEM</p>
        <h4>问题</h4>
      </header>
      <div>
        <p>{{ project.problem }}</p>
        <dl class="project-role">
          <dt>我的角色</dt>
          <dd>{{ project.role }}</dd>
        </dl>
      </div>
    </section>

    <section id="zhipu-system" class="reading-section system-section">
      <header>
        <p>02 / SYSTEM</p>
        <h4>确定性骨架，受控的模型自由度。</h4>
        <span>{{ project.system }}</span>
      </header>

      <div class="system-boundary" aria-label="LLM 与 Workflow 的职责边界">
        <div>
          <p>LLM / FLEXIBLE</p>
          <strong>理解、匹配、受控生成</strong>
          <span>自然语言理解 · 路由匹配 · 受控生成</span>
        </div>
        <div>
          <p>WORKFLOW / DETERMINISTIC</p>
          <strong>动作、流程、兜底与回归</strong>
          <span>确定性跳屏 · 讲解流程 · 问答子链路 · 兜底 · 日志 · 回归</span>
        </div>
      </div>

      <div class="workflow-shell" :class="{ 'has-panel': selectedNode }">
        <div
          ref="workflowViewport"
          class="workflow-viewport"
          :class="{ 'is-panning': isPanning }"
          data-cursor-label="DRAG"
          tabindex="0"
          aria-label="城智大模型展示工作流画布。拖动画布平移，使用工具栏缩放；聚焦或点击节点查看说明。"
          @pointerdown="startPan"
          @wheel="onWheel"
          @keydown="onViewportKeydown"
        >
          <div class="workflow-toolbar" role="group" aria-label="工作流视角控制" @pointerdown.stop>
            <button type="button" :disabled="!canZoomOut" aria-label="缩小工作流画布" @click="zoomOut">−</button>
            <output aria-live="polite">{{ zoomPercent }}</output>
            <button type="button" :disabled="!canZoomIn" aria-label="放大工作流画布" @click="zoomIn">＋</button>
            <button type="button" class="reset-button" aria-label="重置工作流视角" @click="resetView">1:1</button>
          </div>

          <div ref="workflowCanvas" class="workflow-canvas" :style="canvasStyle">
            <svg class="workflow-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path v-for="edge in edges" :key="edge.id" :d="edgePath(edge)" vector-effect="non-scaling-stroke" />
            </svg>

            <button
              v-for="node in nodes"
              :key="node.id"
              type="button"
              class="workflow-node"
              :class="[
                nodeTypeClass(node.type),
                {
                  'is-selected': selectedNodeId === node.id,
                  'is-dragging': activeNodeId === node.id,
                },
              ]"
              :data-node-id="node.id"
              :style="{ left: `${node.x}%`, top: `${node.y}%` }"
              :aria-label="`${node.id} ${node.name}，${node.brief}`"
              @focus="focusNode(node.id)"
              @click="activateNode(node.id)"
              @pointerdown="startNodeDrag($event, node)"
            >
              <span class="node-meta">
                <span>{{ node.id }}</span>
                <small>{{ node.type }}</small>
              </span>
              <strong>{{ node.name }}</strong>
              <small>{{ node.brief }}</small>
            </button>
          </div>
        </div>

        <aside
          class="node-panel"
          :class="{ 'is-open': selectedNode }"
          :aria-hidden="!selectedNode"
          :inert="!selectedNode"
          aria-live="polite"
          @pointerdown.stop
          @wheel.stop
        >
          <header>
            <p>当前节点 · {{ selectedNode?.type }}</p>
            <button type="button" aria-label="关闭节点说明" @click="closeNodePanel">×</button>
          </header>
          <strong>{{ selectedNode?.name }}</strong>
          <span>{{ selectedNode?.detail }}</span>
        </aside>
      </div>

      <p class="workflow-hint">拖动节点可调整本次浏览中的布局；不会编辑流程，也不会保存节点位置。</p>
    </section>

    <section id="zhipu-work" class="reading-section reading-section-split">
      <header>
        <p>03 / MY WORK</p>
        <h4>我的工作</h4>
      </header>
      <div class="work-evidence">
        <ol>
          <li v-for="item in project.responsibilities" :key="item">{{ item }}</li>
        </ol>
        <dl>
          <div v-for="item in project.evidence" :key="item">
            <dt>证据</dt>
            <dd>{{ item }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section id="zhipu-boundary" class="reading-section boundary-section">
      <p>04 / BOUNDARY</p>
      <h4>边界</h4>
      <blockquote>{{ project.boundary }}</blockquote>
    </section>
  </article>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { projects } from '../../data/portfolio.js'

const project = projects.zhipu
const anchors = [
  { id: 'zhipu-problem', number: '01', label: '问题' },
  { id: 'zhipu-system', number: '02', label: '系统' },
  { id: 'zhipu-work', number: '03', label: '我的工作' },
  { id: 'zhipu-boundary', number: '04', label: '边界' },
]

const workflowViewport = ref(null)
const workflowCanvas = ref(null)
const selectedNodeId = ref(null)
const activeNodeId = ref(null)
const isPanning = ref(false)
const view = reactive({ x: 0, y: 0, scale: 1 })

const minScale = 0.72
const maxScale = 1.5
const zoomStep = 0.14
const canvasInset = 24
let panContext = null
let dragContext = null
let suppressClickNodeId = null
let resizeObserver = null

const nodes = reactive([
  { id: 'N0', name: 'ASR 纠错', type: 'Preprocess', next: ['N1'], brief: '修正语音转写', detail: '语音路径的第一步。修正专名、口误和识别偏差，把输入整理为更稳定的文本后再进入意图路由。', x: 4, y: 45 },
  { id: 'N1', name: '一级意图识别', type: 'Router', next: ['N2', 'N3', 'N5', 'N6', 'N7'], brief: '识别用户意图', detail: '识别跳转、讲解、问答、通用回复、澄清等一级意图。这里负责路由匹配，不直接承担完整回答。', x: 20, y: 45 },
  { id: 'N2', name: '页面跳转', type: 'Action', next: [], brief: '切换目标页面', detail: '把跳转请求交给前端执行确定性页面动作，让现场演示保持稳定、可复现。', x: 40, y: 8 },
  { id: 'N3', name: '场景讲解', type: 'Action', next: [], brief: '执行讲解流程', detail: '进入对应场景后触发与页面状态绑定的讲解流程，避免脱离当前展示内容自由发挥。', x: 40, y: 26 },
  { id: 'N5', name: '问答入口', type: 'Router', next: ['N5-1'], brief: '进入场景问答', detail: '把问答请求路由到场景问答子流程，使主路由与具体回答逻辑解耦。', x: 40, y: 44 },
  { id: 'N6', name: '通用回复', type: 'LLM', next: [], brief: '处理通用问题', detail: '承接基础互动，同时保持业务问答边界，不把生成范围无限扩大。', x: 40, y: 62 },
  { id: 'N7', name: '澄清与拦截', type: 'LLM', next: [], brief: '澄清或拒答', detail: '遇到歧义时请求补充信息；遇到越界请求时拒答，并提示当前支持范围。', x: 40, y: 80 },
  { id: 'N5-1', name: '场景问答模板匹配', type: 'Router', next: ['N5-2', 'N5-3', 'N5-4'], brief: '匹配标准问题', detail: '判断问题是否命中预设问答模板；未命中时再进入受控的自主问答或兜底分支。', x: 60, y: 44 },
  { id: 'N5-2', name: '模板回答', type: 'QA', next: [], brief: '回答标准问题', detail: '命中模板后按稳定口径组织回答，优先保证高频问题的完整性与可控性。', x: 80, y: 28 },
  { id: 'N5-3', name: '自主问答', type: 'QA', next: [], brief: '受控生成回答', detail: '未命中标准模板时，结合当前场景资料受控生成回答，并保持场景一致性。', x: 80, y: 46 },
  { id: 'N5-4', name: '兜底回复', type: 'LLM', next: [], brief: '处理范围外问题', detail: '不适合继续生成时回到当前支持范围，避免输出不确定或越界内容。', x: 80, y: 64 },
])

const selectedNode = computed(() => nodes.find((node) => node.id === selectedNodeId.value) || null)
const edges = computed(() => nodes.flatMap((node) => node.next.map((targetId) => ({
  id: `${node.id}-${targetId}`,
  from: node.id,
  to: targetId,
}))))
const canvasStyle = computed(() => ({
  transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
}))
const zoomPercent = computed(() => `${Math.round(view.scale * 100)}%`)
const canZoomIn = computed(() => view.scale < maxScale - 0.01)
const canZoomOut = computed(() => view.scale > minScale + 0.01)

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function viewBounds(scale = view.scale) {
  const viewport = workflowViewport.value
  const canvas = workflowCanvas.value
  if (!viewport || !canvas) return { minX: 0, maxX: 0, minY: 0, maxY: 0 }

  return {
    minX: Math.min(0, viewport.clientWidth - canvas.offsetWidth * scale - canvasInset),
    maxX: canvasInset,
    minY: Math.min(0, viewport.clientHeight - canvas.offsetHeight * scale - canvasInset),
    maxY: canvasInset,
  }
}

function setView(nextX, nextY, nextScale = view.scale) {
  const scale = clamp(nextScale, minScale, maxScale)
  const bounds = viewBounds(scale)
  view.scale = Number(scale.toFixed(2))
  view.x = Math.round(clamp(nextX, bounds.minX, bounds.maxX) * 10) / 10
  view.y = Math.round(clamp(nextY, bounds.minY, bounds.maxY) * 10) / 10
}

function zoom(delta, anchorEvent) {
  const nextScale = clamp(view.scale + delta, minScale, maxScale)
  if (nextScale === view.scale) return

  const rect = workflowViewport.value?.getBoundingClientRect()
  const anchorX = anchorEvent && rect ? anchorEvent.clientX - rect.left : (rect?.width || 0) / 2
  const anchorY = anchorEvent && rect ? anchorEvent.clientY - rect.top : (rect?.height || 0) / 2
  const ratio = nextScale / view.scale
  setView(
    anchorX - (anchorX - view.x) * ratio,
    anchorY - (anchorY - view.y) * ratio,
    nextScale,
  )
}

function zoomIn() { zoom(zoomStep) }
function zoomOut() { zoom(-zoomStep) }

function resetView() {
  setView(0, 0, 1)
}

function startPan(event) {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  if (event.pointerType === 'touch') return
  if (event.target.closest?.('.workflow-node, .workflow-toolbar, .node-panel')) return

  event.preventDefault()
  isPanning.value = true
  panContext = { startX: event.clientX, startY: event.clientY, x: view.x, y: view.y }
  window.addEventListener('pointermove', movePan)
  window.addEventListener('pointerup', stopPan)
  window.addEventListener('pointercancel', stopPan)
}

function movePan(event) {
  if (!panContext) return
  setView(
    panContext.x + event.clientX - panContext.startX,
    panContext.y + event.clientY - panContext.startY,
  )
}

function stopPan() {
  panContext = null
  isPanning.value = false
  window.removeEventListener('pointermove', movePan)
  window.removeEventListener('pointerup', stopPan)
  window.removeEventListener('pointercancel', stopPan)
}

function onWheel(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    event.preventDefault()
    zoom(event.deltaY > 0 ? -zoomStep : zoomStep, event)
    return
  }

  if (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    event.preventDefault()
    const delta = event.deltaX || event.deltaY
    setView(view.x - delta, view.y)
  }
}

function onViewportKeydown(event) {
  if (event.target !== event.currentTarget) return
  const step = 44
  const actions = {
    ArrowLeft: () => setView(view.x + step, view.y),
    ArrowRight: () => setView(view.x - step, view.y),
    ArrowUp: () => setView(view.x, view.y + step),
    ArrowDown: () => setView(view.x, view.y - step),
    '0': resetView,
    '-': zoomOut,
    '+': zoomIn,
    '=': zoomIn,
  }
  const action = actions[event.key]
  if (!action) return
  event.preventDefault()
  action()
}

function startNodeDrag(event, node) {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  if (event.pointerType === 'touch') return
  const canvas = workflowCanvas.value
  if (!canvas) return

  event.preventDefault()
  event.stopPropagation()
  activeNodeId.value = node.id
  selectedNodeId.value = node.id
  event.currentTarget.focus({ preventScroll: true })
  dragContext = {
    node,
    rect: canvas.getBoundingClientRect(),
    startX: event.clientX,
    startY: event.clientY,
    nodeX: node.x,
    nodeY: node.y,
    moved: false,
  }
  window.addEventListener('pointermove', moveNode)
  window.addEventListener('pointerup', stopNodeDrag)
  window.addEventListener('pointercancel', stopNodeDrag)
}

function moveNode(event) {
  if (!dragContext) return
  const moveX = event.clientX - dragContext.startX
  const moveY = event.clientY - dragContext.startY
  if (Math.abs(moveX) > 3 || Math.abs(moveY) > 3) dragContext.moved = true
  dragContext.node.x = clamp(dragContext.nodeX + (moveX / dragContext.rect.width) * 100, 3, 83)
  dragContext.node.y = clamp(dragContext.nodeY + (moveY / dragContext.rect.height) * 100, 5, 84)
}

function stopNodeDrag() {
  if (!dragContext) return
  const { node, moved } = dragContext
  suppressClickNodeId = node.id
  dragContext = null
  activeNodeId.value = null
  window.removeEventListener('pointermove', moveNode)
  window.removeEventListener('pointerup', stopNodeDrag)
  window.removeEventListener('pointercancel', stopNodeDrag)
  if (!moved) revealNode(node.id)
  window.setTimeout(() => { suppressClickNodeId = null }, 0)
}

function focusNode(nodeId) {
  selectedNodeId.value = nodeId
}

function activateNode(nodeId) {
  if (suppressClickNodeId === nodeId) return
  selectedNodeId.value = nodeId
  revealNode(nodeId)
}

function revealNode(nodeId) {
  nextTick(() => {
    window.requestAnimationFrame(() => {
      const viewport = workflowViewport.value
      const canvas = workflowCanvas.value
      const node = canvas?.querySelector(`[data-node-id="${nodeId}"]`)
      if (!viewport || !canvas || !node) return

      const viewportRect = viewport.getBoundingClientRect()
      const nodeRect = node.getBoundingClientRect()
      const renderedScale = canvas.getBoundingClientRect().width / canvas.offsetWidth || 1
      const targetX = viewportRect.left + viewportRect.width / 2
      const targetY = viewportRect.top + viewportRect.height / 2
      setView(
        view.x + (targetX - nodeRect.left - nodeRect.width / 2) / renderedScale,
        view.y + (targetY - nodeRect.top - nodeRect.height / 2) / renderedScale,
      )
    })
  })
}

function closeNodePanel() {
  selectedNodeId.value = null
  nextTick(() => workflowViewport.value?.focus({ preventScroll: true }))
}

function nodeTypeClass(type) {
  return `node-${String(type).toLowerCase()}`
}

function edgePath(edge) {
  const from = nodes.find((node) => node.id === edge.from)
  const to = nodes.find((node) => node.id === edge.to)
  if (!from || !to) return ''
  const startX = from.x + 12
  const startY = from.y + 5
  const endX = to.x
  const endY = to.y + 5
  const middleX = (startX + endX) / 2
  return `M ${startX} ${startY} C ${middleX} ${startY}, ${middleX} ${endY}, ${endX} ${endY}`
}

onMounted(() => {
  if (typeof ResizeObserver === 'undefined') return
  resizeObserver = new ResizeObserver(() => setView(view.x, view.y))
  if (workflowViewport.value) resizeObserver.observe(workflowViewport.value)
})

onBeforeUnmount(() => {
  stopPan()
  if (dragContext) stopNodeDrag()
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.zhipu-project {
  display: grid;
  gap: clamp(1.8rem, 4vw, 3.6rem);
  padding: clamp(1.25rem, 3vw, 2.75rem);
  color: #252a31;
}

.project-lead {
  display: grid;
  max-width: 58rem;
  gap: 0.75rem;
}

.project-lead p,
.reading-section header > p,
.boundary-section > p,
.system-boundary p {
  margin: 0;
  color: var(--project-accent);
  font: 700 0.68rem/1.2 var(--font-sans, sans-serif);
  letter-spacing: 0.14em;
}

.project-lead h3,
.reading-section h4 {
  margin: 0;
  font-family: var(--font-serif, serif);
  font-weight: 500;
}

.project-lead h3 {
  max-width: 20ch;
  font-size: clamp(1.7rem, 3.5vw, 3.2rem);
  line-height: 1.06;
}

.project-lead > span,
.reading-section p,
.reading-section header > span,
.reading-section dd,
.reading-section li,
.system-boundary span,
.node-panel > span {
  color: #626a74;
  font-size: clamp(0.8rem, 1.1vw, 0.96rem);
  line-height: 1.72;
}

.project-index {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid rgba(37, 42, 49, 0.22);
  border-bottom: 1px solid rgba(37, 42, 49, 0.22);
}

.project-index a {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  min-width: 0;
  padding: 0.8rem 0.6rem;
  border-right: 1px solid rgba(37, 42, 49, 0.14);
  color: #464e58;
  font-size: 0.75rem;
}

.project-index a:last-child { border-right: 0; }
.project-index a:hover { color: #1f252c; background: rgba(89, 106, 135, 0.07); }
.project-index span { color: var(--project-accent); font-size: 0.62rem; }

.reading-section {
  scroll-margin-top: 5rem;
  border-top: 1px solid rgba(37, 42, 49, 0.2);
  padding-top: 1rem;
}

.reading-section-split {
  display: grid;
  grid-template-columns: minmax(9rem, 0.55fr) minmax(0, 1.45fr);
  gap: clamp(1.3rem, 4vw, 4rem);
}

.reading-section h4 {
  margin-top: 0.45rem;
  font-size: clamp(1.3rem, 2.3vw, 2rem);
  line-height: 1.12;
}

.reading-section-split > div > p { margin: 0; }

.project-role {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 0.8rem;
  margin: 1.3rem 0 0;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(37, 42, 49, 0.14);
}

.project-role dt,
.work-evidence dt {
  color: #303741;
  font-size: 0.7rem;
  font-weight: 700;
}

.project-role dd,
.work-evidence dd { margin: 0; }

.system-section { display: grid; gap: 1.3rem; }
.system-section > header { display: grid; max-width: 52rem; gap: 0.45rem; }
.system-section > header > span { margin-top: 0.35rem; }

.system-boundary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid rgba(37, 42, 49, 0.16);
  border-bottom: 1px solid rgba(37, 42, 49, 0.16);
}

.system-boundary > div {
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
}

.system-boundary > div:first-child { border-right: 1px solid rgba(37, 42, 49, 0.16); }
.system-boundary strong { color: #303741; font-size: 0.86rem; }
.system-boundary span { font-size: 0.74rem; }

.workflow-shell {
  position: relative;
  height: clamp(32rem, 64vh, 40rem);
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgba(37, 42, 49, 0.2);
  background: #fbfbfa;
}

.workflow-viewport {
  position: absolute;
  inset: 0;
  overflow: hidden;
  cursor: grab;
  touch-action: none;
}

.workflow-viewport.is-panning { cursor: grabbing; }

.workflow-toolbar {
  position: absolute;
  top: 0.7rem;
  left: 0.7rem;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  border: 1px solid rgba(37, 42, 49, 0.16);
  background: rgba(251, 251, 250, 0.92);
  box-shadow: 0 0.6rem 1.5rem rgba(37, 42, 49, 0.09);
}

.workflow-toolbar button {
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  padding: 0;
  border: 1px solid rgba(37, 42, 49, 0.14);
  background: #fff;
  color: #343b44;
  cursor: pointer;
}

.workflow-toolbar button:disabled { opacity: 0.4; cursor: not-allowed; }
.workflow-toolbar .reset-button { width: 2.5rem; font-size: 0.64rem; }
.workflow-toolbar output { width: 2.8rem; color: #5f6873; font-size: 0.64rem; text-align: center; }

.workflow-canvas {
  position: relative;
  width: max(70rem, 100%);
  height: 100%;
  min-height: 32rem;
  transform-origin: 0 0;
  transition: transform 140ms ease;
  background:
    linear-gradient(rgba(37, 42, 49, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 42, 49, 0.045) 1px, transparent 1px),
    #fbfbfa;
  background-size: 1.5rem 1.5rem;
  will-change: transform;
}

.workflow-viewport.is-panning .workflow-canvas { transition: none; }

.workflow-edges {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.workflow-edges path {
  fill: none;
  stroke: rgba(37, 42, 49, 0.28);
  stroke-width: 2;
  stroke-linecap: round;
}

.workflow-node {
  --node-color: #506e9f;
  --node-soft: rgba(80, 110, 159, 0.12);

  position: absolute;
  z-index: 2;
  display: grid;
  gap: 0.28rem;
  width: 8.5rem;
  min-height: 4rem;
  padding: 0.5rem 0.55rem;
  border: 1px solid rgba(37, 42, 49, 0.18);
  border-left: 3px solid var(--node-color);
  border-radius: 0.45rem;
  background: linear-gradient(90deg, var(--node-soft), rgba(255, 255, 255, 0) 60%), #fff;
  color: #252a31;
  text-align: left;
  box-shadow: 0 0.6rem 1.4rem rgba(37, 42, 49, 0.08);
  cursor: grab;
  user-select: none;
  touch-action: none;
  transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
}

.workflow-node:hover,
.workflow-node.is-selected,
.workflow-node.is-dragging {
  border-color: var(--node-color);
  box-shadow: 0 0.9rem 1.8rem rgba(37, 42, 49, 0.14);
  transform: translateY(-2px);
}

.workflow-node.is-selected { outline: 2px solid var(--node-color); outline-offset: 2px; }
.workflow-node.is-dragging { cursor: grabbing; }

.node-meta { display: flex; justify-content: space-between; gap: 0.4rem; color: var(--node-color); }
.node-meta > span { font-size: 0.6rem; font-weight: 800; }
.node-meta small { font-size: 0.52rem; font-weight: 700; }
.workflow-node > strong { overflow: hidden; font-size: 0.74rem; text-overflow: ellipsis; white-space: nowrap; }
.workflow-node > small { color: #68717b; font-size: 0.62rem; line-height: 1.3; }

.node-preprocess { --node-color: #2f80ed; --node-soft: rgba(47, 128, 237, 0.12); }
.node-router { --node-color: #cf4562; --node-soft: rgba(207, 69, 98, 0.12); }
.node-action { --node-color: #c48618; --node-soft: rgba(196, 134, 24, 0.14); }
.node-qa { --node-color: #258e5d; --node-soft: rgba(37, 142, 93, 0.12); }
.node-llm { --node-color: #7359c5; --node-soft: rgba(115, 89, 197, 0.12); }

.node-panel {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  bottom: 0.8rem;
  z-index: 6;
  display: grid;
  align-content: start;
  gap: 0.65rem;
  width: min(17rem, calc(100% - 1.6rem));
  padding: 1rem;
  overflow: auto;
  visibility: hidden;
  opacity: 0;
  border-left: 2px solid var(--project-accent);
  background: rgba(251, 251, 250, 0.96);
  box-shadow: -1rem 1rem 2.2rem rgba(37, 42, 49, 0.14);
  pointer-events: none;
  transform: translateX(1rem);
  transition: opacity 170ms ease, transform 190ms ease, visibility 0s linear 190ms;
}

.node-panel.is-open {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
  transform: translateX(0);
  transition-delay: 0s;
}

.node-panel header { display: flex; align-items: center; justify-content: space-between; gap: 0.7rem; }
.node-panel header p { margin: 0; color: var(--project-accent); font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em; }
.node-panel header button { width: 1.7rem; height: 1.7rem; padding: 0; border: 1px solid rgba(37, 42, 49, 0.16); background: transparent; cursor: pointer; }
.node-panel > strong { font-family: var(--font-serif, serif); font-size: 1.25rem; }
.node-panel > span { font-size: 0.78rem; }

.workflow-hint { margin: -0.5rem 0 0; font-size: 0.7rem !important; }

.work-evidence { display: grid; gap: 1.2rem; }
.work-evidence ol { display: grid; gap: 0.65rem; margin: 0; padding-left: 1.2rem; }
.work-evidence dl { display: grid; gap: 0; margin: 0; border-top: 1px solid rgba(37, 42, 49, 0.16); }
.work-evidence dl > div { display: grid; grid-template-columns: 4rem 1fr; gap: 0.8rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(37, 42, 49, 0.12); }

.boundary-section { display: grid; gap: 0.45rem; }
.boundary-section blockquote {
  max-width: 52rem;
  margin: 0.5rem 0 0;
  padding: 0 0 0 1rem;
  border-left: 2px solid var(--project-accent);
  color: #4f5863;
  font: 500 clamp(0.9rem, 1.4vw, 1.08rem)/1.75 var(--font-sans, sans-serif);
}

@media (max-width: 760px) {
  .zhipu-project { gap: 1.7rem; padding: 1rem; }
  .project-index { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .project-index a:nth-child(2) { border-right: 0; }
  .project-index a:nth-child(-n + 2) { border-bottom: 1px solid rgba(37, 42, 49, 0.14); }
  .reading-section-split { grid-template-columns: 1fr; gap: 1rem; }
  .system-boundary { grid-template-columns: 1fr; }
  .system-boundary > div:first-child { border-right: 0; border-bottom: 1px solid rgba(37, 42, 49, 0.16); }
  .workflow-shell { height: 36rem; }
  .workflow-viewport { touch-action: pan-y; }
  .workflow-canvas { width: 68rem; min-height: 36rem; }
  .workflow-node { width: 8rem; }
  .node-panel { top: auto; left: 0.6rem; right: 0.6rem; bottom: 0.6rem; width: auto; max-height: 44%; border-left-width: 1px; border-top: 2px solid var(--project-accent); transform: translateY(1rem); }
  .node-panel.is-open { transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .workflow-canvas,
  .workflow-node,
  .node-panel {
    transition: none;
  }
}
</style>
