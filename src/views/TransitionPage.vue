<template>
  <div
    id="portfolio"
    class="transition-root"
    :class="{ 'is-portfolio-test': isPortfolioTest }"
    @wheel="onWheel"
  >
    <!-- ═══ COVER LAYER ═══ -->
    <div
      v-if="!isPortfolioTest"
      class="cover-layer"
      :style="{ opacity: coverLayerOpacity, pointerEvents: coverPointerEvents }"
    >
      <div class="ticket-scene">
        <article
          class="portfolio-ticket"
          :style="stubStyle"
          @pointerdown="onTicketAreaPointerDown"
        >
          <div ref="ticketMainBoxRef" class="ticket-main" :style="mainTicketCoverStyle">
            <img
              ref="ticketMainRef"
              class="ticket-art ticket-main-art"
              src="/ticket-main.svg"
              alt="叶奕含作品集门票左侧票面"
              draggable="false"
            />
          </div>

          <aside
            class="ticket-stub"
            :class="{ 'is-dragging': isDragging }"
            role="button"
            tabindex="0"
            aria-label="拖动检票区域进入下一屏"
            @pointerdown.stop="onStubPointerDown"
            @keydown.enter.prevent="forceComplete"
            @keydown.space.prevent="forceComplete"
          >
            <img
              class="ticket-art ticket-stub-art"
              src="/ticket-stub.svg"
              alt=""
              draggable="false"
            />
          </aside>
        </article>

        <div class="stub-callout" :class="{ 'is-hidden': hideStubCallout }" aria-hidden="true">
          <img class="stub-callout-box" src="/cover/Rectangle 7.png" alt="" draggable="false" />
          <img class="stub-callout-vector" src="/cover/Vector 1.png" alt="" draggable="false" />
          <img
            class="stub-callout-text"
            src="/cover/%E4%BB%8E%E8%BF%99%E9%87%8C%E6%92%95%E5%BC%80%EF%BC%8C%E2%80%A8%E8%BF%9B%E5%85%A5%E6%88%91%E7%9A%84%E4%B8%AA%E4%BA%BA%E7%A9%BA%E9%97%B4.png"
            alt=""
            draggable="false"
          />
        </div>
      </div>
    </div>

    <!-- ═══ PORTFOLIO LAYER ═══ -->
    <div class="portfolio-layer" :style="{ opacity: isPortfolioTest ? 1 : portfolioLayerOpacity }">
      <div ref="portfolioCanvasRef" class="portfolio-canvas">
        <!-- Notebook background -->
        <img class="portfolio-notebook" src="/portfolio/image 7.png" alt="" draggable="false" />

        <!-- Left stack of papers -->
        <img class="portfolio-left-stack" src="/portfolio/Group 4.png" alt="" draggable="false" />

        <!-- Paper overlay (right side) -->
        <img class="portfolio-paper" src="/portfolio/Group 5.png" alt="" draggable="false" />

        <!-- Target slot where the ticket will land -->
        <div ref="portfolioTicketTarget" class="portfolio-ticket-slot">
          <img
            class="portfolio-ticket-final"
            src="/ticket-main.svg"
            alt="叶奕含作品集主票面"
            draggable="false"
            :style="landedTicketStyle"
          />
        </div>

        <!-- Pin -->
        <img
          class="portfolio-pin"
          src="/portfolio/image 10.png"
          alt=""
          draggable="false"
          :style="paperclipStyle"
        />

        <!-- Black clip (paperclip) -->
        <img
          class="portfolio-black-clip"
          src="/portfolio/image 18.png"
          alt=""
          draggable="false"
        />

        <!-- Formula note -->
        <div class="portfolio-formula-note">
          <img src="/portfolio/image 17.png" alt="" draggable="false" />
        </div>

        <div class="portfolio-content-layer" aria-label="Portfolio timeline and stack content">
          <section class="portfolio-content-zone portfolio-content-zone--timeline">
            <div class="timeline-head">
              <p class="portfolio-kicker">TIMELINE</p>
              <span>2024 - 2026</span>
            </div>
            <div class="timeline-map" aria-label="Education and project duration timeline">
              <div class="timeline-years" aria-hidden="true">
                <span
                  v-for="year in timelineYears"
                  :key="year.id"
                  :style="{ top: `${year.top}%` }"
                >
                  {{ year.label }}
                </span>
              </div>
              <article
                v-for="item in timelineItems"
                :key="item.id"
                class="timeline-span"
                :class="[`timeline-span--${item.type}`, `timeline-span--${item.id}`]"
                :style="timelineItemStyle(item)"
              >
                <time>{{ displayTimelineText(item.time) }}</time>
                <strong>{{ displayTimelineText(item.title) }}</strong>
                <span>{{ displayTimelineText(item.detail) }}</span>
              </article>
            </div>
          </section>

          <section class="portfolio-content-zone portfolio-content-zone--stack">
            <p class="portfolio-kicker">TECH STACK</p>
            <ul class="tech-stack-list">
              <li><strong>AI Agent</strong><span>Codex / Claude Code / 工作流</span></li>
              <li><strong>Product</strong><span>PRD / 原型 / 演示脚本</span></li>
              <li><strong>Code</strong><span>Python / PyTorch / CV</span></li>
              <li><strong>Design</strong><span>Figma / Axure</span></li>
            </ul>
          </section>
        </div>

        <div v-if="showPortfolioEditor" class="portfolio-test-overlay" aria-label="Portfolio edit area test overlay">
          <div class="portfolio-test-controls">
            <span>拖动标签移动，拖右下角调整大小</span>
            <button type="button" @click="resetEditZones">重置</button>
          </div>
          <div
            v-for="zone in portfolioEditZones"
            :key="zone.id"
            class="portfolio-edit-zone"
            :class="{ 'is-active': activeEditZoneId === zone.id }"
            :style="editZoneStyle(zone)"
            @pointerdown="startEditMove($event, zone)"
          >
            <span>{{ zone.label }}</span>
            <small>{{ editZoneMetric(zone) }}</small>
            <i aria-hidden="true" @pointerdown.stop="startEditResize($event, zone)" />
          </div>
        </div>
      </div>
    </div>

    <aside v-if="isPortfolioTest" class="timeline-console" aria-label="Timeline adjustment console">
      <div class="timeline-console__head">
        <strong>Timeline Console</strong>
        <button type="button" @click="resetTimelineControls">重置</button>
      </div>

      <details open>
        <summary>年份刻度</summary>
        <label v-for="year in timelineYears" :key="year.id" class="timeline-console-row">
          <input v-model="year.label" type="text" aria-label="年份文案" />
          <span>top</span>
          <input v-model.number="year.top" type="number" min="0" max="100" step="1" aria-label="年份位置" />
        </label>
      </details>

      <details open>
        <summary>时间块</summary>
        <section v-for="item in timelineItems" :key="item.id" class="timeline-console-card">
          <div class="timeline-console-card__title">
            <strong>{{ item.title || item.id }}</strong>
            <select v-model="item.type" aria-label="类型">
              <option value="study">学业</option>
              <option value="project">项目</option>
              <option value="intern">实习</option>
            </select>
          </div>
          <input v-model="item.time" type="text" aria-label="时间" />
          <input v-model="item.title" type="text" aria-label="标题" />
          <input v-model="item.detail" type="text" aria-label="详情" />
          <div class="timeline-console-grid">
            <label>top<input v-model.number="item.top" type="number" min="0" max="100" step="1" /></label>
            <label>height<input v-model.number="item.height" type="number" min="1" max="100" step="1" /></label>
            <label>left<input v-model.number="item.left" type="number" min="0" max="100" step="1" /></label>
            <label>right<input v-model.number="item.right" type="number" min="0" max="100" step="1" /></label>
            <label>minH<input v-model.number="item.minHeight" type="number" min="0" max="240" step="1" /></label>
          </div>
        </section>
      </details>
    </aside>

    <!-- ═══ FLYING TICKET CLONE ═══ -->
    <img
      v-if="flightClone && !isPortfolioTest"
      class="flight-ticket"
      :src="flightClone?.src"
      alt=""
      :style="flightCloneStyle"
      draggable="false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useTicketTransition } from '../composables/useTicketTransition.js'

const emit = defineEmits(['transition-complete'])

const ticketMainRef = ref(null)
const ticketMainBoxRef = ref(null)
const portfolioTicketTarget = ref(null)
const portfolioCanvasRef = ref(null)
const routeParams = typeof window !== 'undefined'
  ? new URLSearchParams(window.location.search)
  : new URLSearchParams()
const isPortfolioTest = routeParams.has('portfolioTest')
const showPortfolioEditor = isPortfolioTest && routeParams.has('portfolioEdit')

const defaultPortfolioEditZones = [
  {
    id: 'timeline',
    label: 'group5 米色纸张 · 教育 / 项目时间线',
    left: 55.496,
    top: 20.4607,
    width: 29.4583,
    height: 56.9056,
    rotate: 0,
  },
  {
    id: 'stack',
    label: 'image17 便利贴 · 技术栈',
    left: 26.6195,
    top: 29.3584,
    width: 18.1354,
    height: 17.5657,
    rotate: -0.8,
  },
]
const portfolioEditZones = ref(loadEditZones())
const activeEditZoneId = ref(null)
let editDragState = null

const defaultTimelineYears = [
  { id: 'y2024', label: '2024', top: 4 },
  { id: 'y202409', label: '', top: 26 },
  { id: 'y2025', label: '2025', top: 46 },
  { id: 'y2026', label: '2026', top: 88 },
]

const defaultTimelineItems = [
  {
    id: 'bachelor',
    type: 'study',
    time: '2020.09-2024.06',
    title: '浙江大学 本科',
    detail: '电子科学与技术专业',
    top: 0,
    height: 20,
    left: 18,
    right: 0,
    minHeight: 34,
  },
  {
    id: 'master',
    type: 'study',
    time: '2024.09 - 至今',
    title: '浙江大学 硕士',
    detail: '电子信息专业',
    top: 22,
    height: 78,
    left: 18,
    right: 37,
    minHeight: 155,
  },
  {
    id: 'defect',
    type: 'project',
    time: '2024.09 - 2025.07',
    title: '智能缺陷分析系统',
    detail: '“华为杯”全国研究生人工智能创新大赛 \\n 获全国一等奖',
    top: 25,
    height: 34,
    left: 50,
    right: 1,
    minHeight: 34,
  },
  {
    id: 'model',
    type: 'project',
    time: '2025.08 - 2025.12',
    title: '基于 AI 的跨工艺集成电路行为建模',
    detail: '创"芯"大赛·EDA 精英挑战赛 \\n 获全国三等奖',
    top: 60,
    height: 22,
    left: 28,
    right: 34,
    minHeight: 34,
  },
  {
    id: 'todo',
    type: 'project',
    time: '2025.09 - 2025.12',
    title: '甘特图风格化智能待办系统',
    detail: '个人项目',
    top: 64,
    height: 18,
    left: 63,
    right: 1,
    minHeight: 34,
  },
  {
    id: 'zhipu',
    type: 'intern',
    time: '2025.12 - 2026.05',
    title: '智谱华章实习',
    detail: 'AI 产品经理岗位',
    top: 83,
    height: 17,
    left: 39,
    right: 1,
    minHeight: 48,
  },
]

const timelineYears = ref(loadTimelineControl('portfolio-timeline-years', defaultTimelineYears))
const timelineItems = ref(loadTimelineControl('portfolio-timeline-items', defaultTimelineItems))

const {
  progress,
  isTransitioning,
  isComplete,
  phase,
  stubStyle,
  coverLayerOpacity,
  portfolioLayerOpacity,
  flightPhaseProgress,
  paperclipStyle,
  stubInteractive,
  isDragging,

  startDrag,
  updateDrag,
  endDrag,
  cancelDrag,
  addScrollDelta,
  startAutoComplete,
} = useTicketTransition()

// ── Flight clone state ──
const flightClone = ref(null)
const flightCloneStyle = ref({})
const coverPointerEvents = computed(() => (progress.value < 0.35 && !isComplete.value ? 'auto' : 'none'))
const hideStubCallout = computed(() => isDragging.value || isTransitioning.value || progress.value > 0.015)
const mainTicketCoverStyle = computed(() => ({
  opacity: flightClone.value || progress.value >= 0.45 ? 0 : 1,
}))
const landedTicketStyle = computed(() => ({
  opacity: progress.value >= 0.85 ? 1 : 0,
}))

// Lock body scroll during transition
watch(
  () => isTransitioning.value || (progress.value > 0 && !isComplete.value),
  (shouldLock) => {
    document.body.classList.toggle('is-transition-locked', shouldLock)
  },
)

// Watch for transition completion
watch(isComplete, (val) => {
  if (val) {
    document.body.classList.remove('is-transition-locked')
    emit('transition-complete')
  }
})

// ── Drag handlers ──
let dragStartX = 0
let dragStartY = 0
let dragPointerId = null

function loadEditZones() {
  if (typeof window === 'undefined') return defaultPortfolioEditZones.map((zone) => ({ ...zone }))

  try {
    const saved = JSON.parse(window.localStorage.getItem('portfolio-edit-zones') || 'null')
    if (!Array.isArray(saved)) return defaultPortfolioEditZones.map((zone) => ({ ...zone }))
    return defaultPortfolioEditZones.map((zone) => ({
      ...zone,
      ...(saved.find((item) => item.id === zone.id) || {}),
      label: zone.label,
    }))
  } catch {
    return defaultPortfolioEditZones.map((zone) => ({ ...zone }))
  }
}

function saveEditZones() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('portfolio-edit-zones', JSON.stringify(portfolioEditZones.value))
}

function editZoneStyle(zone) {
  return {
    left: `${zone.left}%`,
    top: `${zone.top}%`,
    width: `${zone.width}%`,
    height: `${zone.height}%`,
    transform: `rotate(${zone.rotate}deg)`,
  }
}

function editZoneMetric(zone) {
  return `left ${formatMetric(zone.left)} · top ${formatMetric(zone.top)} · ${formatMetric(zone.width)} x ${formatMetric(zone.height)}`
}

function formatMetric(value) {
  return `${Number(value).toFixed(1)}%`
}

function startEditMove(e, zone) {
  if (!isPortfolioTest || e.button !== 0) return
  startEditDrag(e, zone, 'move')
}

function startEditResize(e, zone) {
  if (!isPortfolioTest || e.button !== 0) return
  startEditDrag(e, zone, 'resize')
}

function startEditDrag(e, zone, mode) {
  const canvasBox = portfolioCanvasRef.value?.getBoundingClientRect()
  if (!canvasBox) return

  e.preventDefault()
  activeEditZoneId.value = zone.id
  editDragState = {
    mode,
    id: zone.id,
    startX: e.clientX,
    startY: e.clientY,
    startLeft: zone.left,
    startTop: zone.top,
    startWidth: zone.width,
    startHeight: zone.height,
    canvasWidth: canvasBox.width,
    canvasHeight: canvasBox.height,
  }

  try {
    e.currentTarget.setPointerCapture?.(e.pointerId)
  } catch { /* ok */ }

  window.addEventListener('pointermove', onEditPointerMove)
  window.addEventListener('pointerup', stopEditDrag)
  window.addEventListener('pointercancel', stopEditDrag)
}

function onEditPointerMove(e) {
  if (!editDragState) return

  const zone = portfolioEditZones.value.find((item) => item.id === editDragState.id)
  if (!zone) return

  const dx = ((e.clientX - editDragState.startX) / editDragState.canvasWidth) * 100
  const dy = ((e.clientY - editDragState.startY) / editDragState.canvasHeight) * 100

  if (editDragState.mode === 'move') {
    zone.left = clamp(editDragState.startLeft + dx, 0, 100 - zone.width)
    zone.top = clamp(editDragState.startTop + dy, 0, 100 - zone.height)
    return
  }

  zone.width = clamp(editDragState.startWidth + dx, 6, 100 - zone.left)
  zone.height = clamp(editDragState.startHeight + dy, 5, 100 - zone.top)
}

function stopEditDrag() {
  if (!editDragState) return
  editDragState = null
  saveEditZones()
  window.removeEventListener('pointermove', onEditPointerMove)
  window.removeEventListener('pointerup', stopEditDrag)
  window.removeEventListener('pointercancel', stopEditDrag)
}

function resetEditZones() {
  portfolioEditZones.value = defaultPortfolioEditZones.map((zone) => ({ ...zone }))
  activeEditZoneId.value = null
  saveEditZones()
}

function loadTimelineControl(storageKey, defaults) {
  if (typeof window === 'undefined') return cloneTimelineDefaults(defaults)
  if (!isPortfolioTest) return cloneTimelineDefaults(defaults)

  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null')
    if (!Array.isArray(saved)) return cloneTimelineDefaults(defaults)
    return defaults.map((item) => ({
      ...item,
      ...(saved.find((savedItem) => savedItem.id === item.id) || {}),
    }))
  } catch {
    return cloneTimelineDefaults(defaults)
  }
}

function cloneTimelineDefaults(defaults) {
  return defaults.map((item) => ({ ...item }))
}

function timelineItemStyle(item) {
  return {
    top: `${clamp(item.top, 0, 100)}%`,
    height: `${clamp(item.height, 1, 100)}%`,
    left: `${clamp(item.left, 0, 100)}%`,
    right: `${clamp(item.right, 0, 100)}%`,
    minHeight: item.minHeight ? `${item.minHeight}px` : undefined,
  }
}

function displayTimelineText(value) {
  return String(value || '').replaceAll('\\n', '\n')
}

function resetTimelineControls() {
  timelineYears.value = cloneTimelineDefaults(defaultTimelineYears)
  timelineItems.value = cloneTimelineDefaults(defaultTimelineItems)
  saveTimelineControls()
}

function saveTimelineControls() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('portfolio-timeline-years', JSON.stringify(timelineYears.value))
  window.localStorage.setItem('portfolio-timeline-items', JSON.stringify(timelineItems.value))
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

watch(timelineYears, saveTimelineControls, { deep: true })
watch(timelineItems, saveTimelineControls, { deep: true })

function onStubPointerDown(e) {
  if (!stubInteractive.value) return
  e.preventDefault()

  dragStartX = e.clientX
  dragStartY = e.clientY
  dragPointerId = e.pointerId
  startDrag()

  try {
    e.currentTarget.setPointerCapture?.(e.pointerId)
  } catch { /* ok */ }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerCancel)
}

function onTicketAreaPointerDown(e) {
  if (!ticketMainRef.value) return
  // Only handle clicks on the right half (near stub)
  const rect = ticketMainRef.value.parentElement.getBoundingClientRect()
  const relativeX = e.clientX - rect.left
  if (relativeX < rect.width * 0.72) return
  onStubPointerDown(e)
}

function onPointerMove(e) {
  if (e.pointerId !== dragPointerId) return
  updateDrag(e.clientX, e.clientY, dragStartX, dragStartY)
}

function onPointerUp(e) {
  if (e.pointerId !== dragPointerId) return
  cleanupDrag()
  endDrag()
}

function onPointerCancel(e) {
  if (e.pointerId !== dragPointerId) return
  cleanupDrag()
  cancelDrag()
}

function cleanupDrag() {
  dragPointerId = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerCancel)
}

// ── Scroll handler ──
function onWheel(e) {
  if (isPortfolioTest) return
  if (isComplete.value) return // allow scroll to projects
  e.preventDefault() // lock scroll during cover/transition phases
  if (!isTransitioning.value && progress.value < 0.35) {
    addScrollDelta(e.deltaY)
  }
}

// Prevent touch scrolling during transition
function onTouchMove(e) {
  if (isPortfolioTest) return
  if (isTransitioning.value || (progress.value > 0 && !isComplete.value)) {
    e.preventDefault()
  }
}

// ── Flight clone management ──

function startFlightClone() {
  const sourceEl = ticketMainBoxRef.value
  const targetEl = portfolioTicketTarget.value
  if (!sourceEl || !targetEl || flightClone.value) return

  const sourceBox = sourceEl.getBoundingClientRect()
  const targetBox = targetEl.getBoundingClientRect()
  const sourceWidth = sourceEl.offsetWidth || sourceBox.width
  const sourceHeight = sourceEl.offsetHeight || sourceBox.height
  const targetWidth = targetEl.offsetWidth || targetBox.width
  const targetHeight = targetEl.offsetHeight || targetBox.height

  const cloneData = {
    src: ticketMainRef.value?.currentSrc || ticketMainRef.value?.src || '/ticket-main.svg',
    source: {
      centerX: sourceBox.left + sourceBox.width / 2,
      centerY: sourceBox.top + sourceBox.height / 2,
      width: sourceWidth,
      height: sourceHeight,
    },
    target: {
      centerX: targetBox.left + targetBox.width / 2,
      centerY: targetBox.top + targetBox.height / 2,
      width: targetWidth,
      height: targetHeight,
    },
  }
  flightClone.value = cloneData

  updateFlightCloneTransform(0)
}

function updateFlightCloneTransform(p) {
  // p: 0..1 within flight phase
  const data = flightClone.value
  if (!data) return

  const { source, target } = data
  const sx = target.width / source.width
  const sy = target.height / source.height
  const dx = target.centerX - source.centerX
  const dy = target.centerY - source.centerY

  const t = easeOut(p)
  const scaleX = 1 + (sx - 1) * t
  const scaleY = 1 + (sy - 1) * t
  const transX = dx * t
  const transY = dy * t

  flightCloneStyle.value = {
    left: `${source.centerX}px`,
    top: `${source.centerY}px`,
    width: `${source.width}px`,
    height: `${source.height}px`,
    transform: `translate(-50%, -50%) translate(${transX}px, ${transY}px) scale(${scaleX}, ${scaleY}) rotate(-5deg)`,
    opacity: 1,
  }
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3)
}

function finishFlightClone() {
  flightClone.value = null
  flightCloneStyle.value = {}
}

// Watch flight phase to create/destroy clone
watch(phase, (newPhase, oldPhase) => {
  if (newPhase >= 2 && oldPhase < 2) {
    // Entering flight phase — create clone
    startFlightClone()
  }
  if (newPhase > 2 && flightClone.value) {
    // Left flight phase — remove clone
    finishFlightClone()
  }
})

// Drive flight clone transform with rAF for smoothness
watch(flightPhaseProgress, (p) => {
  if (flightClone.value) {
    updateFlightCloneTransform(p)
  }
})

// ── Force complete (keyboard) ──
function forceComplete() {
  if (!stubInteractive.value) return
  startAutoComplete()
}

// ── Lifecycle ──
onMounted(() => {
  if (isPortfolioTest) {
    document.body.classList.remove('is-transition-locked')
  }
  document.addEventListener('touchmove', onTouchMove, { passive: false })
})

onUnmounted(() => {
  cleanupDrag()
  stopEditDrag()
  document.removeEventListener('touchmove', onTouchMove)
})
</script>

<style scoped>
/* ═══════════════════════════════════
   TRANSITION ROOT
   ═══════════════════════════════════ */
.transition-root {
  position: relative;
  width: 100%;
  height: 100svh;
  overflow: hidden;
  background: var(--bg);
}

/* ═══════════════════════════════════
   COVER LAYER
   ═══════════════════════════════════ */
.cover-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  will-change: opacity;
}

.ticket-scene {
  position: relative;
  z-index: 1;
  width: min(100vw, 141.176svh, 1440px);
  aspect-ratio: 1440 / 1020;
}

.portfolio-ticket {
  --stub-x: 0px;
  --stub-y: 0px;
  --stub-opacity: 1;
  --stub-rotate: 0deg;
  position: absolute;
  left: 17.5694%;
  top: 30.4824%;
  width: 62.7194%;
  height: 35.2941%;
  filter: drop-shadow(0 34px 42px rgba(24, 26, 28, 0.24));
  transform: rotate(-5deg);
  transform-origin: center;
  touch-action: none;
  user-select: none;
}

.ticket-main,
.ticket-stub {
  position: absolute;
  display: block;
  padding: 0;
  overflow: visible;
  transform-origin: center;
}

.ticket-main {
  left: 0;
  top: 0;
  width: 77.2878%;
  height: 100%;
  will-change: opacity;
}

.ticket-stub {
  left: 77.2878%;
  top: 0;
  width: 22.7122%;
  height: 100%;
  cursor: grab;
  touch-action: none;
  transform: translate(var(--stub-x), var(--stub-y));
  opacity: var(--stub-opacity);
  transition: none;
  will-change: transform, opacity;
}

.ticket-stub:active,
.ticket-stub.is-dragging {
  cursor: grabbing;
  transition: none;
}

.stub-callout {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  opacity: 1;
  transform: translateY(0);
  transition: opacity 260ms ease, transform 260ms ease;
}

.stub-callout.is-hidden {
  opacity: 0;
  transform: translateY(-4px);
}

.stub-callout img {
  position: absolute;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.stub-callout-box {
  left: 64.4694%;
  top: 25.8936%;
  width: 17.3833%;
  height: 38.5693%;
  /* transform: rotate(-5deg); */
}

.stub-callout-vector {
  left: 70.3118%;
  top: 65.3604%;
  width: 10.166%;
  height: 6.585%;
  /* transform: matrix(0.84, 0.54, 0.54, -0.84, 0, 0); */
}

.stub-callout-text {
  left: 81.6667%;
  top: 69.1914%;
  width: 11.8056%;
  height: 5.0781%;
}

.ticket-art {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  -webkit-user-drag: none;
}

/* ═══════════════════════════════════
   PORTFOLIO LAYER
   ═══════════════════════════════════ */
.portfolio-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  place-items: center;
  pointer-events: none;
  will-change: opacity;
}

.portfolio-canvas {
  position: relative;
  width: min(1296px, 86.4vw);
  aspect-ratio: 1440 / 1024;
  max-width: none;
  min-height: 0;
  container-type: inline-size;
  --portfolio-caption-size: clamp(8px, 0.66cqw, 9px);
  --portfolio-body-size: clamp(8.5px, 0.78cqw, 10px);
  --portfolio-label-size: clamp(8.5px, 0.82cqw, 10.5px);
  --portfolio-heading-size: clamp(11px, 1.02cqw, 13px);
}

.portfolio-notebook {
  position: absolute;
  left: 6.3194%;
  top: 10.6445%;
  z-index: 1;
  width: 90.2778%;
  height: 78.6133%;
  object-fit: fill;
  filter: drop-shadow(7px 7px 3.9px rgba(0, 0, 0, 0.25));
  pointer-events: none;
  user-select: none;
}

.portfolio-left-stack {
  position: absolute;
  left: 2.2917%;
  top: 20.0195%;
  z-index: 2;
  width: 46.2194%;
  transform: rotate(-2.7deg);
  pointer-events: none;
  user-select: none;
}

.portfolio-paper {
  position: absolute;
  left: 50%;
  top: 7.5195%;
  z-index: 4;
  width: 39.2361%;
  pointer-events: none;
  user-select: none;
}

/* Target slot — matches portfolio-ticket position from design */
.portfolio-ticket-slot {
  position: absolute;
  left: 6.4903%;
  top: 14.4307%;
  z-index: 5;
  width: 19.5139%;
  aspect-ratio: 701 / 360;
}

.portfolio-ticket-final {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
  transform: rotate(-5deg);
  filter: drop-shadow(5px 5px 4px rgba(0, 0, 0, 0.25));
  pointer-events: none;
  user-select: none;
  will-change: opacity;
}

.portfolio-pin {
  position: absolute;
  left: 12.4306%;
  top: 9.6445%;
  z-index: 6;
  width: 7.0833%;
  height: 14.9414%;
  object-fit: fill;
  pointer-events: none;
  user-select: none;
  /* paperclip drop animation controlled via :style binding */
}

.portfolio-black-clip {
  position: absolute;
  left: 67.7083%;
  top: 5.5664%;
  z-index: 8;
  width: 18.5417%;
  height: 17.0898%;
  object-fit: fill;
  pointer-events: none;
  user-select: none;
}

.portfolio-formula-note {
  position: absolute;
  left: 24.9306%;
  top: 21.2891%;
  z-index: 7;
  width: 23.6111%;
  pointer-events: none;
}

.portfolio-formula-note > img {
  display: block;
  width: 100%;
  filter: drop-shadow(0 15px 14px rgba(0, 0, 0, 0.18));
}

.portfolio-content-layer {
  position: absolute;
  inset: 0;
  z-index: 12;
  color: #392f27;
  font-family: var(--font-sans);
  pointer-events: none;
}

.portfolio-content-zone {
  position: absolute;
  box-sizing: border-box;
}

.portfolio-kicker {
  margin: 0;
  color: #8a6434;
  font-size: var(--portfolio-caption-size);
  font-weight: 800;
  letter-spacing: 0;
}

.portfolio-content-zone--timeline {
  left: 55.496%;
  top: 20.4607%;
  width: 29.4583%;
  height: 56.9056%;
  padding: 10px 6px 9px 8px;
}

.timeline-head {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 0 0 6px 48px;
}

.timeline-head .portfolio-kicker {
  color: #7b613e;
  font-size: var(--portfolio-heading-size);
  letter-spacing: 0;
}

.timeline-head span {
  color: rgba(72, 57, 38, 0.5);
  font-size: var(--portfolio-caption-size);
  font-weight: 800;
}

.timeline-map {
  position: relative;
  height: calc(100% - 23px);
}

.timeline-map::before {
  content: '';
  position: absolute;
  left: 47px;
  top: 0;
  bottom: 0;
  width: 1.5px;
  background: rgba(49, 39, 28, 0.78);
  border-radius: 2px;
}

.timeline-years {
  position: absolute;
  inset: 0 auto 0 0;
  width: 42px;
}

.timeline-years span {
  position: absolute;
  left: 0;
  width: 40px;
  color: rgba(47, 41, 35, 0.9);
  font-size: var(--portfolio-label-size);
  font-weight: 800;
  line-height: 1;
  transform: translateY(-50%);
}

.timeline-span {
  position: absolute;
  left: 55px;
  right: 0;
  display: grid;
  align-content: start;
  gap: 2px;
  box-sizing: border-box;
  min-height: 34px;
  padding: 7px 9px 7px 12px;
  border: 1px solid var(--timeline-border);
  border-radius: 8px;
  background: var(--timeline-fill);
  box-shadow: inset 7px 0 0 var(--timeline-accent), 0 5px 12px rgba(58, 45, 31, 0.05);
  z-index: 2;
}

.timeline-span time {
  color: rgba(48, 38, 28, 0.78);
  font-size: var(--portfolio-body-size);
  font-weight: 900;
  line-height: 1.12;
  white-space: pre-line;
}

.timeline-span strong {
  color: #2f2924;
  font-size: var(--portfolio-body-size);
  font-weight: 900;
  line-height: 1.18;
  white-space: pre-line;
}

.timeline-span span {
  color: rgba(48, 42, 35, 0.72);
  font-size: var(--portfolio-caption-size);
  line-height: 1.12;
  white-space: pre-line;
}

.timeline-span--study {
  --timeline-accent: rgba(111, 134, 138, 0.72);
  --timeline-border: rgba(111, 134, 138, 0.2);
  --timeline-fill: rgba(226, 234, 232, 0.72);
}

.timeline-span--project {
  --timeline-accent: rgba(157, 128, 90, 0.72);
  --timeline-border: rgba(157, 128, 90, 0.22);
  --timeline-fill: rgba(239, 229, 214, 0.76);
}

.timeline-span--intern {
  --timeline-accent: rgba(154, 112, 107, 0.72);
  --timeline-border: rgba(154, 112, 107, 0.22);
  --timeline-fill: rgba(236, 219, 216, 0.78);
}

.timeline-span--bachelor {
}

.timeline-span--master {
  border-radius: 8px;
  background: rgba(232, 239, 238, 0.58);
  z-index: 1;
}

.timeline-span--defect {
}

.timeline-span--model {
}

.timeline-span--todo {
}

.timeline-span--zhipu {
}

/* Legacy class kept unused for older cached markup during HMR. */
.portfolio-timeline {
  margin: 0;
  padding: 0;
  list-style: none;
}

.portfolio-content-zone--stack {
  left: 26.6195%;
  top: 29.3584%;
  width: 18.1354%;
  height: 17.5657%;
  padding: 6px 8px;
  transform: rotate(-0.8deg);
}

.portfolio-content-zone--stack .portfolio-kicker {
  margin-bottom: 5px;
  color: #9c6d20;
}

.tech-stack-list {
  display: grid;
  gap: 3px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tech-stack-list li {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 4px;
  align-items: baseline;
  color: rgba(55, 44, 33, 0.86);
  font-size: var(--portfolio-caption-size);
  line-height: 1.18;
}

.tech-stack-list strong {
  color: #3a3027;
  font-size: var(--portfolio-caption-size);
  font-weight: 900;
}

.tech-stack-list span {
  min-width: 0;
}

.portfolio-test-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
}

.portfolio-test-controls {
  position: absolute;
  left: 7.2%;
  top: 8.8%;
  z-index: 30;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 7px 10px;
  border: 1px solid rgba(112, 83, 48, 0.22);
  border-radius: 999px;
  background: rgba(255, 252, 241, 0.92);
  box-shadow: 0 8px 24px rgba(45, 34, 23, 0.14);
  color: #4d3824;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 700;
  pointer-events: auto;
}

.portfolio-test-controls button {
  border: 0;
  border-radius: 999px;
  padding: 4px 8px;
  background: #4d3824;
  color: #fffaf0;
  font: inherit;
  cursor: pointer;
}

.portfolio-edit-zone {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 2px dashed rgba(112, 83, 48, 0.9);
  border-radius: 6px;
  background: rgba(255, 247, 227, 0.2);
  box-shadow: 0 0 0 9999px rgba(255, 255, 255, 0.04);
  color: #4d3824;
  font-family: var(--font-sans);
  font-size: clamp(10px, 1vw, 14px);
  font-weight: 700;
  line-height: 1.35;
  cursor: grab;
  overflow: hidden;
  pointer-events: auto;
  touch-action: none;
  user-select: none;
}

.portfolio-edit-zone.is-active {
  border-style: solid;
  background: rgba(255, 232, 164, 0.22);
}

.portfolio-edit-zone:active {
  cursor: grabbing;
}

.portfolio-edit-zone > span {
  max-width: 100%;
  padding: 4px 7px;
  border-radius: 999px;
  background: rgba(255, 252, 241, 0.9);
  box-shadow: 0 2px 8px rgba(45, 34, 23, 0.12);
}

.portfolio-edit-zone > small {
  padding: 3px 6px;
  border-radius: 4px;
  background: rgba(77, 56, 36, 0.76);
  color: #fffaf0;
  font-size: 10px;
  font-weight: 700;
}

.portfolio-edit-zone > i {
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 15px;
  height: 15px;
  border-right: 3px solid rgba(77, 56, 36, 0.9);
  border-bottom: 3px solid rgba(77, 56, 36, 0.9);
  cursor: nwse-resize;
}

.timeline-console {
  position: fixed;
  left: 14px;
  top: 14px;
  z-index: 120;
  width: 300px;
  max-height: calc(100svh - 28px);
  overflow: auto;
  padding: 12px;
  border: 1px solid rgba(78, 61, 42, 0.18);
  border-radius: 8px;
  background: rgba(255, 252, 244, 0.96);
  box-shadow: 0 18px 44px rgba(43, 34, 24, 0.22);
  color: #332a22;
  font-family: var(--font-sans);
  pointer-events: auto;
}

.timeline-console__head,
.timeline-console-card__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.timeline-console__head {
  margin-bottom: 10px;
}

.timeline-console__head strong {
  font-size: 14px;
}

.timeline-console button,
.timeline-console select,
.timeline-console input {
  border: 1px solid rgba(78, 61, 42, 0.18);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.78);
  color: #332a22;
  font: inherit;
}

.timeline-console button {
  padding: 5px 8px;
  cursor: pointer;
}

.timeline-console details {
  border-top: 1px solid rgba(78, 61, 42, 0.14);
  padding-top: 8px;
}

.timeline-console details + details {
  margin-top: 10px;
}

.timeline-console summary {
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
}

.timeline-console-row {
  display: grid;
  grid-template-columns: 1fr auto 58px;
  gap: 6px;
  align-items: center;
  margin-top: 7px;
  font-size: 11px;
}

.timeline-console-row input,
.timeline-console-card input,
.timeline-console-card select {
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  padding: 5px 6px;
  font-size: 11px;
}

.timeline-console-card {
  display: grid;
  gap: 6px;
  margin-top: 9px;
  padding: 8px;
  border: 1px solid rgba(78, 61, 42, 0.12);
  border-radius: 6px;
  background: rgba(247, 241, 229, 0.58);
}

.timeline-console-card__title strong {
  min-width: 0;
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-console-card__title select {
  width: 64px;
}

.timeline-console-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
}

.timeline-console-grid label {
  display: grid;
  gap: 3px;
  color: rgba(51, 42, 34, 0.72);
  font-size: 10px;
  font-weight: 800;
}

/* ═══════════════════════════════════
   FLYING TICKET CLONE
   ═══════════════════════════════════ */
.flight-ticket {
  position: fixed;
  z-index: 80;
  pointer-events: none;
  object-fit: fill;
  transform-origin: center;
  filter: drop-shadow(0 28px 36px rgba(24, 26, 28, 0.24));
  will-change: transform;
}

/* ═══════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════ */
@media (max-width: 760px) {
  .ticket-scene {
    width: min(100vw, 141.176svh);
  }

  .portfolio-canvas {
    display: grid;
    gap: 18px;
    width: 100%;
    min-height: auto;
    aspect-ratio: auto;
  }

  .portfolio-notebook,
  .portfolio-paper,
  .portfolio-left-stack,
  .portfolio-black-clip,
  .portfolio-formula-note,
  .portfolio-content-layer,
  .portfolio-test-overlay {
    display: none;
  }

  .portfolio-pin,
  .portfolio-ticket-slot {
    position: static;
    width: auto;
  }

  .portfolio-ticket-final {
    width: min(240px, 74vw);
    transform: none;
  }
}
</style>
