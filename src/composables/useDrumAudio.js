let audioCtx = null

function ctx() {
  if (!audioCtx) {
    const C = window.AudioContext || window.webkitAudioContext
    if (!C) return null
    audioCtx = new C()
  }
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

export function useDrumAudio() {
  function play(sound) {
    const ac = ctx()
    if (!ac) return
    const t = ac.currentTime

    if (sound === 'kick') {
      const o = ac.createOscillator()
      const g = ac.createGain()
      o.type = 'sine'
      o.frequency.setValueAtTime(120, t)
      o.frequency.exponentialRampToValueAtTime(42, t + 0.16)
      g.gain.setValueAtTime(0.9, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
      o.connect(g).connect(ac.destination)
      o.start(t); o.stop(t + 0.24)
      return
    }

    const size = ac.sampleRate * (sound === 'crash' ? 0.42 : 0.16)
    const buf = ac.createBuffer(1, size, ac.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < size; i++) d[i] = Math.random() * 2 - 1

    const n = ac.createBufferSource()
    const f = ac.createBiquadFilter()
    const g = ac.createGain()
    n.buffer = buf
    f.type = sound === 'snare' ? 'bandpass' : 'highpass'
    f.frequency.setValueAtTime(sound === 'snare' ? 1850 : 7200, t)
    g.gain.setValueAtTime(sound === 'crash' ? 0.42 : 0.34, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + (sound === 'crash' ? 0.48 : 0.12))
    n.connect(f).connect(g).connect(ac.destination)
    n.start(t); n.stop(t + (sound === 'crash' ? 0.5 : 0.14))
  }

  return { play }
}
