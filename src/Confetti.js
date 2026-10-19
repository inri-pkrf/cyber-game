import { useEffect, useRef } from 'react'
import { playWin } from './sound'

// קונפטי על כל שלושת המסכים כשמצליחים את כל ההתאמות. הצבעים תואמים לערכת הצבעים (ירוק, סגול, לבן ואפור).
const COLORS = ['#2ff2a2', '#6dffc3', '#a66bff', '#c9a8ff', '#eceef4', '#5a6072']
const RAIN_SECONDS = 7

export default function Confetti() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d')
    const W = (cv.width = window.innerWidth), H = (cv.height = window.innerHeight)
    const u = H / 100 // יחידה אחת = 1vh, כדי שהגדלים יתאימו למסך
    const rnd = (a, b) => a + Math.random() * (b - a)
    const parts = []
    const add = (x, y, vx, vy) => parts.push({
      x, y, vx, vy, w: rnd(0.8, 1.6) * u, h: rnd(1.4, 2.8) * u, rot: rnd(0, 6.28), vr: rnd(-8, 8), ph: rnd(0, 6.28), vp: rnd(4, 9),
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    })

    // פיצוץ ראשוני: מהתחתית של כל אחד משלושת המסכים
    for (let s = 0; s < 3; s++) {
      for (let i = 0; i < 90; i++) {
        const a = rnd(-2.5, -0.64) // זווית כלפי מעלה, לשני הצדדים
        const sp = rnd(45, 110) * u
        add(W * (s + 0.5) / 3 + rnd(-6, 6) * u, H + 2 * u, Math.cos(a) * sp * 0.7, Math.sin(a) * sp)
      }
    }

    let last = performance.now(), start = last, raf, carry = 0
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      const t = (now - start) / 1000
      if (t < RAIN_SECONDS) { // גשם קונפטי מכל רוחב המסך
        carry += 70 * dt
        while (carry >= 1) { carry--; add(rnd(0, W), -2 * u, rnd(-6, 6) * u, rnd(8, 22) * u) }
      }
      ctx.clearRect(0, 0, W, H)
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.vy += 55 * u * dt                       // כוח משיכה
        p.vx *= 1 - 0.9 * dt                      // התנגדות אוויר
        if (p.vy > 30 * u) p.vy -= (p.vy - 30 * u) * 4 * dt // מהירות נפילה מרבית
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.ph += p.vp * dt
        if (p.y > H + 4 * u) { parts.splice(i, 1); continue }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.cos(p.ph)) // היפוך כמו נייר שמתהפך באוויר
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore()
      }
      if (t < RAIN_SECONDS || parts.length) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    const snd = setTimeout(playWin, 350)
    return () => { cancelAnimationFrame(raf); clearTimeout(snd) }
  }, [])
  return <canvas ref={ref} className="confetti" />
}
