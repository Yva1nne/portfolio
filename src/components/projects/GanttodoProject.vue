<template>
  <div class="ganttodo-project">
    <header class="project-lead">
      <p>{{ project.kicker }}</p>
      <h3>{{ project.title }}</h3>
      <span>{{ project.summary }}</span>
    </header>

    <div class="demo-layout">
      <section class="experience" aria-label="Smart Ganttodo 项目体验">
        <div class="experience-bar">
          <span aria-live="polite">
            <i :class="{ 'is-online': frameState === 'online' }"></i>
            {{ frameStatus }}
          </span>
          <div>
            <button type="button" @click="toggleExperienceMode">
              {{ experienceActionLabel }}
            </button>
            <a
              :href="project.demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="VISIT"
            >
              新窗口打开 ↗
            </a>
          </div>
        </div>

        <div class="iframe-viewport">
          <iframe
            v-if="!showStaticPreview"
            :src="project.demoUrl"
            title="Smart Ganttodo 在线体验"
            loading="lazy"
            referrerpolicy="no-referrer"
            @load="onFrameLoad"
            @error="showFallback('error')"
          ></iframe>

          <div
            v-else
            class="iframe-fallback"
          >
            <img
              src="/project/ganttodo-preview.png"
              alt="Smart Ganttodo 日历与甘特任务界面预览"
              loading="lazy"
            >
            <div>
              <p>{{ fallbackLabel }}</p>
              <h4>不等待网络，也能先看懂项目。</h4>
              <span>这张预览来自真实项目界面；在线嵌入受网络或站点策略影响时，可继续用上方核心链路和新窗口入口。</span>
            </div>
          </div>
        </div>
      </section>

      <aside class="example-flow">
        <p>ONE INPUT, STRUCTURED CONTROL</p>
        <h4>AI 先生成可编辑初稿。</h4>

        <div class="example-block">
          <span>示例输入</span>
          <blockquote>“下周一开始做作品集改版，周三前完成页面，周五前完成验收。”</blockquote>
        </div>

        <div class="flow-line" aria-label="核心产品链路">
          <span>自然语言</span>
          <i>→</i>
          <span>多意图</span>
          <i>→</i>
          <span>actions</span>
          <i>→</i>
          <span>Gantt</span>
          <i>→</i>
          <span>拖拽</span>
        </div>

        <pre aria-label="示例结构化 actions"><code>[
  { "action": "create", "task": "页面改版",
    "start": "下周一", "end": "下周三" },
  { "action": "create", "task": "验收",
    "start": "下周四", "end": "下周五" }
]</code></pre>

        <p class="boundary">{{ project.boundary }}</p>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { projects } from '../../data/portfolio.js'

const project = projects.ganttodo
const showStaticPreview = ref(true)
const frameState = ref('static')
let frameTimeout = null
let frameController = null
let frameAttempt = 0

const frameStatus = computed(() => {
  const labels = {
    static: '静态预览模式',
    loading: '正在连接在线体验',
    online: '在线嵌入模式',
    error: '在线体验不可用，已回到静态预览',
  }
  return labels[frameState.value]
})
const experienceActionLabel = computed(() => {
  if (frameState.value === 'loading') return '取消在线加载'
  return showStaticPreview.value ? '加载在线体验' : '查看静态预览'
})
const fallbackLabel = computed(() => (
  ({
    error: 'ONLINE UNAVAILABLE / STATIC FALLBACK',
    loading: 'CHECKING ONLINE / STATIC READY',
  })[frameState.value] || 'STATIC FALLBACK / ALWAYS AVAILABLE'
))

function clearFrameTimeout() {
  window.clearTimeout(frameTimeout)
  frameTimeout = null
}

function clearFrameRequest() {
  frameController?.abort()
  frameController = null
}

async function showOnlineExperience() {
  frameAttempt += 1
  const attempt = frameAttempt
  clearFrameTimeout()
  clearFrameRequest()
  frameState.value = 'loading'
  showStaticPreview.value = true

  frameController = new AbortController()
  frameTimeout = window.setTimeout(() => {
    if (attempt === frameAttempt) showFallback('timeout')
  }, 12_000)

  try {
    await window.fetch(project.demoUrl, {
      cache: 'no-store',
      mode: 'no-cors',
      signal: frameController.signal,
    })

    if (attempt !== frameAttempt || frameState.value !== 'loading') return

    clearFrameTimeout()
    frameController = null
    showStaticPreview.value = false
    frameTimeout = window.setTimeout(() => {
      if (attempt === frameAttempt) showFallback('timeout')
    }, 12_000)
  } catch (error) {
    if (attempt !== frameAttempt) return
    showFallback(error?.name === 'AbortError' ? 'timeout' : 'error')
  }
}

function showFallback(reason = 'manual') {
  frameAttempt += 1
  clearFrameTimeout()
  clearFrameRequest()
  frameState.value = reason === 'manual' ? 'static' : 'error'
  showStaticPreview.value = true
}

function toggleExperienceMode() {
  if (frameState.value === 'loading') {
    showFallback('manual')
    return
  }
  if (showStaticPreview.value) showOnlineExperience()
  else showFallback('manual')
}

function onFrameLoad() {
  if (showStaticPreview.value || frameState.value !== 'loading') return
  clearFrameTimeout()
  frameState.value = 'online'
}

onBeforeUnmount(() => {
  frameAttempt += 1
  clearFrameTimeout()
  clearFrameRequest()
})
</script>

<style scoped>
.ganttodo-project {
  display: grid;
  gap: clamp(1.2rem, 2vw, 2rem);
  padding: clamp(1.25rem, 3vw, 2.75rem);
  color: #2a272e;
}

.project-lead {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 0.55rem clamp(1.25rem, 3vw, 2.8rem);
  align-items: end;
  max-width: none;
}

.project-lead p,
.example-flow > p,
.iframe-fallback p {
  margin: 0;
  color: #786a8f;
  font: 700 0.7rem/1.2 var(--font-sans, sans-serif);
  letter-spacing: 0.14em;
}

.project-lead h3,
.example-flow h4,
.iframe-fallback h4 {
  margin: 0;
  font-family: var(--font-serif, serif);
  font-weight: 500;
}

.project-lead h3 {
  max-width: 20ch;
  font-size: clamp(1.4rem, 2.25vw, 2.15rem);
  line-height: 1.08;
}

.project-lead > span {
  color: #69646d;
  font-size: clamp(0.82rem, 1vw, 0.94rem);
  line-height: 1.6;
}

.project-lead > p {
  grid-column: 1 / -1;
}

.demo-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) minmax(15rem, 0.75fr);
  gap: clamp(1.25rem, 3vw, 2.8rem);
  align-items: start;
}

.experience {
  min-width: 0;
  border: 1px solid rgba(42, 39, 46, 0.22);
  border-radius: 0.7rem;
  overflow: hidden;
  background: #f7f5f0;
}

.experience-bar {
  display: flex;
  min-height: 2.6rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 1rem;
  border-bottom: 1px solid rgba(42, 39, 46, 0.18);
  color: #655f69;
  font-size: 0.68rem;
}

.experience-bar span {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.experience-bar i {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: #a58e73;
}

.experience-bar i.is-online {
  background: #607c6a;
}

.experience-bar > div {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.experience-bar button,
.experience-bar a {
  border: 0;
  border-bottom: 1px solid transparent;
  padding: 0.2rem 0;
  background: transparent;
  color: #4d4654;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}

.experience-bar button:hover,
.experience-bar a:hover {
  border-bottom-color: currentColor;
}

.experience-bar button:focus-visible,
.experience-bar a:focus-visible {
  outline: 2px solid #786a8f;
  outline-offset: 3px;
}

.iframe-viewport {
  position: relative;
  min-height: clamp(22rem, 42vw, 34rem);
  background: #171717;
}

.iframe-viewport iframe {
  display: block;
  width: 100%;
  height: clamp(22rem, 42vw, 34rem);
  border: 0;
  background: #171717;
}

.iframe-fallback {
  position: absolute;
  inset: 0;
  display: grid;
  align-items: end;
  overflow: hidden;
  color: #f7f5f0;
  isolation: isolate;
}

.iframe-fallback::after {
  position: absolute;
  inset: 30% 0 0;
  z-index: -1;
  background: linear-gradient(transparent, rgba(18, 17, 19, 0.96));
  content: "";
}

.iframe-fallback img {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.75;
}

.iframe-fallback > div {
  display: grid;
  max-width: 30rem;
  gap: 0.55rem;
  padding: clamp(1rem, 3vw, 2rem);
}

.iframe-fallback h4 {
  font-size: clamp(1.3rem, 2.5vw, 2rem);
}

.iframe-fallback span {
  color: rgba(247, 245, 240, 0.76);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.example-flow {
  display: grid;
  min-width: 0;
  gap: 0.9rem;
  padding-top: 0.25rem;
  border-top: 2px solid #786a8f;
}

.example-flow h4 {
  font-size: clamp(1.25rem, 2vw, 1.75rem);
}

.example-block {
  display: grid;
  gap: 0.5rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(42, 39, 46, 0.16);
}

.example-block > span {
  color: #655f69;
  font-size: 0.67rem;
  font-weight: 700;
}

.example-block blockquote {
  margin: 0;
  color: #49434d;
  font-size: 0.9375rem;
  line-height: 1.65;
}

.flow-line {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
  color: #5d5563;
  font-size: 0.65rem;
}

.flow-line span {
  padding-bottom: 0.18rem;
  border-bottom: 1px solid rgba(120, 106, 143, 0.5);
}

.flow-line i {
  color: #9b929f;
  font-style: normal;
}

pre {
  max-width: 100%;
  margin: 0;
  overflow: auto;
  padding: 0.9rem;
  border-left: 2px solid #786a8f;
  background: rgba(120, 106, 143, 0.07);
  color: #4a4350;
  font-size: 0.62rem;
  line-height: 1.55;
}

.boundary {
  color: #746e77 !important;
  font: 400 0.875rem/1.65 var(--font-sans, sans-serif) !important;
  letter-spacing: 0 !important;
}

@media (max-width: 760px) {
  .ganttodo-project {
    padding: 1rem;
  }

  .project-lead {
    grid-template-columns: 1fr;
  }

  .project-lead > p {
    grid-column: auto;
  }

  .demo-layout {
    grid-template-columns: 1fr;
  }

  .iframe-viewport,
  .iframe-viewport iframe {
    min-height: 23rem;
    height: 23rem;
  }

  .experience-bar {
    align-items: flex-start;
    flex-direction: column;
    padding: 0.7rem 0.8rem;
    font-size: 0.8125rem;
  }

  .experience-bar button,
  .experience-bar a {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    padding: 0 0.2rem;
  }

  .project-lead > span,
  .iframe-fallback span,
  .example-block blockquote,
  .boundary {
    font-size: 0.9375rem !important;
  }

  pre {
    font-size: 0.75rem;
  }
}
</style>
