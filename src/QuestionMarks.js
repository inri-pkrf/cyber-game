// סימני שאלה לבנים מפוזרים על שלושת המסכים (למסך "ומה המשמעויות?").
// המיקומים נקבעים פעם אחת בצורה קבועה (לא אקראית בכל טעינה), ומוסטים מאזור הכותרת והכפתור שבאמצע.
const mulberry = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

const STAGE_RATIO = 48 / 9 // רוחב כל שלושת המסכים ביחס לגובה
const COUNT = 46

const MARKS = (() => {
  const rnd = mulberry(20261019), out = []
  for (let tries = 0; out.length < COUNT && tries < 6000; tries++) {
    const size = 7 + Math.pow(rnd(), 1.6) * 26          // גובה בסיס הכתב ב-vh: הרבה קטנים וכמה גדולים
    const x = 2 + rnd() * 96, y = 4 + rnd() * 92         // אחוזים מהמסך
    if (x > 35 && x < 65 && y > 26 && y < 76) continue    // מרכז המסך האמצעי: כותרת וכפתור
    const xv = x * STAGE_RATIO                            // x ביחידות vh, למדידת מרחקים אמיתית
    if (out.some((m) => Math.hypot(m.x * STAGE_RATIO - xv, m.y - y) < (m.size + size) * 0.5)) continue
    out.push({ x, y, size, rot: -28 + rnd() * 56, o: 0.2 + rnd() * 0.6, dur: 6 + rnd() * 6, delay: -rnd() * 8 })
  }
  return out
})()

export default function QuestionMarks() {
  return (
    <div className="qm-layer" aria-hidden="true">
      {MARKS.map((m, i) => (
        <span key={i} className="qm" style={{ left: `${m.x}%`, top: `${m.y}%`, '--s': `${m.size}vh`, '--r': `${m.rot}deg`, '--o': m.o, '--d': `${m.dur}s`, '--dl': `${m.delay}s` }}>?</span>
      ))}
    </div>
  )
}
