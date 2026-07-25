<template>
  <section
    id="zai"
    ref="projectSection"
    class="projects-page"
    :class="{ 'has-lid-opened': hasLidOpened }"
    aria-label="项目展示页"
  >
    <div class="projects-layout">
      <div class="macbook-stage" aria-label="项目电脑展示区">
        <div class="macbook-frame-shell">
          <div class="macbook-screen-slot" :style="screenTransitionStyle">
            <Transition name="screen-mode">
            <div v-if="!activeProjectId" key="desktop" class="mac-desktop" aria-label="项目桌面">
              <header class="desktop-menu">
                <div class="menu-left">
                  <span class="apple-mark" aria-hidden="true"></span>
                  <strong>访达</strong>
                  <span>文件</span>
                  <span>编辑</span>
                  <span>显示</span>
                  <span>前往</span>
                  <span>窗口</span>
                  <span>帮助</span>
                </div>
                <div class="menu-right">
                  <span class="menu-trailing-icons" aria-hidden="true">
                    <img src="/Menu Item - Trailing-0.png" alt="" draggable="false">
                    <img src="/Menu Item - Trailing-1.png" alt="" draggable="false">
                    <img src="/Menu Item - Trailing-2.png" alt="" draggable="false">
                    <img src="/Menu Item - Trailing-3.png" alt="" draggable="false">
                  </span>
                  <span>{{ menuDate }}</span>
                  <span>{{ menuTime }}</span>
                </div>
              </header>

              <div class="desktop-icons" aria-label="项目文件夹">
                <button
                  v-for="project in projects"
                  :key="project.id"
                  type="button"
                  class="desktop-folder"
                  @click="openProject(project.id, $event)"
                >
                  <span class="folder-icon" aria-hidden="true"></span>
                  <strong>{{ project.folderName }}</strong>
                </button>
              </div>

            </div>

            <div v-else key="project" class="screen-content">
              <div class="project-window-stack">
              <Transition :name="projectSlideTransition">
              <article
                v-if="activeProjectId === 'zhipu'"
                key="zhipu"
                class="screen-browser is-workflow"
                :class="{ 'has-node-panel': selectedWorkflowNode && showWorkflowNodePanel }"
              >
                <header class="browser-chrome">
                  <div class="window-dots">
                    <button type="button" class="window-close" aria-label="关闭窗口，回到项目桌面" @click="closeProject"></button>
                    <span></span>
                    <span></span>
                  </div>
                  <strong>城智大模型展示工作流</strong>
                </header>

                <div
                  ref="workflowViewport"
                  class="workflow-scroll"
                  :class="{ 'is-panning': isWorkflowPanning }"
                  aria-label="城智大模型工作流节点画布"
                  tabindex="0"
                  @pointerdown="startWorkflowPan"
                  @wheel="onWorkflowWheel"
                >
                  <div class="workflow-tools" aria-label="工作流视角控制" @pointerdown.stop>
                    <button
                      type="button"
                      class="workflow-tool"
                      aria-label="缩小工作流画布"
                      title="缩小"
                      :disabled="!canZoomOut"
                      @click="zoomWorkflowOut"
                    >
                      -
                    </button>
                    <span class="workflow-zoom-meter" aria-live="polite">{{ workflowZoomPercent }}</span>
                    <button
                      type="button"
                      class="workflow-tool"
                      aria-label="放大工作流画布"
                      title="放大"
                      :disabled="!canZoomIn"
                      @click="zoomWorkflowIn"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      class="workflow-tool workflow-tool-reset"
                      aria-label="重置工作流视角"
                      title="重置视角"
                      @click="resetWorkflowViewport"
                    >
                      1:1
                    </button>
                  </div>

                  <div ref="workflowCanvas" class="workflow-canvas" :style="workflowCanvasStyle">
                    <svg class="workflow-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
                      <path
                        v-for="edge in edges"
                        :key="edge.id"
                        :d="edgePath(edge)"
                      />
                    </svg>

                    <button
                      v-for="node in nodes"
                      :key="node.id"
                      type="button"
                      class="workflow-node"
                      :data-node-id="node.id"
                      :class="[
                        nodeTypeClass(node.type),
                        {
                          'is-dragging': activeNodeId === node.id,
                          'is-selected': selectedWorkflowNodeId === node.id,
                        },
                      ]"
                      :style="{ left: `${node.x}%`, top: `${node.y}%` }"
                      :aria-label="`${node.id} ${node.name}，${node.brief}`"
                      @focus="focusWorkflowNode(node.id)"
                      @click="selectWorkflowNode(node.id)"
                      @pointerdown="startNodeDrag($event, node)"
                    >
                      <span class="workflow-node-meta">
                        <span class="node-label">{{ node.id }}</span>
                        <span class="node-type">{{ node.type }}</span>
                      </span>
                      <strong>{{ node.name }}</strong>
                      <small>{{ node.brief }}</small>
                    </button>
                  </div>
                </div>

                <aside
                  class="workflow-node-panel"
                  :class="{ 'is-open': selectedWorkflowNode && showWorkflowNodePanel }"
                  :aria-hidden="!(selectedWorkflowNode && showWorkflowNodePanel)"
                  :aria-live="showWorkflowNodePanel ? 'polite' : 'off'"
                  :inert="!(selectedWorkflowNode && showWorkflowNodePanel)"
                  @pointerdown.stop
                  @wheel.stop
                >
                  <header>
                    <p>当前节点 · {{ selectedWorkflowNode?.type }}</p>
                    <button
                      type="button"
                      class="workflow-panel-close"
                      aria-label="关闭节点说明"
                      title="关闭"
                      @click="closeWorkflowNodePanel"
                    >
                      ×
                    </button>
                  </header>
                  <strong>{{ selectedWorkflowNode?.name }}</strong>
                  <span>{{ selectedWorkflowNode?.detail }}</span>
                </aside>
              </article>

              <article v-else-if="activeProjectId === 'defect'" key="defect" class="screen-browser is-video" aria-label="智能缺陷分析系统视频展示">
                <header class="browser-chrome">
                  <div class="window-dots">
                    <button type="button" class="window-close" aria-label="关闭窗口，回到项目桌面" @click="closeProject"></button>
                    <span></span>
                    <span></span>
                  </div>
                  <strong>智能缺陷分析系统 · 演示视频</strong>
                </header>
                <div class="video-panel" aria-label="视频展示占位">
          <video
            v-if="activeProject.videoSrc"
            :src="activeProject.videoSrc"
            controls
            playsinline
            @play="hideDefectCertificate"
          ></video>
                  <div v-else class="video-placeholder">
                    <span></span>
                    <strong>视频文件占位</strong>
                    <p>后续放入智能缺陷分析系统演示视频</p>
                  </div>
                </div>
              </article>

              <article v-else key="ganttodo" class="screen-browser is-iframe" aria-label="甘特图待办系统在线体验">
                <header class="browser-chrome">
                  <div class="window-dots">
                    <button type="button" class="window-close" aria-label="关闭窗口，回到项目桌面" @click="closeProject"></button>
                    <span></span>
                    <span></span>
                  </div>
                  <strong>Smart Ganttodo · GitHub Pages</strong>
                </header>
                <div ref="ganttViewport" class="iframe-scale-viewport">
                  <div v-if="!ganttFrameLoaded" class="iframe-loading" role="status" aria-live="polite">
                    <span class="loading-ring" aria-hidden="true"></span>
                    <strong>正在加载在线体验</strong>
                    <p>项目部署在 GitHub Pages，部分网络环境可能需要科学上网。</p>
                  </div>
                  <iframe
                    src="https://yva1nne.github.io/Smart-Ganttodo/"
                    title="甘特图风格化待办系统在线体验"
                    loading="lazy"
                    :style="ganttFrameStyle"
                    @load="onGanttFrameLoad"
                  ></iframe>
                </div>
              </article>
              </Transition>
              </div>
            </div>
            </Transition>
          </div>

          <img
            class="macbook-frame-image"
            src="/macbook-frame.png"
            alt=""
            aria-hidden="true"
            draggable="false"
          />

          <Transition name="certificate-note">
            <div v-if="showDefectCertificate" class="defect-certificate-note" aria-hidden="true">
              <img
                class="defect-certificate-paper"
                src="/project/获奖证书.png"
                alt=""
                draggable="false"
              />
              <img
                class="defect-certificate-sticker"
                src="/project/贴纸.png"
                alt=""
                draggable="false"
              />
            </div>
          </Transition>
        </div>
      </div>

      <aside class="project-notes project-inspector" aria-label="项目导览说明" aria-live="polite">
        <nav class="project-tabs" aria-label="项目目录">
          <button
            type="button"
            class="project-tab"
            :class="{ 'is-active': !activeProjectId }"
            @click="closeProject"
          >
            项目总览
          </button>

          <button
            v-for="project in projects"
            :key="project.id"
            type="button"
            class="project-tab"
            :class="{ 'is-active': activeProjectId === project.id }"
            @click="openProject(project.id)"
          >
            {{ project.folderName }}
          </button>
        </nav>

        <Transition name="tab-copy" mode="out-in">
          <div :key="activeProject.title" class="project-brief">
            <p class="project-kicker">{{ activeProject.kicker }}</p>
            <h2>{{ activeProject.title }}</h2>
            <p class="project-tab-copy">{{ activeProject.summary }}</p>

            <dl class="project-facts">
              <div v-if="activeProject.role">
                <dt>角色</dt>
                <dd>{{ activeProject.role }}</dd>
              </div>
              <div v-if="activeProject.problem">
                <dt>问题</dt>
                <dd>{{ activeProject.problem }}</dd>
              </div>
              <div v-if="activeProject.proof">
                <dt>验证</dt>
                <dd>{{ activeProject.proof }}</dd>
              </div>
            </dl>

            <div v-if="activeProject.focus?.length" class="project-focus">
              <strong>看点</strong>
              <ul>
                <li v-for="item in activeProject.focus" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </Transition>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, nextTick, watch, onMounted, onUnmounted } from 'vue'

const workflowViewport = ref(null)
const workflowCanvas = ref(null)
const ganttViewport = ref(null)
const projectSection = ref(null)
const activeNodeId = ref(null)
const selectedWorkflowNodeId = ref('N1')
const showWorkflowNodePanel = ref(false)
const isWorkflowPanning = ref(false)
const activeProjectId = ref(null)
const menuDate = ref('')
const menuTime = ref('')
const ganttFrameLoaded = ref(false)
const hasLidOpened = ref(false)
const defectVideoStarted = ref(false)
const folderOriginX = ref('50%')
const folderOriginY = ref('42%')
const projectSlideDirection = ref('forward')
let menuClockTimer = null
let ganttResizeObserver = null
let projectEntryObserver = null
let workflowPanContext = null

const ganttFrameWidth = 1180
const ganttFrameHeight = 760
const ganttFrameScale = ref(1)
const ganttFrameStyle = computed(() => ({
  width: `${ganttFrameWidth}px`,
  height: `${ganttFrameHeight}px`,
  transform: `translate(-50%, -50%) scale(${ganttFrameScale.value})`,
}))
const screenTransitionStyle = computed(() => ({
  '--folder-origin-x': folderOriginX.value,
  '--folder-origin-y': folderOriginY.value,
}))
const projectSlideTransition = computed(() => (
  projectSlideDirection.value === 'backward' ? 'project-slide-backward' : 'project-slide-forward'
))
const showDefectCertificate = computed(() => activeProjectId.value === 'defect' && !defectVideoStarted.value)
const workflowMinScale = 0.74
const workflowMaxScale = 1.52
const workflowZoomStep = 0.14
const workflowCanvasInset = 28
const workflowVerticalInset = 96
const workflowView = reactive({ x: 0, y: 0, scale: 1 })
const workflowCanvasStyle = computed(() => ({
  transform: `translate3d(${workflowView.x}px, ${workflowView.y}px, 0) scale(${workflowView.scale})`,
}))
const workflowZoomPercent = computed(() => `${Math.round(workflowView.scale * 100)}%`)
const canZoomIn = computed(() => workflowView.scale < workflowMaxScale - 0.01)
const canZoomOut = computed(() => workflowView.scale > workflowMinScale + 0.01)

const desktopProject = {
  kicker: 'Projects · Desktop',
  title: '项目工作台',
  summary: '从电脑桌面进入三个项目。左侧保留可操作展示，右侧同步说明当前项目应该怎么看。',
  role: '浏览入口',
  problem: '避免把项目演示和文字说明拆成两个页面，减少来回对照。',
  proof: '点击文件夹进入项目，点击窗口左上角红点回到桌面。',
  focus: ['先看电脑里的交互或视频，再用右侧导览抓住项目定位。', '每个项目复用同一套窗口样式，减少视觉跳变。'],
}

const projects = [
  {
    id: 'zhipu',
    index: '01',
    folderName: '智谱华章实习',
    short: '展示型 LLM 工作流',
    kicker: 'Project 01 · Zhipu AI',
    title: '智谱华章实习',
    summary: '围绕城智大模型大屏，把语音入口、意图路由、页面跳转、场景讲解和问答子流程串成展示型 LLM-driven workflow。',
    role: 'AI 产品经理实习生',
    problem: '现场汇报既要稳定控制大屏动作，也要承接参观者围绕业务场景的自然语言追问。',
    proof: '主导 5 个大屏、14 个页面的展示方案，并设计 ASR 纠错、意图路由、讲解、问答与兜底链路。',
    focus: ['LLM 负责自然语言理解、路由匹配和受控生成。', 'Workflow 负责确定性跳屏、讲解流程、问答子链路、兜底、日志和回归。', 'ASR 纠错是语音路径第一步，先降低专名和口误对后续路由的影响。'],
  },
  {
    id: 'defect',
    index: '02',
    folderName: '智能缺陷分析系统',
    short: '缺陷分析与根因检索',
    kicker: 'Project 02 · Defect Analysis',
    title: '智能缺陷分析系统',
    summary: '面向半导体产线 YE 工程师 RCA 阶段，把缺陷分类、分割、语义描述和历史根因检索整合成辅助分析报告。',
    role: '产品 + 核心开发成员',
    problem: '良率异常后，工程师需要快速判断缺陷类型、位置、形貌和历史相似案例。',
    proof: '基于 2000+ 张真实产线数据完成验证；检索模块 0.03s 时延、Rank-1 准确率 96.2%。',
    focus: ['系统不是自动给最终根因，而是辅助 YE 缩小排查范围。', '个人主责 DRNet 根因检索模块、GUI 搭建和系统集成。', '视频区域用于承载完整演示链路。'],
    videoSrc: '/新版一分钟展示.mp4',
  },
  {
    id: 'ganttodo',
    index: '03',
    folderName: '甘特图风格化待办系统',
    short: '在线体验 MVP',
    kicker: 'Project 03 · Smart Ganttodo',
    title: '甘特图风格化待办系统',
    summary: '一个轻量个人工作流 MVP，用自然语言输入降低任务创建和调整成本，用甘特图表达跨天任务与长期计划。',
    role: 'AI 产品经理 / 独立开发',
    problem: '普通待办不擅长跨天规划，重型项目管理工具又对个人任务过重。',
    proof: '已部署到 GitHub Pages，验证“自然语言生成初稿 + 甘特图可视化修正”的核心链路。',
    focus: ['核心链路：自然语言输入 -> JSON actions -> Gantt state -> 拖拽编辑。', '用 Prompt 约束、日历参照表和时区锁定降低时间推理错误。', '当前定位是个人 MVP，不包装成完整项目管理工具。'],
  },
]

const activeProject = computed(() => (
  projects.find((project) => project.id === activeProjectId.value) || desktopProject
))
const selectedWorkflowNode = computed(() => {
  if (activeProjectId.value !== 'zhipu') return null
  return nodes.find((node) => node.id === selectedWorkflowNodeId.value) || null
})

const fallbackFolderOrigins = {
  zhipu: ['32%', '38%'],
  defect: ['50%', '38%'],
  ganttodo: ['68%', '38%'],
}
const projectOrder = ['zhipu', 'defect', 'ganttodo']

const nodes = reactive([
  {
    id: 'N0',
    name: 'ASR纠错',
    type: 'Preprocess',
    next: ['N1'],
    brief: '修正语音转写',
    detail: '语音路径的第一步。基于易混词库修正专名、口误和识别偏差，先把输入改写成更稳定的文本，再进入意图路由。',
    x: 5,
    y: 45,
  },
  {
    id: 'N1',
    name: '一级意图识别',
    type: 'Router',
    next: ['N2', 'N3', 'N5', 'N6', 'N7'],
    brief: '识别用户意图',
    detail: '用轻量模型识别问答、讲解、跳转、闲聊、澄清等一级意图。提示词约束角色、任务、输出格式、词典、判定规则、few-shot、意图示例和当前上下文，只做路由，不直接承担完整回答。',
    x: 21,
    y: 45,
  },
  {
    id: 'N2',
    name: '页面跳转',
    type: 'Action',
    next: [],
    brief: '切换目标页面',
    detail: '把跳转意图转成包含领域标识的 JSON 结构体，交给前端执行页面切换。操作类请求走确定性动作，保证现场演示稳定、可复现。',
    x: 41,
    y: 10,
  },
  {
    id: 'N3',
    name: '场景讲解',
    type: 'Action',
    next: [],
    brief: '执行讲解流程',
    detail: '进入对应场景后触发自动讲解，围绕当前大屏素材组织话术。讲解链路与页面状态绑定，避免脱离展示内容自由发挥。',
    x: 41,
    y: 28,
  },
  {
    id: 'N5',
    name: '问答入口',
    type: 'Router',
    next: ['N5-1'],
    brief: '进入场景问答',
    detail: '把问答请求路由到业务场景专属子工作流。主路由和场景问答解耦，方便复用同构流程，也便于联调、badcase 复现和 Prompt 调优。',
    x: 41,
    y: 46,
  },
  {
    id: 'N6',
    name: '通用回复',
    type: 'LLM',
    next: [],
    brief: '处理闲聊问答',
    detail: '承接问候、帮助、时间等通用型问题，保留基础互动能力，同时不把业务问答边界无限扩大。',
    x: 41,
    y: 64,
  },
  {
    id: 'N7',
    name: '澄清与拦截',
    type: 'LLM',
    next: [],
    brief: '确认或拒答越界请求',
    detail: '遇到歧义问题时要求补充信息；超出当前场景支持范围时进行拒答，并提示用户可以询问的业务范围。',
    x: 41,
    y: 82,
  },
  {
    id: 'N5-1',
    name: '场景问答模板匹配',
    type: 'Router',
    next: ['N5-2', 'N5-3', 'N5-4'],
    brief: '匹配标准问题',
    detail: '判断问题是否命中预设问答模板。模板来自客调后沉淀的严谨汇报口径；路由阶段使用较小模型提升匹配效率。',
    x: 61,
    y: 46,
  },
  {
    id: 'N5-2',
    name: '模板回答',
    type: 'QA',
    next: [],
    brief: '回答标准问题',
    detail: '命中模板后，基于问答模板和实时数据生成回答。目标是让高频问题稳定输出专业、完整、可控的汇报口径。',
    x: 80,
    y: 32,
  },
  {
    id: 'N5-3',
    name: '自主问答',
    type: 'QA',
    next: [],
    brief: '知识库生成回答',
    detail: '未命中标准模板时，结合场景资料、实时数据和问答模板 few-shot 组织答案，在开放问法下尽量保持专业性和场景一致性。',
    x: 80,
    y: 50,
  },
  {
    id: 'N5-4',
    name: '兜底回复',
    type: 'LLM',
    next: [],
    brief: '处理范围外问题',
    detail: '当问题不适合继续生成答案时，回到当前场景支持范围，避免模型在展示场景中给出不确定或越界内容。',
    x: 80,
    y: 68,
  },
])

const edges = computed(() => (
  nodes.flatMap((node) => (
    node.next.map((targetId) => ({
      id: `${node.id}-${targetId}`,
      from: node.id,
      to: targetId,
    }))
  ))
))

let dragContext = null

function workflowPanelReserve() {
  if (!showWorkflowNodePanel.value) return workflowCanvasInset
  const panel = workflowViewport.value
    ?.closest?.('.screen-browser')
    ?.querySelector?.('.workflow-node-panel')

  return (panel?.offsetWidth || 220) + workflowCanvasInset * 2
}

function workflowViewBounds(scale = workflowView.scale) {
  const viewport = workflowViewport.value
  const canvas = workflowCanvas.value
  if (!viewport || !canvas) return { minX: 0, maxX: 0, minY: 0, maxY: 0 }

  const viewportRect = viewport.getBoundingClientRect()
  const scaledWidth = canvas.offsetWidth * scale
  const scaledHeight = canvas.offsetHeight * scale
  const rightReserve = workflowPanelReserve()

  return {
    minX: Math.min(0, viewportRect.width - scaledWidth - rightReserve),
    maxX: workflowCanvasInset,
    minY: Math.min(0, viewportRect.height - scaledHeight - workflowVerticalInset),
    maxY: workflowVerticalInset,
  }
}

function setWorkflowView(nextX, nextY, nextScale = workflowView.scale) {
  const scale = clamp(nextScale, workflowMinScale, workflowMaxScale)
  const bounds = workflowViewBounds(scale)

  workflowView.scale = Number(scale.toFixed(2))
  workflowView.x = Math.round(clamp(nextX, bounds.minX, bounds.maxX) * 10) / 10
  workflowView.y = Math.round(clamp(nextY, bounds.minY, bounds.maxY) * 10) / 10
}

function zoomWorkflow(delta, anchorEvent = null) {
  const nextScale = clamp(workflowView.scale + delta, workflowMinScale, workflowMaxScale)
  if (nextScale === workflowView.scale) return

  const viewport = workflowViewport.value
  const viewportRect = viewport?.getBoundingClientRect()
  const anchorX = anchorEvent && viewportRect ? anchorEvent.clientX - viewportRect.left : (viewportRect?.width ?? 0) / 2
  const anchorY = anchorEvent && viewportRect ? anchorEvent.clientY - viewportRect.top : (viewportRect?.height ?? 0) / 2
  const ratio = nextScale / workflowView.scale
  const nextX = anchorX - (anchorX - workflowView.x) * ratio
  const nextY = anchorY - (anchorY - workflowView.y) * ratio

  setWorkflowView(nextX, nextY, nextScale)
}

function zoomWorkflowIn() {
  zoomWorkflow(workflowZoomStep)
}

function zoomWorkflowOut() {
  zoomWorkflow(-workflowZoomStep)
}

function resetWorkflowViewport() {
  workflowView.x = 0
  workflowView.y = 0
  workflowView.scale = 1
}

function revealWorkflowNode(nodeId) {
  nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const viewport = workflowViewport.value
        const canvas = workflowCanvas.value
        const nodeEl = Array.from(canvas?.querySelectorAll?.('.workflow-node') || [])
          .find((element) => element.dataset.nodeId === nodeId)

        if (!viewport || !canvas || !nodeEl) return

        const panel = viewport.closest?.('.screen-browser')?.querySelector?.('.workflow-node-panel')
        const viewportRect = viewport.getBoundingClientRect()
        const canvasRect = canvas.getBoundingClientRect()
        const nodeRect = nodeEl.getBoundingClientRect()
        const panelRect = panel?.getBoundingClientRect()
        const safeRight = panelRect?.left ?? viewportRect.right
        const safeCenterX = (viewportRect.left + safeRight) / 2
        const safeCenterY = viewportRect.top + viewportRect.height / 2
        const nodeCenterX = nodeRect.left + nodeRect.width / 2
        const nodeCenterY = nodeRect.top + nodeRect.height / 2
        const renderedUnit = canvas.offsetWidth
          ? canvasRect.width / (canvas.offsetWidth * workflowView.scale)
          : 1
        const nextX = workflowView.x + (safeCenterX - nodeCenterX) / renderedUnit
        const nextY = workflowView.y + (safeCenterY - nodeCenterY) / renderedUnit

        setWorkflowView(nextX, nextY)
      })
    })
  })
}

function startWorkflowPan(event) {
  if (event.button !== 0) return
  if (event.target.closest?.('.workflow-node, .workflow-tools')) return

  event.preventDefault()
  isWorkflowPanning.value = true
  workflowPanContext = {
    startX: event.clientX,
    startY: event.clientY,
    viewX: workflowView.x,
    viewY: workflowView.y,
  }

  try {
    event.currentTarget.setPointerCapture?.(event.pointerId)
  } catch { /* pointer capture is optional */ }

  window.addEventListener('pointermove', onWorkflowPanMove)
  window.addEventListener('pointerup', stopWorkflowPan)
  window.addEventListener('pointercancel', stopWorkflowPan)
}

function onWorkflowPanMove(event) {
  if (!workflowPanContext) return
  const nextX = workflowPanContext.viewX + event.clientX - workflowPanContext.startX
  const nextY = workflowPanContext.viewY + event.clientY - workflowPanContext.startY

  setWorkflowView(nextX, nextY)
}

function stopWorkflowPan() {
  workflowPanContext = null
  isWorkflowPanning.value = false
  window.removeEventListener('pointermove', onWorkflowPanMove)
  window.removeEventListener('pointerup', stopWorkflowPan)
  window.removeEventListener('pointercancel', stopWorkflowPan)
}

function onWorkflowWheel(event) {
  event.preventDefault()
  const wheelUnit = event.deltaMode === 1 ? 16 : 1

  if (event.ctrlKey || event.metaKey || event.altKey) {
    zoomWorkflow(event.deltaY > 0 ? -workflowZoomStep : workflowZoomStep, event)
    return
  }

  const deltaX = event.deltaX * wheelUnit
  const deltaY = event.deltaY * wheelUnit
  const horizontalDelta = Math.abs(deltaX) > 0 ? deltaX : deltaY
  const verticalDelta = Math.abs(deltaX) > 0 ? deltaY : 0

  setWorkflowView(workflowView.x - horizontalDelta, workflowView.y - verticalDelta)
}

function startNodeDrag(event, node) {
  const canvas = workflowCanvas.value
  if (!canvas) return

  event.preventDefault()
  event.stopPropagation()
  activeNodeId.value = node.id
  selectWorkflowNode(node.id, { reveal: false })

  const rect = canvas.getBoundingClientRect()
  dragContext = {
    node,
    rect,
    startX: event.clientX,
    startY: event.clientY,
    nodeX: node.x,
    nodeY: node.y,
    hasMoved: false,
  }

  try {
    event.currentTarget.setPointerCapture?.(event.pointerId)
  } catch { /* pointer capture is optional */ }

  window.addEventListener('pointermove', onNodeMove)
  window.addEventListener('pointerup', stopNodeDrag)
  window.addEventListener('pointercancel', stopNodeDrag)
}

function focusWorkflowNode(nodeId) {
  selectedWorkflowNodeId.value = nodeId
}

function selectWorkflowNode(nodeId, options = {}) {
  focusWorkflowNode(nodeId)
  showWorkflowNodePanel.value = true
  if (options.reveal !== false) {
    revealWorkflowNode(nodeId)
  }
}

function closeWorkflowNodePanel() {
  showWorkflowNodePanel.value = false
}

function nodeTypeClass(type) {
  return `node-${String(type).toLowerCase()}`
}

function onNodeMove(event) {
  if (!dragContext) return
  const { node, rect, startX, startY, nodeX, nodeY } = dragContext
  const moveX = event.clientX - startX
  const moveY = event.clientY - startY
  if (Math.abs(moveX) > 3 || Math.abs(moveY) > 3) {
    dragContext.hasMoved = true
  }
  const nextX = nodeX + (moveX / rect.width) * 100
  const nextY = nodeY + (moveY / rect.height) * 100

  node.x = clamp(nextX, 5, 82)
  node.y = clamp(nextY, 8, 82)
}

function stopNodeDrag() {
  const nodeId = dragContext?.node.id
  const shouldReveal = dragContext && !dragContext.hasMoved
  dragContext = null
  activeNodeId.value = null
  window.removeEventListener('pointermove', onNodeMove)
  window.removeEventListener('pointerup', stopNodeDrag)
  window.removeEventListener('pointercancel', stopNodeDrag)
  if (shouldReveal && nodeId) {
    revealWorkflowNode(nodeId)
  }
}

function edgePath(edge) {
  const from = nodes.find((node) => node.id === edge.from)
  const to = nodes.find((node) => node.id === edge.to)
  if (!from || !to) return ''

  const startX = from.x * 10 + 100
  const startY = from.y * 6.2 + 30
  const endX = to.x * 10 + 20
  const endY = to.y * 6.2 + 30
  const midX = (startX + endX) / 2

  return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function setTransitionOriginFromEvent(event, projectId) {
  const target = event?.currentTarget
  const screen = target?.closest?.('.macbook-screen-slot')
  const fallback = fallbackFolderOrigins[projectId] || ['50%', '42%']

  if (!target || !screen) {
    folderOriginX.value = fallback[0]
    folderOriginY.value = fallback[1]
    return
  }

  const targetRect = target.getBoundingClientRect()
  const screenRect = screen.getBoundingClientRect()
  const originX = ((targetRect.left + targetRect.width / 2 - screenRect.left) / screenRect.width) * 100
  const originY = ((targetRect.top + targetRect.height / 2 - screenRect.top) / screenRect.height) * 100

  folderOriginX.value = `${clamp(originX, 8, 92).toFixed(2)}%`
  folderOriginY.value = `${clamp(originY, 8, 92).toFixed(2)}%`
}

function openProject(projectId, event) {
  if (activeProjectId.value === projectId) return
  const currentIndex = projectOrder.indexOf(activeProjectId.value)
  const nextIndex = projectOrder.indexOf(projectId)
  if (currentIndex !== -1 && nextIndex !== -1) {
    projectSlideDirection.value = nextIndex > currentIndex ? 'forward' : 'backward'
  } else {
    projectSlideDirection.value = 'forward'
  }
  setTransitionOriginFromEvent(event, projectId)
  activeProjectId.value = projectId
  if (projectId === 'zhipu') {
    selectedWorkflowNodeId.value = 'N1'
    showWorkflowNodePanel.value = false
    resetWorkflowViewport()
  } else {
    showWorkflowNodePanel.value = false
  }
}

function closeProject() {
  if (!activeProjectId.value) return
  activeProjectId.value = null
  showWorkflowNodePanel.value = false
}

function hideDefectCertificate() {
  defectVideoStarted.value = true
}

function updateMenuClock() {
  const now = new Date()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  menuDate.value = `${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}`
  menuTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function updateGanttFrameScale() {
  const viewport = ganttViewport.value
  if (!viewport) return

  const width = viewport.clientWidth
  const height = viewport.clientHeight
  if (!width || !height) return

  ganttFrameScale.value = Math.min(width / ganttFrameWidth, height / ganttFrameHeight)
}

function observeGanttViewport() {
  ganttResizeObserver?.disconnect()
  ganttResizeObserver = null

  const viewport = ganttViewport.value
  if (!viewport) return

  ganttResizeObserver = new ResizeObserver(updateGanttFrameScale)
  ganttResizeObserver.observe(viewport)
  updateGanttFrameScale()
}

function onGanttFrameLoad() {
  ganttFrameLoaded.value = true
}

watch(activeProjectId, async (projectId) => {
  if (projectId === 'defect') {
    defectVideoStarted.value = false
  }

  if (projectId !== 'ganttodo') {
    ganttResizeObserver?.disconnect()
    ganttResizeObserver = null
    ganttFrameLoaded.value = false
    return
  }

  ganttFrameLoaded.value = false
  await nextTick()
  observeGanttViewport()
})

onMounted(() => {
  updateMenuClock()
  menuClockTimer = window.setInterval(updateMenuClock, 60_000)
  if (activeProjectId.value === 'ganttodo') observeGanttViewport()

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    hasLidOpened.value = true
    return
  }

  projectEntryObserver = new IntersectionObserver(
    ([entry]) => {
      const ratio = entry?.intersectionRatio ?? 0
      if (ratio >= 0.38) {
        hasLidOpened.value = true
      } else if (ratio <= 0.08) {
        hasLidOpened.value = false
      }
    },
    { threshold: [0, 0.08, 0.38, 0.62] },
  )

  if (projectSection.value) projectEntryObserver.observe(projectSection.value)
})

onUnmounted(() => {
  stopNodeDrag()
  stopWorkflowPan()
  if (menuClockTimer) window.clearInterval(menuClockTimer)
  ganttResizeObserver?.disconnect()
  projectEntryObserver?.disconnect()
})
</script>

<style scoped>
.projects-page {
  --project-layout-width: min(calc(100vw - 32px), 1640px);
  --project-notes-width: clamp(280px, 20vw, 340px);

  min-height: 100svh;
  padding: clamp(20px, 2.4vw, 36px) 0 clamp(58px, 6vw, 86px);
  overflow: hidden;
  background: #e4e5e4;
  color: #151718;
}

.projects-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--project-notes-width);
  gap: clamp(16px, 1.8vw, 28px);
  align-items: center;
  width: var(--project-layout-width);
  margin: 0 auto;
  min-height: calc(100svh - clamp(78px, 8vw, 122px));
}

.project-notes {
  width: auto;
  max-height: min(760px, calc(100svh - 96px));
  margin: 0;
  padding-left: clamp(14px, 1.6vw, 24px);
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-gutter: stable;
  border-left: 1px solid rgba(21, 23, 24, 0.16);
  min-width: 0;
}

.project-tabs {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
  margin-bottom: clamp(16px, 2vw, 24px);
}

.project-tab {
  position: relative;
  min-height: 34px;
  padding: 7px 10px;
  border: 1px solid rgba(21, 23, 24, 0.12);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.26);
  color: rgba(21, 23, 24, 0.58);
  font-family: 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.18;
  text-align: left;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease, color 160ms ease;
}

.project-tab:hover,
.project-tab.is-active {
  border-color: rgba(21, 23, 24, 0.28);
  background: rgba(255, 255, 255, 0.62);
  color: #151718;
}

.project-brief {
  display: grid;
  gap: clamp(12px, 1.4vw, 18px);
}

.project-kicker {
  margin: 0;
  color: rgba(21, 23, 24, 0.5);
  font-size: 11px;
  font-weight: 800;
  line-height: 1.1;
  text-transform: uppercase;
}

.project-brief h2 {
  margin: 0;
  color: #151718;
  font-family: var(--font-serif);
  font-size: clamp(22px, 2.2vw, 34px);
  font-weight: 700;
  line-height: 1.08;
}

.project-tab-copy {
  margin: 0;
  color: rgba(21, 23, 24, 0.68);
  font-family: 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.62;
  text-align: left;
}

.project-facts {
  display: grid;
  gap: 9px;
  margin: 0;
}

.project-facts div {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 10px;
}

.project-facts dt {
  color: rgba(21, 23, 24, 0.46);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.55;
}

.project-facts dd {
  margin: 0;
  color: rgba(21, 23, 24, 0.74);
  font-size: 12px;
  line-height: 1.55;
}

.project-focus {
  display: grid;
  gap: 8px;
  color: rgba(21, 23, 24, 0.72);
}

.project-focus > strong {
  color: #151718;
  font-size: 13px;
  line-height: 1.2;
}

.project-focus ul {
  display: grid;
  gap: 7px;
  margin: 0;
  padding-left: 1.1em;
}

.project-focus li {
  font-size: 12px;
  line-height: 1.5;
}

.tab-copy-enter-active,
.tab-copy-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.tab-copy-enter-from,
.tab-copy-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.macbook-stage {
  position: relative;
  display: grid;
  justify-items: center;
  width: 100%;
  min-width: 0;
  perspective: 1800px;
  perspective-origin: 50% 88%;
}

.macbook-frame-shell {
  position: relative;
  width: min(100%, calc((100svh - 92px) * 1.5), 1320px);
  aspect-ratio: 1536 / 1024;
  filter: none;
  transform: translateY(64px) rotateX(-64deg) scale(0.92);
  transform-origin: 50% 91%;
  transform-style: preserve-3d;
  transition:
    transform 1900ms cubic-bezier(0.16, 0.78, 0.22, 1);
  will-change: transform;
}

.projects-page.has-lid-opened .macbook-frame-shell {
  filter: none;
  transform: translateY(0) rotateX(0deg) scale(1);
}

.projects-page:not(.has-lid-opened) .macbook-frame-shell {
  filter: none;
}

.project-notes {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 680ms ease,
    transform 680ms ease;
  transition-delay: 980ms;
}

.projects-page.has-lid-opened .project-notes {
  opacity: 1;
  transform: translateY(0);
}

.macbook-screen-slot {
  position: absolute;
  left: 12.15%;
  top: 7.85%;
  z-index: 1;
  display: block;
  width: 75.55%;
  height: 77.7%;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
  background:
    linear-gradient(180deg, #2c8bc4 0%, #52a6d2 42%, #58b7c2 43%, #2385a0 58%, #7abfb6 78%, #d1dbbd 100%);
}

.macbook-screen-slot::before {
  position: absolute;
  inset: -2px;
  z-index: -1;
  background: #d4e5f1;
  content: '';
}

.macbook-frame-image {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.defect-certificate-note {
  --certificate-rotate: 4deg;

  position: absolute;
  top: 12.4%;
  right: 3.6%;
  z-index: 4;
  width: 24.4%;
  pointer-events: none;
  filter: drop-shadow(12px 14px 14px rgba(17, 31, 42, 0.24));
  transform: rotate(var(--certificate-rotate));
  transform-origin: 50% 8%;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: opacity, transform;
}

.defect-certificate-paper,
.defect-certificate-sticker {
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.defect-certificate-paper {
  width: 100%;
  height: auto;
}

.defect-certificate-sticker {
  position: absolute;
  left: 50%;
  top: -4.8%;
  width: 15.5%;
  height: auto;
  transform: translateX(-50%) rotate(-8deg);
  transform-origin: center;
}

.certificate-note-enter-active,
.certificate-note-leave-active {
  pointer-events: none;
}

.certificate-note-enter-active {
  animation: certificate-paper-drop 620ms cubic-bezier(0.22, 0.72, 0.24, 1) both;
}

.certificate-note-leave-active {
  animation: certificate-paper-lift 620ms cubic-bezier(0.28, 0.02, 0.18, 1) both;
}

@keyframes certificate-paper-drop {
  0% {
    opacity: 0;
    transform: translate3d(10px, -28px, 0) rotate(0deg) skew(-1.2deg, 0.4deg) scale(1.018);
  }

  72% {
    opacity: 1;
    transform: translate3d(1px, 2px, 0) rotate(4.6deg) skew(0.25deg, -0.12deg) scale(1.002);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(var(--certificate-rotate)) skew(0deg, 0deg) scale(1);
  }
}

@keyframes certificate-paper-lift {
  0% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(var(--certificate-rotate)) skew(0deg, 0deg) scale(1);
  }

  36% {
    opacity: 1;
    transform: translate3d(8px, -7px, 0) rotate(7deg) skew(-2.6deg, 1deg) scale(1.006);
  }

  100% {
    opacity: 0;
    transform: translate3d(64px, -44px, 0) rotate(13deg) skew(-5deg, 1.6deg) scale(0.982);
  }
}

.mac-desktop {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #2d90c8;
  background:
    url('/wallpaper.png') center / cover no-repeat,
    radial-gradient(ellipse at 52% 56%, rgba(46, 70, 76, 0.42) 0 8%, transparent 8.5%),
    radial-gradient(ellipse at 26% 68%, rgba(232, 238, 225, 0.76) 0 8%, transparent 8.5%),
    radial-gradient(ellipse at 78% 72%, rgba(218, 224, 210, 0.72) 0 7%, transparent 7.5%),
    linear-gradient(180deg, #2d90c8 0%, #56aedd 42%, #3b91ae 43%, #0c7692 57%, #5fb7b0 76%, #d2ddc0 100%);
}

.mac-desktop.screen-mode-enter-active,
.mac-desktop.screen-mode-leave-active {
  transition: opacity 260ms ease;
}

.mac-desktop.screen-mode-enter-from,
.mac-desktop.screen-mode-leave-to {
  opacity: 0;
}

.desktop-menu {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  height: 28px;
  padding: 0 14px;
  align-items: center;
  background: rgba(0, 86, 134, 0.16);
  color: #111;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 400;
}

.menu-left,
.menu-right {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
  white-space: nowrap;
}

.menu-left span:not(.apple-mark),
.menu-right > span:not(.menu-trailing-icons) {
  display: inline-block;
}

.menu-right {
  justify-content: end;
  overflow: hidden;
}

.apple-mark {
  width: 28px;
  height: 20px;
  flex: 0 0 auto;
  background: url('/Apple.png') center / contain no-repeat;
}

.menu-right .menu-trailing-icons {
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.menu-trailing-icons img {
  display: block;
  width: auto;
  height: 20px;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}

.desktop-icons {
  position: absolute;
  left: 21%;
  top: 25%;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 120px);
  gap: 26px;
}

.desktop-folder {
  display: grid;
  justify-items: center;
  gap: 10px;
  align-items: center;
  width: 120px;
  min-height: 96px;
  padding: 8px 6px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #fff;
  text-align: center;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.62);
  cursor: pointer;
}

.desktop-folder:hover {
  background: rgba(255, 255, 255, 0.18);
}

.desktop-folder strong {
  max-width: 132px;
  overflow: hidden;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-icon {
  display: block;
  width: 64px;
  height: 64px;
  background: url('/文件夹icon.png') center / contain no-repeat;
  filter: drop-shadow(0 7px 12px rgba(0, 52, 83, 0.25));
}

.screen-content {
  position: absolute;
  inset: 0;
  z-index: 2;
  box-sizing: border-box;
  min-height: 0;
  width: 100%;
  height: 100%;
  padding: 30px 0 0;
  background: #000;
  clip-path: circle(150% at var(--folder-origin-x) var(--folder-origin-y));
  transform-origin: var(--folder-origin-x) var(--folder-origin-y);
}

.screen-content.screen-mode-enter-active,
.screen-content.screen-mode-leave-active {
  transition:
    clip-path 620ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 420ms ease,
    transform 620ms cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: clip-path, opacity, transform;
}

.screen-content.screen-mode-enter-from,
.screen-content.screen-mode-leave-to {
  opacity: 0.04;
  clip-path: circle(6% at var(--folder-origin-x) var(--folder-origin-y));
  transform: scale(0.16);
}

.screen-content.screen-mode-enter-to,
.screen-content.screen-mode-leave-from {
  opacity: 1;
  clip-path: circle(150% at var(--folder-origin-x) var(--folder-origin-y));
  transform: scale(1);
}

.project-window-stack {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: #000;
}

.project-window-stack > .screen-browser {
  position: absolute;
  inset: 0;
}

.project-slide-forward-enter-active,
.project-slide-forward-leave-active,
.project-slide-backward-enter-active,
.project-slide-backward-leave-active {
  transition: opacity 260ms ease, transform 320ms cubic-bezier(0.22, 0.72, 0.24, 1);
  will-change: opacity, transform;
}

.project-slide-forward-enter-from,
.project-slide-backward-leave-to {
  opacity: 0;
  transform: translateX(6%);
}

.project-slide-forward-leave-to,
.project-slide-backward-enter-from {
  opacity: 0;
  transform: translateX(-6%);
}

.project-slide-forward-enter-to,
.project-slide-forward-leave-from,
.project-slide-backward-enter-to,
.project-slide-backward-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.screen-browser,
.video-panel {
  height: 100%;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  background: rgba(252, 252, 251, 0.96);
  box-shadow: none;
}

.screen-browser {
  position: relative;
  display: grid;
  grid-template-rows: 36px minmax(0, 1fr);
}

.screen-browser.is-workflow {
  grid-template-columns: minmax(0, 1fr);
}

.screen-browser.is-workflow.has-node-panel {
  grid-template-columns: minmax(0, 1fr);
}

.screen-browser.is-workflow .browser-chrome {
  grid-column: 1;
}

.browser-chrome {
  display: grid;
  grid-template-columns: 62px 1fr 62px;
  align-items: center;
  border-bottom: 1px solid rgba(17, 25, 31, 0.1);
  background: rgba(255, 255, 255, 0.88);
}

.browser-chrome strong {
  overflow: hidden;
  color: #283037;
  font-size: clamp(12px, 1.1vw, 15px);
  font-weight: 900;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.is-iframe .browser-chrome {
  border-bottom-color: #000;
  background: #000;
}

.is-iframe .browser-chrome strong {
  color: rgba(255, 255, 255, 0.86);
}

.window-dots {
  display: flex;
  gap: 6px;
  padding-left: 14px;
}

.window-dots span,
.window-close {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 0;
  padding: 0;
}

.window-close {
  background: #ff625c;
  cursor: pointer;
}

.window-dots span:nth-child(2) { background: #ffbd44; }
.window-dots span:nth-child(3) { background: #00ca4e; }

.workflow-scroll {
  position: relative;
  grid-column: 1;
  grid-row: 2;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  background: #fbfbfa;
  cursor: grab;
  touch-action: none;
}

.workflow-scroll.is-panning {
  cursor: grabbing;
}

.workflow-tools {
  position: absolute;
  left: 9px;
  top: 9px;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border: 1px solid rgba(22, 24, 25, 0.12);
  border-radius: 8px;
  background: rgba(251, 251, 250, 0.88);
  box-shadow: 0 10px 24px rgba(22, 24, 25, 0.1);
  backdrop-filter: blur(10px);
  cursor: default;
}

.workflow-tool {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid rgba(22, 24, 25, 0.12);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.82);
  color: rgba(22, 24, 25, 0.82);
  font: 800 14px/1 'Manrope', system-ui, sans-serif;
  cursor: pointer;
}

.workflow-tool:hover:not(:disabled) {
  border-color: rgba(22, 24, 25, 0.28);
  background: #fff;
  color: #151718;
}

.workflow-tool:disabled {
  opacity: 0.42;
  cursor: not-allowed;
}

.workflow-tool-reset {
  width: 36px;
  font-size: 10px;
}

.workflow-zoom-meter {
  width: 38px;
  color: rgba(22, 24, 25, 0.62);
  font-size: 10px;
  font-weight: 800;
  line-height: 1;
  text-align: center;
}

.workflow-node-panel {
  position: absolute;
  top: 44px;
  right: 8px;
  bottom: 8px;
  z-index: 5;
  display: grid;
  align-content: start;
  gap: 7px;
  min-width: 0;
  width: clamp(190px, 34%, 238px);
  max-width: calc(100% - 18px);
  margin: 0;
  padding: 11px 12px 12px;
  overflow: auto;
  opacity: 0;
  visibility: hidden;
  border: 1px solid rgba(22, 24, 25, 0.16);
  border-radius: 8px;
  background: rgba(251, 251, 250, 0.92);
  box-shadow: -14px 16px 34px rgba(22, 24, 25, 0.14);
  backdrop-filter: blur(12px);
  cursor: default;
  pointer-events: none;
  transform: translate3d(18px, 0, 0);
  transition:
    opacity 180ms ease,
    transform 200ms cubic-bezier(0.22, 0.72, 0.24, 1),
    visibility 0s linear 200ms;
  will-change: opacity, transform;
}

.workflow-node-panel.is-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translate3d(0, 0, 0);
  transition-delay: 0s;
}

.workflow-node-panel header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
}

.workflow-node-panel p {
  margin: 0;
  overflow: hidden;
  color: rgba(21, 23, 24, 0.48);
  font-size: 11px;
  font-weight: 800;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workflow-panel-close {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid rgba(22, 24, 25, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  color: rgba(21, 23, 24, 0.64);
  font: 800 14px/1 'Manrope', system-ui, sans-serif;
  cursor: pointer;
}

.workflow-panel-close:hover {
  border-color: rgba(22, 24, 25, 0.28);
  background: #fff;
  color: #151718;
}

.workflow-node-panel strong {
  color: #151718;
  font-size: 14px;
  line-height: 1.2;
}

.workflow-node-panel span {
  color: rgba(21, 23, 24, 0.72);
  font-size: 12px;
  line-height: 1.55;
}

.workflow-canvas {
  position: relative;
  width: max(1280px, 100%);
  height: 100%;
  min-height: 0;
  overflow: hidden;
  transform-origin: 0 0;
  transition: transform 140ms ease;
  will-change: transform;
  background:
    linear-gradient(rgba(22, 24, 25, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(22, 24, 25, 0.045) 1px, transparent 1px),
    #fbfbfa;
  background-size: 24px 24px;
}

.workflow-scroll.is-panning .workflow-canvas {
  transition: none;
}

.workflow-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.workflow-lines path {
  fill: none;
  stroke: rgba(22, 24, 25, 0.28);
  stroke-width: 2.4;
  stroke-linecap: round;
}

.workflow-node {
  --node-color: #4c8edb;
  --node-soft: rgba(76, 142, 219, 0.12);
  --node-text: #1d5d9e;

  position: absolute;
  z-index: 2;
  display: grid;
  gap: 4px;
  width: 132px;
  min-height: 60px;
  padding: 7px 8px 8px;
  border: 1px solid rgba(22, 24, 25, 0.16);
  border-left: 4px solid var(--node-color);
  border-radius: 8px;
  background:
    linear-gradient(90deg, var(--node-soft), rgba(255, 255, 255, 0) 58%),
    rgba(255, 255, 255, 0.95);
  color: #17191a;
  text-align: left;
  box-shadow: 0 10px 22px rgba(22, 24, 25, 0.08);
  cursor: grab;
  transform: translate3d(0, 0, 0);
  transition: box-shadow 160ms ease, transform 160ms ease, border-color 160ms ease;
  user-select: none;
  touch-action: none;
}

.workflow-node:hover,
.workflow-node.is-dragging,
.workflow-node.is-selected {
  border-color: var(--node-color);
  box-shadow: 0 16px 32px rgba(22, 24, 25, 0.14);
  transform: translate3d(0, -2px, 0);
}

.workflow-node.is-selected {
  outline: 2px solid var(--node-color);
  outline-offset: 2px;
  box-shadow:
    0 0 0 4px rgba(255, 255, 255, 0.92),
    0 18px 36px rgba(22, 24, 25, 0.18);
}

.workflow-node.is-dragging {
  cursor: grabbing;
}

.workflow-node-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  min-width: 0;
}

.node-label {
  width: max-content;
  padding: 2px 6px;
  border-radius: 999px;
  background: var(--node-soft);
  color: var(--node-text);
  font-size: 10px;
  font-weight: 900;
  line-height: 1.1;
}

.node-type {
  overflow: hidden;
  color: var(--node-text);
  font-size: 9px;
  font-weight: 800;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workflow-node strong {
  overflow: hidden;
  font-size: 12px;
  line-height: 1.18;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workflow-node small {
  color: rgba(22, 24, 25, 0.62);
  font-size: 10px;
  line-height: 1.35;
}

.node-preprocess {
  --node-color: #2f80ed;
  --node-soft: rgba(47, 128, 237, 0.13);
  --node-text: #1d5d9e;
}

.node-router {
  --node-color: #e14d6c;
  --node-soft: rgba(225, 77, 108, 0.13);
  --node-text: #a82c49;
}

.node-action {
  --node-color: #d99a22;
  --node-soft: rgba(217, 154, 34, 0.16);
  --node-text: #8a5a0f;
}

.node-qa {
  --node-color: #2fa56f;
  --node-soft: rgba(47, 165, 111, 0.14);
  --node-text: #1b7149;
}

.node-llm {
  --node-color: #7d62d9;
  --node-soft: rgba(125, 98, 217, 0.14);
  --node-text: #5940a5;
}

.video-panel {
  display: grid;
  place-items: center;
  background: #111820;
}

.video-panel video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #0d1116;
}

.video-placeholder {
  display: grid;
  justify-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.82);
  text-align: center;
}

.video-placeholder span {
  width: 72px;
  height: 72px;
  border: 2px solid rgba(255, 255, 255, 0.52);
  border-radius: 50%;
  background:
    linear-gradient(90deg, transparent 0 40%, rgba(255, 255, 255, 0.82) 40% 100%);
  clip-path: polygon(34% 24%, 76% 50%, 34% 76%);
}

.video-placeholder strong {
  font-size: clamp(22px, 3vw, 38px);
  line-height: 1;
}

.video-placeholder p {
  margin: 0;
  color: rgba(255, 255, 255, 0.56);
  font-size: 14px;
}

.iframe-scale-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

.iframe-loading {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 12px;
  padding: 24px;
  background: #000;
  color: rgba(255, 255, 255, 0.86);
  font-family: 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif;
  text-align: center;
}

.iframe-loading strong {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.35;
}

.iframe-loading p {
  max-width: 25em;
  margin: 0;
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  line-height: 1.6;
}

.loading-ring {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: rgba(255, 255, 255, 0.86);
  border-radius: 50%;
  animation: gantt-loading-spin 900ms linear infinite;
}

@keyframes gantt-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .macbook-frame-shell,
  .project-notes,
  .mac-desktop.screen-mode-enter-active,
  .mac-desktop.screen-mode-leave-active,
  .screen-content.screen-mode-enter-active,
  .screen-content.screen-mode-leave-active,
  .project-slide-forward-enter-active,
  .project-slide-forward-leave-active,
  .project-slide-backward-enter-active,
  .project-slide-backward-leave-active,
  .certificate-note-enter-active,
  .certificate-note-leave-active,
  .tab-copy-enter-active,
  .tab-copy-leave-active {
    animation: none;
    transition: none;
  }

  .macbook-frame-shell,
  .screen-content,
  .screen-browser,
  .defect-certificate-note,
  .project-tab-copy {
    transform: none;
  }

  .project-notes {
    opacity: 1;
    transform: none;
  }

  .screen-content {
    opacity: 1;
    clip-path: none;
  }
}

.is-iframe iframe {
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  border: 0;
  background: #000;
  transform-origin: center;
}

@media (max-width: 1080px) {
  .projects-page {
    --project-layout-width: min(calc(100vw - 32px), 1320px);

    padding-top: 30px;
    overflow: visible;
  }

  .projects-layout {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .project-notes {
    max-height: none;
    padding-left: 0;
    border-left: 0;
    scrollbar-gutter: auto;
  }

  .project-tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .macbook-frame-shell {
    width: min(100%, 1320px);
  }
}

@media (max-width: 760px) {
  .projects-page {
    --project-layout-width: calc(100vw - 16px);

    padding: 42px 0 60px;
  }

  .desktop-icons {
    left: 50%;
    top: 24%;
    grid-template-columns: repeat(3, 92px);
    gap: 8px;
    transform: translateX(-50%);
  }

  .desktop-folder {
    width: 92px;
    min-height: 86px;
  }

  .desktop-folder strong {
    max-width: 108px;
    font-size: 10px;
  }

  .desktop-menu {
    font-size: 9px;
    padding: 0 10px;
  }

  .menu-left,
  .menu-right {
    gap: 8px;
  }

  .menu-left span:nth-of-type(n+5),
  .menu-right span:nth-child(-n+2) {
    display: none;
  }

  .folder-icon {
    width: 52px;
    height: 52px;
  }

  .screen-content {
    padding: 26px 0 0;
  }

  .browser-chrome {
    grid-template-columns: 58px 1fr 20px;
  }

  .screen-browser.is-workflow.has-node-panel {
    grid-template-columns: minmax(0, 1fr);
  }

  .workflow-node {
    width: 124px;
    min-height: 58px;
  }

  .workflow-node-panel {
    position: absolute;
    top: 44px;
    right: 8px;
    bottom: 8px;
    grid-column: auto;
    grid-row: auto;
    width: min(190px, calc(100% - 16px));
    margin: 0;
    padding: 9px 10px 10px;
  }

  .workflow-node-panel p {
    font-size: 10px;
  }

  .workflow-node-panel strong {
    font-size: 13px;
  }

  .workflow-node-panel span {
    font-size: 11px;
    line-height: 1.45;
  }

  .project-tabs {
    grid-template-columns: 1fr;
  }

  .project-tab {
    min-height: 36px;
    padding-bottom: 8px;
    font-size: 12px;
    font-weight: 400;
  }

  .project-tab-copy {
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
