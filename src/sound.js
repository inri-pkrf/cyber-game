// צלילים שנוצרים בקוד (בלי קבצי שמע). הדפדפן מתיר שמע רק אחרי נגיעה ראשונה במסך, לכן unlock נקרא בנגיעה הראשונה.
let ctx = null
const ac = () => {
  try {
    if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (C) ctx = new C() }
    return ctx
  } catch { return null }
}
export const unlock = () => { const c = ac(); if (c && c.state === 'suspended') c.resume().catch(() => {}) }

const tone = (c, freq, start, dur, type, vol) => {
  const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + start
  o.type = type; o.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.05)
}

// תשובה נכונה: שלושה צלילים עולים ועליזים
export const playCorrect = () => {
  const c = ac(); if (!c) return
  tone(c, 523.25, 0, 0.18, 'sine', 0.3); tone(c, 659.25, 0.13, 0.18, 'sine', 0.3); tone(c, 1046.5, 0.26, 0.45, 'sine', 0.3)
}
// תשובה שגויה: זמזום נמוך יורד
export const playWrong = () => {
  const c = ac(); if (!c) return
  tone(c, 220, 0, 0.2, 'sawtooth', 0.18); tone(c, 150, 0.18, 0.4, 'sawtooth', 0.18)
}

// ניצחון (מופעל עם הקונפטי): ארפג'יו עולה ואחריו אקורד מלא
export const playWin = () => {
  const c = ac(); if (!c) return
  ;[523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(c, f, i * 0.11, 0.35, 'triangle', 0.22))
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f) => tone(c, f, 0.6, 1.0, 'sine', 0.12))
}
