<template>
  <aside
    class="music-player"
    :class="{
      'is-playing': isPlaying,
      'has-error': playbackState === 'error',
    }"
    aria-label="背景音乐播放器"
  >
    <audio
      ref="audioRef"
      :src="track.src"
      preload="metadata"
      @loadstart="onLoadStart"
      @loadedmetadata="syncMetadata"
      @durationchange="syncMetadata"
      @timeupdate="syncProgress"
      @playing="onPlaying"
      @pause="onPause"
      @waiting="onWaiting"
      @canplay="onCanPlay"
      @ended="onEnded"
      @volumechange="syncVolume"
      @error="onAudioError"
    ></audio>

    <div class="player-primary">
      <button
        type="button"
        class="play-button"
        data-cursor-label="PLAY"
        :aria-label="playButtonLabel"
        :aria-pressed="isPlaying"
        @click="togglePlayback"
      >
        {{ isPlaying ? 'PAUSE' : 'PLAY' }}
      </button>

      <div class="track-copy">
        <p>NOW PLAYING / LOCAL AUDIO</p>
        <strong :title="track.title">{{ track.title }}</strong>
        <span>{{ track.artist }}</span>
      </div>

      <span class="level-meter" aria-hidden="true">
        <i></i><i></i><i></i><i></i>
      </span>
    </div>

    <div class="player-controls">
      <label class="range-control progress-control">
        <span class="visually-hidden">播放进度</span>
        <input
          type="range"
          min="0"
          :max="duration || 0"
          step="0.1"
          :value="progressValue"
          :disabled="!hasDuration || playbackState === 'error'"
          :aria-valuetext="`${formatTime(progressValue)} / ${formatTime(duration)}`"
          :style="{ '--range-progress': `${progressPercent}%` }"
          @input="seekTo"
        >
      </label>

      <time class="time-copy">{{ formatTime(progressValue) }} / {{ formatTime(duration) }}</time>

      <button
        type="button"
        class="mute-button"
        :aria-label="muted ? '取消静音' : '静音'"
        :aria-pressed="muted"
        @click="toggleMuted"
      >
        {{ muted ? 'MUTED' : 'SOUND' }}
      </button>

      <label class="range-control volume-control">
        <span class="visually-hidden">音量</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          :value="volume"
          :aria-valuetext="`${Math.round(volume * 100)}%`"
          :style="{ '--range-progress': `${volume * 100}%` }"
          @input="setVolume"
        >
      </label>
    </div>

    <p
      class="player-status"
      :class="{ 'is-error': playbackState === 'error' }"
      role="status"
      aria-live="polite"
    >
      {{ visibleStatus }}
    </p>
  </aside>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const track = {
  src: '/audio/ambient-music-test-yamaha-ck61.ogg',
  title: 'Ambient Music Test · Yamaha CK61',
  artist: 'Wilfredor',
}

const storageKeys = {
  volume: 'portfolio:music-volume',
  muted: 'portfolio:music-muted',
}

const audioRef = ref(null)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.72)
const muted = ref(false)
const playbackState = ref('loading')
const errorMessage = ref('')

const isPlaying = computed(() => (
  playbackState.value === 'playing' || playbackState.value === 'buffering'
))
const hasDuration = computed(() => Number.isFinite(duration.value) && duration.value > 0)
const progressValue = computed(() => (
  hasDuration.value ? Math.min(currentTime.value, duration.value) : 0
))
const progressPercent = computed(() => (
  hasDuration.value ? (progressValue.value / duration.value) * 100 : 0
))
const playButtonLabel = computed(() => (
  isPlaying.value
    ? `暂停 ${track.title}`
    : `${playbackState.value === 'ended' ? '重新播放' : '播放'} ${track.title}`
))
const visibleStatus = computed(() => {
  if (errorMessage.value) return `ERROR / ${errorMessage.value}`

  const labels = {
    loading: 'LOADING / 正在读取本地音频',
    ready: 'READY / 点击播放，不会自动开始',
    playing: 'PLAYING / 本地音频',
    buffering: 'BUFFERING / 正在缓冲',
    paused: 'PAUSED / 已暂停',
    ended: 'ENDED / 播放完毕',
  }
  return labels[playbackState.value] || labels.ready
})

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function readPreferences() {
  try {
    const savedVolumeValue = window.localStorage.getItem(storageKeys.volume)
    const savedVolume = Number(savedVolumeValue)
    const savedMuted = window.localStorage.getItem(storageKeys.muted)

    if (savedVolumeValue !== null && Number.isFinite(savedVolume)) {
      volume.value = clamp(savedVolume, 0, 1)
    }
    if (savedMuted === 'true' || savedMuted === 'false') muted.value = savedMuted === 'true'
  } catch {
    // Storage may be unavailable in private browsing; playback remains usable.
  }
}

function persistPreferences() {
  try {
    window.localStorage.setItem(storageKeys.volume, String(volume.value))
    window.localStorage.setItem(storageKeys.muted, String(muted.value))
  } catch {
    // Preferences are optional and must not block playback.
  }
}

function applyPreferences() {
  if (!audioRef.value) return
  audioRef.value.volume = volume.value
  audioRef.value.muted = muted.value
}

async function togglePlayback() {
  const audio = audioRef.value
  if (!audio) return

  if (!audio.paused) {
    audio.pause()
    return
  }

  errorMessage.value = ''
  if (audio.ended || (hasDuration.value && audio.currentTime >= duration.value)) {
    audio.currentTime = 0
    currentTime.value = 0
  }

  try {
    playbackState.value = 'loading'
    await audio.play()
  } catch (error) {
    playbackState.value = 'error'
    errorMessage.value = error?.name === 'NotAllowedError'
      ? '浏览器未允许播放，请再次点击 PLAY'
      : '音频播放失败，请检查文件或浏览器格式支持'
  }
}

function seekTo(event) {
  const audio = audioRef.value
  if (!audio || !hasDuration.value) return
  const nextTime = clamp(Number(event.target.value), 0, duration.value)
  audio.currentTime = nextTime
  currentTime.value = nextTime
}

function setVolume(event) {
  volume.value = clamp(Number(event.target.value), 0, 1)
  if (volume.value > 0 && muted.value) muted.value = false
  applyPreferences()
  persistPreferences()
}

function toggleMuted() {
  muted.value = !muted.value
  applyPreferences()
  persistPreferences()
}

function syncMetadata() {
  const audio = audioRef.value
  if (!audio) return
  duration.value = Number.isFinite(audio.duration) ? audio.duration : 0
  currentTime.value = audio.currentTime || 0
  if (audio.paused && playbackState.value !== 'error') playbackState.value = 'ready'
}

function syncProgress() {
  currentTime.value = audioRef.value?.currentTime || 0
}

function syncVolume() {
  const audio = audioRef.value
  if (!audio) return
  volume.value = audio.volume
  muted.value = audio.muted
}

function onLoadStart() {
  if (playbackState.value !== 'playing') playbackState.value = 'loading'
}

function onPlaying() {
  errorMessage.value = ''
  playbackState.value = 'playing'
}

function onPause() {
  const audio = audioRef.value
  if (!audio || playbackState.value === 'error') return
  playbackState.value = audio.ended ? 'ended' : 'paused'
}

function onWaiting() {
  if (audioRef.value && !audioRef.value.paused) playbackState.value = 'buffering'
}

function onCanPlay() {
  if (playbackState.value !== 'error' && audioRef.value?.paused) playbackState.value = 'ready'
}

function onEnded() {
  currentTime.value = duration.value
  playbackState.value = 'ended'
}

function onAudioError() {
  const errorCode = audioRef.value?.error?.code
  const messages = {
    1: '音频加载已中止',
    2: '音频文件读取失败',
    3: '浏览器无法解码该音频',
    4: '音频文件不存在或格式不受支持',
  }
  playbackState.value = 'error'
  errorMessage.value = messages[errorCode] || '音频加载失败'
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00'
  const wholeSeconds = Math.floor(seconds)
  const minutes = Math.floor(wholeSeconds / 60)
  const remainder = wholeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

onMounted(() => {
  readPreferences()
  applyPreferences()
})

onBeforeUnmount(() => {
  audioRef.value?.pause()
})
</script>

<style scoped>
.music-player {
  position: fixed;
  bottom: max(14px, env(safe-area-inset-bottom));
  left: clamp(12px, 2.4vw, 36px);
  z-index: 80;
  display: grid;
  width: min(360px, calc(100vw - 24px));
  gap: 8px;
  padding: 10px 12px 9px;
  border-top: 1px solid var(--line-strong, rgba(24, 26, 28, 0.34));
  border-bottom: 1px solid var(--line, rgba(24, 26, 28, 0.16));
  background: rgba(228, 229, 228, 0.94);
  color: var(--ink, #181a1c);
  box-shadow: 0 12px 36px rgba(24, 26, 28, 0.1);
  backdrop-filter: blur(12px);
}

.music-player audio {
  display: none;
}

.player-primary {
  display: grid;
  min-width: 0;
  grid-template-columns: 44px minmax(0, 1fr) 18px;
  gap: 10px;
  align-items: center;
}

.play-button,
.mute-button {
  border: 0;
  background: transparent;
  color: inherit;
  font-family: var(--font-sans, 'Manrope', sans-serif);
  font-weight: 800;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.play-button {
  width: 44px;
  height: 36px;
  padding: 0;
  border-right: 1px solid var(--line-strong, rgba(24, 26, 28, 0.34));
  font-size: 8px;
  text-align: left;
}

.play-button:hover,
.mute-button:hover {
  color: #000;
}

.track-copy {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.track-copy p,
.player-status {
  margin: 0;
  color: var(--muted, #5f6263);
  font-family: var(--font-sans, 'Manrope', sans-serif);
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.11em;
  line-height: 1.25;
}

.track-copy strong,
.track-copy span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-copy strong {
  font-family: var(--font-serif, 'Fraunces', serif);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
}

.track-copy span {
  color: var(--muted, #5f6263);
  font-size: 8px;
}

.level-meter {
  display: flex;
  height: 18px;
  gap: 2px;
  align-items: end;
}

.level-meter i {
  width: 2px;
  height: 28%;
  background: currentColor;
  transform-origin: 50% 100%;
}

.music-player.is-playing .level-meter i {
  animation: level-shift 820ms ease-in-out infinite alternate;
}

.music-player.is-playing .level-meter i:nth-child(2) { animation-delay: -420ms; }
.music-player.is-playing .level-meter i:nth-child(3) { animation-delay: -180ms; }
.music-player.is-playing .level-meter i:nth-child(4) { animation-delay: -610ms; }

.player-controls {
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(70px, 1fr) auto auto 66px;
  gap: 8px;
  align-items: center;
  padding-top: 7px;
  border-top: 1px solid var(--line, rgba(24, 26, 28, 0.16));
}

.range-control {
  display: grid;
  min-width: 0;
  align-items: center;
}

.range-control input {
  width: 100%;
  height: 14px;
  margin: 0;
  padding: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.range-control input::-webkit-slider-runnable-track {
  height: 1px;
  background: linear-gradient(
    90deg,
    currentColor var(--range-progress),
    rgba(24, 26, 28, 0.22) var(--range-progress)
  );
}

.range-control input::-moz-range-track {
  height: 1px;
  background: rgba(24, 26, 28, 0.22);
}

.range-control input::-moz-range-progress {
  height: 1px;
  background: currentColor;
}

.range-control input::-webkit-slider-thumb {
  width: 7px;
  height: 7px;
  margin-top: -3px;
  appearance: none;
  border: 1px solid currentColor;
  border-radius: 50%;
  background: #e4e5e4;
}

.range-control input::-moz-range-thumb {
  width: 7px;
  height: 7px;
  border: 1px solid currentColor;
  border-radius: 50%;
  background: #e4e5e4;
}

.range-control input:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.range-control input:focus-visible,
.play-button:focus-visible,
.mute-button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

.time-copy {
  color: var(--muted, #5f6263);
  font: 700 7px/1 var(--font-sans, 'Manrope', sans-serif);
  white-space: nowrap;
}

.mute-button {
  padding: 3px 0;
  font-size: 7px;
}

.player-status {
  min-height: 9px;
}

.player-status.is-error {
  color: #9e2e3f;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes level-shift {
  0% { height: 25%; }
  45% { height: 100%; }
  100% { height: 48%; }
}

@media (max-width: 760px) {
  .music-player {
    right: 8px;
    bottom: max(8px, env(safe-area-inset-bottom));
    left: 8px;
    width: auto;
    padding: 8px 10px;
  }

  .player-primary {
    grid-template-columns: 38px minmax(0, 1fr) 16px;
    gap: 8px;
  }

  .play-button {
    width: 38px;
    height: 32px;
  }

  .player-controls {
    grid-template-columns: minmax(58px, 1fr) auto auto 54px;
    gap: 6px;
  }

  .track-copy strong { font-size: 11px; }
}

@media (prefers-reduced-motion: reduce) {
  .music-player.is-playing .level-meter i {
    height: 58%;
    animation: none;
  }
}
</style>
