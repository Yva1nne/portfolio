<template>
  <div
    ref="workspaceRoot"
    class="macbook-workspace"
    :class="{
      'is-open': isOpen,
      'is-project-open': Boolean(activeProject),
    }"
  >
    <div class="macbook-shell">
      <div
        class="macbook-screen"
        :style="{
          '--folder-origin-x': folderOrigin.x,
          '--folder-origin-y': folderOrigin.y,
        }"
        @wheel="onScreenWheel"
      >
        <Transition
          name="screen-mode"
          @enter="focusPendingTarget"
        >
          <div
            v-if="!activeProject"
            key="desktop"
            class="mac-desktop"
            aria-label="项目桌面"
          >
            <header class="desktop-menu">
              <div class="menu-left">
                <span class="apple-mark" aria-hidden="true"></span>
                <strong>访达</strong>
                <span>文件</span>
                <span>编辑</span>
                <span>显示</span>
                <span>前往</span>
              </div>
              <div class="menu-right">
                <span>{{ menuDate }}</span>
                <span>{{ menuTime }}</span>
              </div>
            </header>

            <div class="desktop-folders" aria-label="四个并列项目文件夹">
              <button
                v-for="project in projects"
                :key="project.id"
                type="button"
                class="desktop-folder"
                :data-project-id="project.id"
                data-cursor-label="OPEN"
                @click="openProject(project.id, $event)"
              >
                <span class="folder-icon" aria-hidden="true"></span>
                <strong>{{ project.folderName }}</strong>
              </button>
            </div>

            <p class="desktop-hint">打开任意文件夹 · 四个项目同级</p>
          </div>

          <div
            v-else
            key="project"
            class="project-window"
          >
            <header class="browser-chrome">
              <div class="window-dots">
                <button
                  type="button"
                  class="window-close"
                  aria-label="关闭项目窗口，回到项目桌面"
                  @click="closeProject"
                ></button>
                <span></span>
                <span></span>
              </div>
              <strong>{{ activeProject.folderName }}</strong>
              <span aria-hidden="true"></span>
            </header>

            <Transition
              :name="projectSlideTransition"
              @enter="focusPendingTarget"
            >
              <div
                :key="activeProject.id"
                class="project-scroll"
                @touchmove.stop
              >
                <slot />
              </div>
            </Transition>
          </div>
        </Transition>
      </div>

      <img
        class="macbook-frame"
        src="/macbook-frame.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        draggable="false"
      >
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

const props = defineProps({
  projects: {
    type: Array,
    required: true,
  },
  activeProject: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['select', 'close'])

const workspaceRoot = ref(null)
const isOpen = ref(false)
const menuDate = ref('')
const menuTime = ref('')
const folderOrigin = reactive({ x: '50%', y: '48%' })
const projectSlideDirection = ref('forward')

const projectSlideTransition = computed(() => (
  projectSlideDirection.value === 'backward'
    ? 'project-slide-backward'
    : 'project-slide-forward'
))

let entryObserver = null
let clockTimer = null
let pendingFocusTarget = null

watch(() => props.activeProject?.id, (nextId, previousId) => {
  if (!nextId || !previousId || nextId === previousId) return

  const projectOrder = props.projects.map((project) => project.id)
  projectSlideDirection.value = projectOrder.indexOf(nextId) < projectOrder.indexOf(previousId)
    ? 'backward'
    : 'forward'
  pendingFocusTarget = { type: 'close' }
})

function updateClock() {
  const now = new Date()
  menuDate.value = new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).format(now)
  menuTime.value = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now)
}

function onScreenWheel(event) {
  if (!props.activeProject || event.ctrlKey) return

  const scrollContainer = event.currentTarget.querySelector('.project-scroll')
  if (!scrollContainer) return

  const unit = event.deltaMode === 1
    ? 16
    : event.deltaMode === 2
      ? scrollContainer.clientHeight
      : 1

  event.preventDefault()
  event.stopPropagation()
  scrollContainer.scrollTop += event.deltaY * unit
}

function openProject(projectId, event) {
  const screen = workspaceRoot.value?.querySelector('.macbook-screen')
  const rect = screen?.getBoundingClientRect()

  if (rect && event?.currentTarget) {
    const folderRect = event.currentTarget.getBoundingClientRect()
    folderOrigin.x = `${((folderRect.left + folderRect.width / 2 - rect.left) / rect.width) * 100}%`
    folderOrigin.y = `${((folderRect.top + folderRect.height / 2 - rect.top) / rect.height) * 100}%`
  }

  pendingFocusTarget = { type: 'close' }
  emit('select', projectId)
}

function closeProject() {
  pendingFocusTarget = {
    type: 'folder',
    projectId: props.activeProject?.id,
  }
  emit('close')
}

function focusPendingTarget(element) {
  const focusTarget = pendingFocusTarget
  pendingFocusTarget = null
  if (!focusTarget) return

  if (focusTarget.type === 'close') {
    const closeButton = element.querySelector('.window-close')
      || workspaceRoot.value?.querySelector('.window-close')
    closeButton?.focus({ preventScroll: true })
    return
  }

  const folder = Array.from(element.querySelectorAll('.desktop-folder')).find(
    (candidate) => candidate.dataset.projectId === focusTarget.projectId,
  )
  folder?.focus({ preventScroll: true })
}

onMounted(() => {
  updateClock()
  clockTimer = window.setInterval(updateClock, 30_000)

  if (!('IntersectionObserver' in window)) {
    isOpen.value = true
    return
  }

  entryObserver = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return
    isOpen.value = true
    entryObserver?.disconnect()
  }, { threshold: 0.18 })

  if (workspaceRoot.value) entryObserver.observe(workspaceRoot.value)
})

onBeforeUnmount(() => {
  entryObserver?.disconnect()
  window.clearInterval(clockTimer)
})
</script>

<style scoped>
.macbook-workspace {
  position: relative;
  display: grid;
  width: 100%;
  min-width: 0;
  justify-items: center;
  perspective: 1800px;
  perspective-origin: 50% 90%;
}

.macbook-shell {
  position: relative;
  width: min(100%, 1260px);
  aspect-ratio: 1536 / 1024;
  transform: translateY(42px) rotateX(-45deg) scale(0.96);
  transform-origin: 50% 91%;
  transform-style: preserve-3d;
  transition:
    aspect-ratio 620ms cubic-bezier(0.22, 0.72, 0.24, 1),
    transform 680ms cubic-bezier(0.18, 0.76, 0.24, 1),
    width 620ms cubic-bezier(0.22, 0.72, 0.24, 1);
}

.macbook-workspace.is-open .macbook-shell {
  transform: translateY(0) rotateX(0) scale(1);
}

.macbook-screen {
  position: absolute;
  top: 7.85%;
  left: 12.15%;
  z-index: 1;
  width: 75.55%;
  height: 77.7%;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
  background: #d7e3e9;
  transition:
    top 620ms cubic-bezier(0.22, 0.72, 0.24, 1),
    left 620ms cubic-bezier(0.22, 0.72, 0.24, 1),
    width 620ms cubic-bezier(0.22, 0.72, 0.24, 1),
    height 620ms cubic-bezier(0.22, 0.72, 0.24, 1),
    border-radius 420ms ease,
    box-shadow 420ms ease;
}

.macbook-frame {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  transition:
    opacity 360ms ease,
    transform 620ms cubic-bezier(0.22, 0.72, 0.24, 1);
  user-select: none;
  -webkit-user-drag: none;
}

@media (min-width: 761px) {
  .macbook-workspace.is-project-open .macbook-shell {
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  .macbook-workspace.is-project-open .macbook-screen {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    box-shadow: 0 28px 70px rgba(24, 27, 28, 0.16);
  }

  .macbook-workspace.is-project-open .macbook-frame {
    opacity: 0;
    transform: scale(1.045);
  }
}

.mac-desktop,
.project-window {
  position: absolute;
  inset: 0;
}

.mac-desktop {
  overflow: hidden;
  background:
    linear-gradient(rgba(17, 38, 49, 0.08), rgba(17, 38, 49, 0.08)),
    url('/wallpaper.jpg') center / cover no-repeat,
    #7eb3c1;
}

.desktop-menu {
  position: relative;
  z-index: 2;
  display: flex;
  height: 28px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 14px;
  background: rgba(235, 244, 244, 0.42);
  color: #141718;
  font-family: var(--font-sans, sans-serif);
  font-size: 10px;
  backdrop-filter: blur(8px);
}

.menu-left,
.menu-right {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}

.apple-mark {
  width: 24px;
  height: 18px;
  flex: 0 0 auto;
  background: url('/Apple.png') center / contain no-repeat;
}

.desktop-folders {
  position: absolute;
  top: 26%;
  left: 50%;
  z-index: 2;
  display: grid;
  width: min(84%, 700px);
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(8px, 2vw, 24px);
  transform: translateX(-50%);
}

.desktop-folder {
  display: grid;
  min-width: 0;
  min-height: 112px;
  align-content: center;
  justify-items: center;
  gap: 8px;
  border: 0;
  border-radius: 9px;
  padding: 8px 4px;
  background: transparent;
  color: #fff;
  text-align: center;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.7);
  cursor: pointer;
  transition:
    background 160ms ease,
    transform 160ms ease;
}

.desktop-folder:hover,
.desktop-folder:focus-visible {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.desktop-folder:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

.folder-icon {
  width: clamp(46px, 6.2vw, 68px);
  aspect-ratio: 1;
  background: url('/文件夹icon.png') center / contain no-repeat;
  filter: drop-shadow(0 7px 12px rgba(0, 52, 83, 0.25));
}

.desktop-folder strong {
  max-width: 100%;
  overflow: hidden;
  font-family: var(--font-sans, sans-serif);
  font-size: clamp(8px, 1.05vw, 12px);
  font-weight: 500;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desktop-hint {
  position: absolute;
  right: 18px;
  bottom: 14px;
  margin: 0;
  color: rgba(255, 255, 255, 0.84);
  font: 600 9px/1.2 var(--font-sans, sans-serif);
  letter-spacing: 0.08em;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}

.project-window {
  display: grid;
  grid-template-rows: 36px minmax(0, 1fr);
  background: #f8f7f3;
  clip-path: circle(150% at var(--folder-origin-x) var(--folder-origin-y));
  transform-origin: var(--folder-origin-x) var(--folder-origin-y);
}

.browser-chrome {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr) 84px;
  align-items: center;
  border-bottom: 1px solid rgba(20, 23, 24, 0.14);
  background: rgba(255, 255, 255, 0.9);
}

.browser-chrome > strong {
  justify-self: start;
  overflow: hidden;
  max-width: 100%;
  padding-left: 10px;
  color: #283037;
  font-size: clamp(10px, 1.05vw, 14px);
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.window-dots {
  display: grid;
  grid-template-columns: repeat(3, 18px);
  align-items: center;
  gap: 0;
  padding-left: 10px;
}

.window-dots span,
.window-close {
  position: relative;
  width: 18px;
  height: 36px;
}

.window-close {
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.window-close::before,
.window-dots span::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff625c;
  content: '';
  transform: translate(-50%, -50%);
}

.window-close:focus-visible {
  outline: 2px solid #5f1614;
  outline-offset: -3px;
}

.window-dots span:nth-child(2)::before {
  background: #ffbd44;
}

.window-dots span:nth-child(3)::before {
  background: #00ca4e;
}

.project-scroll {
  grid-row: 2;
  grid-column: 1;
  min-width: 0;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: #f8f7f3;
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
}

.mac-desktop.screen-mode-enter-active,
.mac-desktop.screen-mode-leave-active {
  transition: opacity 260ms ease;
}

.mac-desktop.screen-mode-enter-from,
.mac-desktop.screen-mode-leave-to {
  opacity: 0;
}

.project-window.screen-mode-enter-active,
.project-window.screen-mode-leave-active {
  transition:
    clip-path 620ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 420ms ease,
    transform 620ms cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: clip-path, opacity, transform;
}

.project-window.screen-mode-enter-from,
.project-window.screen-mode-leave-to {
  opacity: 0.04;
  clip-path: circle(6% at var(--folder-origin-x) var(--folder-origin-y));
  transform: scale(0.16);
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

@media (max-width: 760px) {
  .desktop-menu {
    height: 23px;
    padding: 0 8px;
    font-size: 7px;
  }

  .menu-left {
    gap: 7px;
  }

  .menu-left span:nth-of-type(n + 3),
  .menu-right span:first-child {
    display: none;
  }

  .apple-mark {
    width: 18px;
    height: 14px;
  }

  .desktop-folders {
    top: 22%;
    width: 72%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0;
  }

  .desktop-folder {
    min-height: 62px;
    gap: 2px;
    padding: 2px;
  }

  .folder-icon {
    width: 34px;
  }

  .desktop-folder strong {
    max-width: 86px;
    font-size: 6px;
  }

  .desktop-hint {
    right: 8px;
    bottom: 6px;
    font-size: 6px;
  }

  .browser-chrome {
    grid-template-columns: 68px minmax(0, 1fr) 68px;
  }

  .window-dots {
    grid-template-columns: repeat(3, 16px);
    padding-left: 8px;
  }

  .window-dots span,
  .window-close {
    width: 16px;
  }

  .window-close::before,
  .window-dots span::before {
    width: 7px;
    height: 7px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .macbook-shell,
  .macbook-screen,
  .macbook-frame,
  .desktop-folder,
  .mac-desktop.screen-mode-enter-active,
  .mac-desktop.screen-mode-leave-active,
  .project-window.screen-mode-enter-active,
  .project-window.screen-mode-leave-active,
  .project-slide-forward-enter-active,
  .project-slide-forward-leave-active,
  .project-slide-backward-enter-active,
  .project-slide-backward-leave-active {
    transition: none;
  }

  .macbook-shell,
  .macbook-workspace.is-open .macbook-shell,
  .project-window.screen-mode-enter-from,
  .project-window.screen-mode-leave-to,
  .project-slide-forward-enter-from,
  .project-slide-forward-leave-to,
  .project-slide-backward-enter-from,
  .project-slide-backward-leave-to {
    transform: none;
  }

  .project-window.screen-mode-enter-from,
  .project-window.screen-mode-leave-to {
    opacity: 1;
    clip-path: none;
  }
}
</style>
