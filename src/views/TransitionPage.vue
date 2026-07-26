<template>
  <section
    id="about"
    class="transition-page"
    :class="{ 'is-complete': isComplete }"
    @wheel="onWheel"
  >
    <div
      v-show="!isComplete"
      class="cover-layer"
      :style="{ opacity: coverLayerOpacity, pointerEvents: coverPointerEvents }"
      :aria-hidden="isComplete"
    >
      <header class="cover-identity">
        <p>{{ profile.edition }}</p>
        <div>
          <span>{{ profile.name }}</span>
          <strong>{{ profile.direction }}</strong>
        </div>
      </header>

      <div class="ticket-scene">
        <div class="ticket-complete" aria-label="叶奕含个人作品集入场票">
          <div ref="ticketMainBoxRef" class="ticket-main" :style="mainTicketCoverStyle">
            <img
              ref="ticketMainRef"
              src="/ticket-main.svg"
              alt="叶奕含作品集主票面"
              draggable="false"
            />
          </div>

          <button
            class="ticket-stub"
            :class="{ 'is-dragging': isDragging }"
            :style="stubStyle"
            :disabled="!stubInteractive"
            :tabindex="isComplete ? -1 : 0"
            aria-label="拖动票根进入作品集，也可以按 Enter"
            type="button"
            @keydown="onStubKeydown"
            @pointerdown="onStubPointerDown"
          >
            <img src="/ticket-stub.svg" alt="" draggable="false" />
          </button>
        </div>

        <div class="ticket-instruction" :class="{ 'is-hidden': hideStubCallout }">
          <span aria-hidden="true">↗</span>
          <p>
            <strong>拖动票根，进入作品集</strong>
            <small>也可以按 Enter</small>
          </p>
        </div>
      </div>
    </div>

    <div
      class="about-layer"
      :style="{ opacity: isComplete ? 1 : portfolioLayerOpacity }"
      :aria-hidden="!isComplete"
      :inert="!isComplete"
    >
      <div class="about-stage">
        <img
          class="notebook-underlay"
          src="/portfolio/image 7.png"
          alt=""
          draggable="false"
        />

        <div class="paper-spread">
          <div ref="portfolioTicketTarget" class="landed-ticket" :style="landedTicketStyle">
            <img src="/ticket-main.svg" alt="" draggable="false" />
            <img
              class="landed-paperclip"
              src="/portfolio/image 10.png"
              alt=""
              :style="paperclipStyle"
              draggable="false"
            />
          </div>

          <article class="about-intro">
            <p class="section-kicker">ABOUT / PROFILE</p>
            <h1>{{ profile.headline }}</h1>

            <div class="intro-copy">
              <p v-for="paragraph in profile.introduction" :key="paragraph">
                {{ paragraph }}
              </p>
            </div>

            <dl class="profile-meta">
              <div v-for="item in profile.meta" :key="item.label">
                <dt>{{ item.label }}</dt>
                <dd>
                  <a
                    v-if="item.href"
                    :href="item.href"
                    :target="item.href.startsWith('http') ? '_blank' : undefined"
                    :rel="item.href.startsWith('http') ? 'noreferrer' : undefined"
                    :data-cursor="item.href.startsWith('http') ? 'VISIT' : undefined"
                  >
                    {{ item.value }}
                  </a>
                  <span v-else>{{ item.value }}</span>
                </dd>
              </div>
            </dl>
          </article>

          <section class="capability-page" aria-labelledby="capability-title">
            <div class="capability-heading">
              <p class="section-kicker">CAPABILITY STACK</p>
              <h2 id="capability-title">判断、系统与验证</h2>
              <p>AI 是手段。每项能力都要落回具体任务、边界与证据。</p>
            </div>

            <ol class="capability-list">
              <li v-for="capability in capabilities" :key="capability.id">
                <span>{{ capability.number }}</span>
                <div>
                  <h3>{{ capability.label }}</h3>
                  <p class="capability-keywords">{{ capability.keywords }}</p>
                  <p class="capability-evidence">{{ capability.evidence }}</p>
                </div>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>

    <img
      v-if="flightClone"
      class="flight-ticket"
      :src="flightClone.src"
      :style="flightCloneStyle"
      alt=""
      draggable="false"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { capabilities, profile } from '../data/portfolio.js'
import { useTicketTransition } from '../composables/useTicketTransition.js'

const emit = defineEmits(['transition-complete'])

const ticketMainRef = ref(null)
const ticketMainBoxRef = ref(null)
const portfolioTicketTarget = ref(null)

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

const flightClone = ref(null)
const flightCloneStyle = ref({})
const coverPointerEvents = computed(() => (
  progress.value < 0.35 && !isComplete.value ? 'auto' : 'none'
))
const hideStubCallout = computed(() => (
  isDragging.value || isTransitioning.value || progress.value > 0.015
))
const mainTicketCoverStyle = computed(() => ({
  opacity: flightClone.value || progress.value >= 0.45 ? 0 : 1,
}))
const landedTicketStyle = computed(() => ({
  opacity: progress.value >= 0.85 ? 1 : 0,
}))

let dragStartX = 0
let dragStartY = 0
let dragPointerId = null
let touchListenerAttached = false

function onStubPointerDown(event) {
  if (!stubInteractive.value) return
  event.preventDefault()

  dragStartX = event.clientX
  dragStartY = event.clientY
  dragPointerId = event.pointerId
  startDrag()

  try {
    event.currentTarget.setPointerCapture?.(event.pointerId)
  } catch {
    // Pointer capture is a progressive enhancement.
  }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerCancel)
}

function onStubKeydown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  forceComplete()
}

function onPointerMove(event) {
  if (event.pointerId !== dragPointerId) return
  updateDrag(event.clientX, event.clientY, dragStartX, dragStartY)
}

function onPointerUp(event) {
  if (event.pointerId !== dragPointerId) return
  cleanupDrag()
  endDrag()
}

function onPointerCancel(event) {
  if (event.pointerId !== dragPointerId) return
  cleanupDrag()
  cancelDrag()
}

function cleanupDrag() {
  dragPointerId = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerCancel)
}

function onWheel(event) {
  if (isComplete.value) return
  event.preventDefault()
  if (!isTransitioning.value && progress.value < 0.35) {
    addScrollDelta(event.deltaY)
  }
}

function onTouchMove(event) {
  if (!isComplete.value) event.preventDefault()
}

function attachTouchLock() {
  if (touchListenerAttached) return
  document.addEventListener('touchmove', onTouchMove, { passive: false })
  touchListenerAttached = true
}

function detachTouchLock() {
  if (!touchListenerAttached) return
  document.removeEventListener('touchmove', onTouchMove)
  touchListenerAttached = false
}

function startFlightClone() {
  const sourceElement = ticketMainBoxRef.value
  const targetElement = portfolioTicketTarget.value
  if (!sourceElement || !targetElement || flightClone.value) return

  const sourceBox = sourceElement.getBoundingClientRect()
  const targetBox = targetElement.getBoundingClientRect()

  flightClone.value = {
    src: ticketMainRef.value?.currentSrc || '/ticket-main.svg',
    source: {
      centerX: sourceBox.left + sourceBox.width / 2,
      centerY: sourceBox.top + sourceBox.height / 2,
      width: sourceBox.width,
      height: sourceBox.height,
    },
    target: {
      centerX: targetBox.left + targetBox.width / 2,
      centerY: targetBox.top + targetBox.height / 2,
      width: targetBox.width,
      height: targetBox.height,
    },
  }

  updateFlightCloneTransform(0)
}

function easeOut(value) {
  return 1 - Math.pow(1 - value, 3)
}

function updateFlightCloneTransform(value) {
  if (!flightClone.value) return

  const { source, target } = flightClone.value
  const eased = easeOut(value)
  const translateX = (target.centerX - source.centerX) * eased
  const translateY = (target.centerY - source.centerY) * eased
  const scaleX = 1 + (target.width / source.width - 1) * eased
  const scaleY = 1 + (target.height / source.height - 1) * eased

  flightCloneStyle.value = {
    left: `${source.centerX}px`,
    top: `${source.centerY}px`,
    width: `${source.width}px`,
    height: `${source.height}px`,
    transform: `translate(-50%, -50%) translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY}) rotate(-4deg)`,
    opacity: 1,
  }
}

function finishFlightClone() {
  flightClone.value = null
  flightCloneStyle.value = {}
}

function forceComplete() {
  if (!stubInteractive.value) return
  startAutoComplete()
}

watch(phase, (nextPhase, previousPhase) => {
  if (nextPhase >= 2 && previousPhase < 2) startFlightClone()
  if (nextPhase > 2 && flightClone.value) finishFlightClone()
})

watch(flightPhaseProgress, (value) => {
  if (flightClone.value) updateFlightCloneTransform(value)
})

watch(isComplete, (complete) => {
  if (!complete) return
  document.body.classList.remove('is-transition-locked')
  detachTouchLock()
  emit('transition-complete')
})

onMounted(() => {
  window.scrollTo(0, 0)
  document.body.classList.add('is-transition-locked')
  attachTouchLock()
})

onUnmounted(() => {
  cleanupDrag()
  detachTouchLock()
  document.body.classList.remove('is-transition-locked')
})
</script>

<style scoped>
.transition-page {
  position: relative;
  min-height: 100svh;
  overflow: clip;
  background: #deddd8;
  color: var(--ink);
}

.cover-layer {
  position: absolute;
  inset: 0 0 auto;
  z-index: 5;
  height: 100svh;
  overflow: hidden;
  background:
    radial-gradient(circle at 48% 48%, rgba(255, 255, 255, 0.5), transparent 42%),
    #deddd8;
}

.cover-identity {
  position: absolute;
  z-index: 2;
  top: clamp(24px, 4vw, 52px);
  left: 50%;
  display: flex;
  width: min(calc(100% - 48px), 1360px);
  align-items: flex-start;
  justify-content: space-between;
  transform: translateX(-50%);
  border-top: 1px solid rgba(24, 26, 28, 0.35);
  padding-top: 12px;
  font-family: 'Manrope', 'Noto Sans SC', sans-serif;
}

.cover-identity p,
.cover-identity span,
.cover-identity strong {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.13em;
  line-height: 1.4;
  text-transform: uppercase;
}

.cover-identity div {
  display: flex;
  gap: 28px;
  text-align: right;
}

.cover-identity strong {
  font-weight: 600;
}

.ticket-scene {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.ticket-complete {
  position: relative;
  width: min(72vw, 940px);
  aspect-ratio: 907 / 360;
  transform: rotate(-4deg);
  filter: drop-shadow(0 24px 24px rgba(33, 31, 27, 0.16));
}

.ticket-main,
.ticket-stub {
  position: absolute;
  top: 0;
  height: 100%;
}

.ticket-main {
  left: 0;
  width: 77.29%;
  transition: opacity 80ms linear;
}

.ticket-stub {
  right: 0;
  width: 22.71%;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: grab;
  touch-action: none;
  transform: translate3d(var(--stub-x), var(--stub-y), 0) rotate(var(--stub-rotate));
  opacity: var(--stub-opacity);
  transform-origin: left center;
}

.ticket-stub:active,
.ticket-stub.is-dragging {
  cursor: grabbing;
}

.ticket-main img,
.ticket-stub img,
.landed-ticket > img:first-child {
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
}

.ticket-instruction {
  position: absolute;
  top: calc(50% + min(18vw, 216px));
  right: max(7vw, calc((100vw - 1180px) / 2));
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: opacity 180ms ease, transform 180ms ease;
  color: rgba(24, 26, 28, 0.68);
}

.ticket-instruction.is-hidden {
  opacity: 0;
  transform: translateY(6px);
}

.ticket-instruction > span {
  font-size: 22px;
  transform: rotate(-18deg);
}

.ticket-instruction p {
  display: grid;
  gap: 4px;
  margin: 0;
}

.ticket-instruction strong,
.ticket-instruction small {
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 500;
}

.ticket-instruction strong {
  font-size: 14px;
}

.ticket-instruction small {
  color: rgba(24, 26, 28, 0.48);
  font-size: 12px;
}

.about-layer {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  transition: opacity 240ms linear;
}

.about-stage {
  position: relative;
  display: grid;
  min-height: 100svh;
  place-items: center;
  padding: clamp(34px, 5vw, 76px) 24px;
}

.notebook-underlay {
  position: absolute;
  inset: 50% auto auto 50%;
  width: min(96vw, 1480px);
  height: min(94svh, 920px);
  object-fit: contain;
  opacity: 0.34;
  transform: translate(-50%, -50%);
  filter: saturate(0.72);
  pointer-events: none;
}

.paper-spread {
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  width: min(100%, 1320px);
  min-height: min(820px, calc(100svh - 72px));
  overflow: hidden;
  border: 1px solid rgba(64, 58, 48, 0.17);
  background:
    linear-gradient(90deg, transparent 49.9%, rgba(70, 62, 49, 0.12) 50%, transparent 50.15%),
    radial-gradient(circle at 22% 12%, rgba(255, 255, 255, 0.72), transparent 38%),
    #f4f0e7;
  box-shadow: 0 30px 70px rgba(52, 47, 39, 0.18);
}

.paper-spread::after {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(86, 76, 59, 0.018) 0,
    rgba(86, 76, 59, 0.018) 1px,
    transparent 1px,
    transparent 4px
  );
  content: '';
  pointer-events: none;
}

.landed-ticket {
  position: absolute;
  z-index: 3;
  top: 38px;
  left: 4.6%;
  width: clamp(190px, 19vw, 270px);
  aspect-ratio: 701 / 360;
  transform: rotate(-3deg);
  filter: drop-shadow(0 10px 12px rgba(33, 31, 27, 0.16));
}

.landed-paperclip {
  position: absolute;
  top: -17%;
  right: 22%;
  width: 17%;
  height: auto;
}

.about-intro,
.capability-page {
  position: relative;
  z-index: 2;
}

.about-intro {
  grid-column: 1 / span 6;
  padding: clamp(184px, 23vh, 226px) clamp(34px, 4.3vw, 70px) 54px;
}

.section-kicker {
  margin: 0 0 22px;
  color: var(--muted);
  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.about-intro h1 {
  max-width: 10ch;
  font-size: clamp(42px, 4.3vw, 68px);
  line-height: 1.02;
}

.intro-copy {
  display: grid;
  gap: 14px;
  max-width: 600px;
  margin-top: 36px;
}

.intro-copy p {
  margin: 0;
  color: #383a3a;
  font-size: clamp(15px, 1.15vw, 17px);
  line-height: 1.75;
}

.profile-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 38px 0 0;
  border-top: 1px solid var(--line-strong);
}

.profile-meta > div {
  min-width: 0;
  border-bottom: 1px solid var(--line);
  padding: 12px 12px 12px 0;
}

.profile-meta dt,
.profile-meta dd {
  margin: 0;
}

.profile-meta dt {
  margin-bottom: 5px;
  color: var(--muted);
  font-family: 'Manrope', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.13em;
}

.profile-meta dd {
  overflow-wrap: anywhere;
  font-size: 13px;
  line-height: 1.45;
}

.profile-meta a {
  background-image: linear-gradient(currentColor, currentColor);
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 0 1px;
  transition: background-size 160ms ease;
}

.profile-meta a:hover,
.profile-meta a:focus-visible {
  background-size: 100% 1px;
}

.capability-page {
  grid-column: 7 / -1;
  padding: clamp(56px, 8vh, 86px) clamp(36px, 4.8vw, 76px) 54px;
}

.capability-heading {
  max-width: 460px;
  margin-bottom: clamp(34px, 6vh, 66px);
}

.capability-heading h2 {
  font-size: clamp(38px, 3.6vw, 56px);
}

.capability-heading > p:last-child {
  max-width: 34ch;
  margin: 20px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.7;
}

.capability-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.capability-list li {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 14px;
  border-top: 1px solid var(--line-strong);
  padding: 17px 0 18px;
}

.capability-list li > span {
  color: var(--muted);
  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 700;
}

.capability-list h3,
.capability-list p {
  margin: 0;
}

.capability-list h3 {
  font-family: 'Manrope', 'Noto Sans SC', sans-serif;
  font-size: 13px;
  letter-spacing: 0.06em;
  line-height: 1.3;
}

.capability-keywords {
  margin-top: 6px !important;
  font-size: 13px;
  line-height: 1.55;
}

.capability-evidence {
  margin-top: 7px !important;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.55;
}

.flight-ticket {
  position: fixed;
  z-index: 20;
  object-fit: fill;
  pointer-events: none;
  transform-origin: center;
  will-change: transform;
}

@media (max-width: 1080px) {
  .paper-spread {
    min-height: 760px;
  }

  .about-intro {
    padding-right: 38px;
    padding-left: 38px;
  }

  .capability-page {
    padding-right: 38px;
    padding-left: 38px;
  }
}

@media (max-width: 760px) {
  .transition-page {
    overflow: visible;
  }

  .cover-identity {
    width: calc(100% - 32px);
  }

  .cover-identity div {
    display: grid;
    gap: 3px;
  }

  .cover-identity p,
  .cover-identity span,
  .cover-identity strong {
    font-size: 9px;
  }

  .ticket-complete {
    width: 92vw;
  }

  .ticket-instruction {
    top: calc(50% + 88px);
    right: 18px;
  }

  .ticket-instruction strong {
    font-size: 12px;
  }

  .about-stage {
    display: block;
    min-height: 100svh;
    padding: 20px 12px 40px;
  }

  .notebook-underlay {
    top: 320px;
    width: 100%;
    max-width: 100%;
    height: auto;
    opacity: 0.2;
  }

  .paper-spread {
    display: block;
    min-height: 0;
    overflow: hidden;
    background:
      radial-gradient(circle at 15% 8%, rgba(255, 255, 255, 0.76), transparent 30%),
      #f4f0e7;
  }

  .paper-spread::before {
    display: none;
  }

  .landed-ticket {
    top: 28px;
    left: 24px;
    width: min(58vw, 230px);
  }

  .about-intro {
    padding: 156px 24px 50px;
  }

  .about-intro h1 {
    max-width: 12ch;
    font-size: clamp(38px, 12vw, 52px);
  }

  .intro-copy {
    margin-top: 28px;
  }

  .intro-copy p {
    font-size: 16px;
  }

  .profile-meta {
    grid-template-columns: 1fr;
  }

  .capability-page {
    border-top: 1px solid rgba(64, 58, 48, 0.18);
    padding: 50px 24px 36px;
  }

  .capability-heading {
    margin-bottom: 36px;
  }

  .capability-heading h2 {
    font-size: 38px;
  }

  .capability-list li {
    grid-template-columns: 34px minmax(0, 1fr);
  }

  .capability-list h3,
  .capability-keywords,
  .capability-evidence {
    font-size: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ticket-instruction,
  .profile-meta a,
  .about-layer {
    transition: none;
  }

  .flight-ticket {
    will-change: auto;
  }
}
</style>
