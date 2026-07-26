<template>
  <Teleport to="body">
    <div
      ref="layerRef"
      class="cursor-layer"
      :class="{ 'has-label': label }"
      aria-hidden="true"
    >
      <span ref="ringRef" class="cursor-ring">
        <i></i>
        <span v-if="label" class="cursor-label">{{ label }}</span>
      </span>
      <span ref="dotRef" class="cursor-dot"></span>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const HTML_CURSOR_CLASS = 'has-portfolio-custom-cursor'
const CURSOR_TARGET = '[data-cursor-label]'

const layerRef = ref(null)
const ringRef = ref(null)
const dotRef = ref(null)
const label = ref('')

let finePointerQuery = null
let reducedMotionQuery = null
let narrowViewportQuery = null
let pointerListenersActive = false
let animationFrame = 0
let pendingActivation = false
let hasPosition = false
let targetX = 0
let targetY = 0
let ringX = 0
let ringY = 0

function capabilityAllowed() {
  return Boolean(
    finePointerQuery?.matches
    && !reducedMotionQuery?.matches
    && !narrowViewportQuery?.matches
  )
}

function cursorLabelFrom(target) {
  if (!(target instanceof Element)) return ''
  const rawLabel = target.closest(CURSOR_TARGET)?.getAttribute('data-cursor-label')?.trim()
  return rawLabel ? rawLabel.toLocaleUpperCase().slice(0, 12) : ''
}

function onPointerMove(event) {
  if (!capabilityAllowed() || event.pointerType === 'touch') {
    deactivateCursor()
    return
  }

  const target = event.target instanceof Element ? event.target : null
  if (target?.closest('iframe')) {
    deactivateCursor()
    return
  }

  targetX = event.clientX
  targetY = event.clientY
  if (!hasPosition) {
    ringX = targetX
    ringY = targetY
    hasPosition = true
  }

  const nextLabel = cursorLabelFrom(target)
  if (label.value !== nextLabel) label.value = nextLabel

  pendingActivation = true
  scheduleRender()
}

function scheduleRender() {
  if (!animationFrame) animationFrame = requestAnimationFrame(renderCursor)
}

function renderCursor() {
  animationFrame = 0
  if (!pointerListenersActive || !hasPosition) return

  ringX += (targetX - ringX) * 0.2
  ringY += (targetY - ringY) * 0.2

  dotRef.value?.style.setProperty(
    'transform',
    `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`,
  )
  ringRef.value?.style.setProperty(
    'transform',
    `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`,
  )

  if (pendingActivation && layerRef.value && dotRef.value && ringRef.value) {
    pendingActivation = false
    layerRef.value.classList.add('is-visible')
    document.documentElement.classList.add(HTML_CURSOR_CLASS)
  }

  if (Math.abs(targetX - ringX) > 0.1 || Math.abs(targetY - ringY) > 0.1) {
    scheduleRender()
  }
}

function onPointerOut(event) {
  const nextTarget = event.relatedTarget
  if (
    nextTarget === null
    || (nextTarget instanceof Element && nextTarget.closest('iframe'))
  ) {
    deactivateCursor()
  }
}

function onPointerDown(event) {
  if (event.pointerType === 'touch') deactivateCursor()
}

function onVisibilityChange() {
  if (document.hidden) deactivateCursor()
}

function deactivateCursor() {
  pendingActivation = false
  hasPosition = false
  label.value = ''
  layerRef.value?.classList.remove('is-visible')
  document.documentElement.classList.remove(HTML_CURSOR_CLASS)
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = 0
  }
}

function enablePointerListeners() {
  if (pointerListenersActive || !layerRef.value || !ringRef.value || !dotRef.value) return
  pointerListenersActive = true
  document.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerdown', onPointerDown, { passive: true })
  document.addEventListener('pointerout', onPointerOut, { passive: true })
  document.addEventListener('pointercancel', deactivateCursor, { passive: true })
  document.documentElement.addEventListener('pointerleave', deactivateCursor, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('blur', deactivateCursor)
}

function disablePointerListeners() {
  if (pointerListenersActive) {
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('pointerout', onPointerOut)
    document.removeEventListener('pointercancel', deactivateCursor)
    document.documentElement.removeEventListener('pointerleave', deactivateCursor)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('blur', deactivateCursor)
  }
  pointerListenersActive = false
  deactivateCursor()
}

function syncCapability() {
  if (capabilityAllowed()) enablePointerListeners()
  else disablePointerListeners()
}

function addMediaListener(query) {
  if (query.addEventListener) query.addEventListener('change', syncCapability)
  else query.addListener?.(syncCapability)
}

function removeMediaListener(query) {
  if (!query) return
  if (query.removeEventListener) query.removeEventListener('change', syncCapability)
  else query.removeListener?.(syncCapability)
}

onMounted(() => {
  finePointerQuery = window.matchMedia('(pointer: fine) and (hover: hover)')
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  narrowViewportQuery = window.matchMedia('(max-width: 760px)')
  addMediaListener(finePointerQuery)
  addMediaListener(reducedMotionQuery)
  addMediaListener(narrowViewportQuery)
  syncCapability()
})

onUnmounted(() => {
  removeMediaListener(finePointerQuery)
  removeMediaListener(reducedMotionQuery)
  removeMediaListener(narrowViewportQuery)
  disablePointerListeners()
})
</script>

<style scoped>
:global(html.has-portfolio-custom-cursor),
:global(html.has-portfolio-custom-cursor *) {
  cursor: none !important;
}

.cursor-layer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  visibility: hidden;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  mix-blend-mode: difference;
}

.cursor-layer.is-visible {
  visibility: visible;
}

.cursor-dot,
.cursor-ring {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  will-change: transform;
}

.cursor-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fff;
}

.cursor-ring > i {
  display: block;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.92);
  border-radius: 50%;
  transition: transform 150ms ease, border-color 150ms ease;
}

.cursor-layer.has-label .cursor-ring > i {
  border-color: #fff;
  transform: scale(1.16);
}

.cursor-label {
  position: absolute;
  top: 50%;
  left: 24px;
  color: #fff;
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 9px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.12em;
  white-space: nowrap;
  transform: translateY(-50%);
}

@media (max-width: 760px), (pointer: coarse), (hover: none), (prefers-reduced-motion: reduce) {
  .cursor-layer {
    display: none;
  }
}
</style>
