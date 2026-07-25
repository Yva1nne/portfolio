import { ref, computed, readonly } from 'vue'

// ── Constants ──
const STUB_TRAVEL = 156       // visual stub travel in pixels
const DRAG_THRESHOLD = 156    // pixels to complete stub-tear via drag
const DRAG_COMMIT = 72        // release threshold (156 * 0.46)
const SCROLL_THRESHOLD = 220  // pixels to complete stub-tear via scroll
const SCROLL_COMMIT = 128     // scroll commit threshold (220 * 0.58)
const ANIM_DURATION = 1600    // auto-complete animation duration (ms)
const SCROLL_IDLE_BOUNCE = 220
const TICKET_ROTATION_DEG = -5

/**
 * Maps raw input (drag distance or scroll delta) to the stub-tear phase
 * progress 0..0.35. Returns the global progress value.
 */
function stubProgress(rawDistance, threshold) {
  return Math.min(rawDistance / threshold, 1) * 0.35
}

/**
 * Ease-out cubic for smooth deceleration.
 */
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3)
}

function screenToTicketLocal(x, y) {
  const angle = -TICKET_ROTATION_DEG * Math.PI / 180
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  }
}

export function useTicketTransition() {
  // ── Core reactive state ──
  const progress = ref(0)           // 0..1, the master animation progress
  const targetProgress = ref(0)     // where we're animating to
  const isTransitioning = ref(false) // true during auto-complete animation
  const isComplete = ref(false)     // true after transition fully done
  const phase = ref(0)              // 0=stub, 1=pause, 2=flight, 3=paperclip

  // ── Input accumulators ──
  let dragDistance = 0
  let scrollDelta = 0
  const isDragging = ref(false)
  const dragOffset = ref({ x: 0, y: 0 })
  let rafId = null
  let scrollIdleTimer = null

  // ── Phase boundaries ──
  const PHASES = {
    STUB:    { start: 0.00, end: 0.35 },
    PAUSE:   { start: 0.35, end: 0.45 },
    FLIGHT:  { start: 0.45, end: 0.85 },
    CLIP:    { start: 0.85, end: 1.00 },
  }

  /**
   * Update current phase based on progress.
   */
  function updatePhase() {
    const p = progress.value
    if (p < 0.35) phase.value = 0
    else if (p < 0.45) phase.value = 1
    else if (p < 0.85) phase.value = 2
    else phase.value = 3
  }

  /**
   * Map a value within a specific phase. Returns 0..1 within the phase.
   */
  function phaseProgress(pStart, pEnd) {
    const p = progress.value
    if (p <= pStart) return 0
    if (p >= pEnd) return 1
    return (p - pStart) / (pEnd - pStart)
  }

  // ── Drag input ──
  function startDrag() {
    clearScrollBounce()
    isDragging.value = true
    dragDistance = 0
    scrollDelta = 0
  }

  function updateDrag(clientX, clientY, startX, startY) {
    if (isTransitioning.value) return
    const rawX = clientX - startX
    const rawY = clientY - startY
    const tearX = Math.max(rawX, 0)
    dragOffset.value = screenToTicketLocal(rawX, rawY)
    dragDistance = Math.hypot(tearX, rawY * 0.72)
    progress.value = stubProgress(dragDistance, DRAG_THRESHOLD)
    updatePhase()
  }

  function endDrag() {
    isDragging.value = false
    if (isTransitioning.value) return

    if (dragDistance >= DRAG_COMMIT) {
      // Auto-complete from current progress to 1.0
      startAutoComplete()
    } else {
      // Bounce back to 0
      startAutoComplete(0)
    }
  }

  function cancelDrag() {
    isDragging.value = false
    if (!isTransitioning.value) {
      startAutoComplete(0)
    }
  }

  // ── Scroll input ──
  function addScrollDelta(delta) {
    if (isTransitioning.value || isComplete.value) return

    // Clamp delta: only downward scroll counts (positive), ignore large jumps
    const d = Math.min(Math.max(delta, 0), 120)
    scrollDelta += d
    progress.value = stubProgress(scrollDelta, SCROLL_THRESHOLD)
    updatePhase()

    // Auto-commit when threshold reached
    if (scrollDelta >= SCROLL_COMMIT && !isTransitioning.value) {
      startAutoComplete()
    } else {
      scheduleScrollBounce()
    }
  }

  function clearScrollBounce() {
    if (scrollIdleTimer) {
      clearTimeout(scrollIdleTimer)
      scrollIdleTimer = null
    }
  }

  function scheduleScrollBounce() {
    clearScrollBounce()
    scrollIdleTimer = setTimeout(() => {
      scrollIdleTimer = null
      if (!isTransitioning.value && !isComplete.value && progress.value > 0 && progress.value < PHASES.STUB.end) {
        startAutoComplete(0)
      }
    }, SCROLL_IDLE_BOUNCE)
  }

  // ── Auto-complete animation (rAF-driven) ──
  function startAutoComplete(target = 1.0) {
    if (isTransitioning.value && target === 1.0) return // already animating to completion

    clearScrollBounce()
    isTransitioning.value = true
    const startProgress = progress.value
    const endProgress = target
    const duration = target === 0 ? 300 : ANIM_DURATION // faster bounce-back
    const startTime = performance.now()

    targetProgress.value = target

    function animate(now) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = easeOut(t)

      progress.value = startProgress + (endProgress - startProgress) * eased
      updatePhase()

      if (t < 1) {
        rafId = requestAnimationFrame(animate)
      } else {
        progress.value = endProgress
        updatePhase()
        if (target === 0) {
          // Bounced back — reset
          isTransitioning.value = false
          dragDistance = 0
          scrollDelta = 0
          dragOffset.value = { x: 0, y: 0 }
          targetProgress.value = 0
        } else {
          // Completed
          isTransitioning.value = false
          isComplete.value = true
          targetProgress.value = 1.0
        }
        rafId = null
      }
    }

    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(animate)
  }

  function cancelAutoComplete() {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    isTransitioning.value = false
  }

  // ── Reset everything (for page navigation back) ──
  function reset() {
    cancelAutoComplete()
    clearScrollBounce()
    progress.value = 0
    targetProgress.value = 0
    isTransitioning.value = false
    isComplete.value = false
    phase.value = 0
    dragDistance = 0
    scrollDelta = 0
    isDragging.value = false
    dragOffset.value = { x: 0, y: 0 }
  }

  // ── Computed styles for each visual element ──

  // Stub: moves right and fades out during phase 0
  const stubStyle = computed(() => {
    const p = phaseProgress(PHASES.STUB.start, PHASES.STUB.end)
    const x = isDragging.value ? dragOffset.value.x : p * STUB_TRAVEL
    const y = isDragging.value ? dragOffset.value.y : 0
    return {
      '--stub-x': `${Math.round(x)}px`,
      '--stub-y': `${Math.round(y)}px`,
      '--stub-opacity': Math.max(1 - p, isComplete.value ? 0 : 0.001).toFixed(3),
      '--stub-rotate': '0deg',
    }
  })

  // Cover layer: fades out during flight phase
  const coverLayerOpacity = computed(() => {
    const p = phaseProgress(PHASES.FLIGHT.start, 0.65)
    return 1 - p
  })

  // Portfolio layer: fades in during flight phase
  const portfolioLayerOpacity = computed(() => {
    return phaseProgress(PHASES.FLIGHT.start, PHASES.FLIGHT.end)
  })

  // Flight progress (0..1 within the flight phase)
  const flightPhaseProgress = computed(() => {
    return phaseProgress(PHASES.FLIGHT.start, PHASES.FLIGHT.end)
  })

  // Paperclip: appears at phase 3, drops from -30px
  const paperclipStyle = computed(() => {
    const p = phaseProgress(PHASES.CLIP.start, PHASES.CLIP.end)
    return {
      opacity: p,
      transform: `translateY(${(1 - easeOut(p)) * -30}px)`,
    }
  })

  // Whether to show the stub at all (interaction disabled after phase 0)
  const stubInteractive = computed(() => {
    return !isTransitioning.value && !isComplete.value
  })

  // Whether ticket drag target is visible
  const isTicketVisible = computed(() => {
    return progress.value < 0.85
  })

  return {
    // Core state (readonly to consumers)
    progress: readonly(progress),
    isTransitioning: readonly(isTransitioning),
    isComplete: readonly(isComplete),
    phase: readonly(phase),

    // Input methods
    startDrag,
    updateDrag,
    endDrag,
    cancelDrag,
    addScrollDelta,

    // Computed styles
    stubStyle,
    coverLayerOpacity,
    portfolioLayerOpacity,
    flightPhaseProgress,
    paperclipStyle,
    stubInteractive,
    isTicketVisible,
    isDragging: readonly(isDragging),

    // Control
    reset,
    startAutoComplete,

    // Constants for views to use
    DRAG_THRESHOLD,
  }
}
