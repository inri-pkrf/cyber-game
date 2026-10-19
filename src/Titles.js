import { useMemo, useRef, useState } from 'react'
import { ATTACKS, DECOYS } from './data.js'
import Keypad from './Keypad'
import { playCorrect, playWrong } from './sound'

const shuffle = (a) => {
  a = [...a]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}
const HOLD_MS = 600

// כרטיס שם מתקפה. לחיצה ארוכה פותחת את המקלדת.
function Card({ label, num, disabled, onLong }) {
  const t = useRef(null)
  const o = useRef({ x: 0, y: 0 })
  const [hold, setHold] = useState(false)
  const stop = () => { clearTimeout(t.current); setHold(false) }
  const down = (e) => {
    if (disabled) return
    o.current = { x: e.clientX, y: e.clientY }
    setHold(true)
    t.current = setTimeout(() => { setHold(false); onLong() }, HOLD_MS)
  }
  const move = (e) => { if (Math.hypot(e.clientX - o.current.x, e.clientY - o.current.y) > 24) stop() }
  return (
    <div className={'card' + (disabled ? ' ok' : '') + (hold ? ' hold' : '')}
      onPointerDown={down} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop} onPointerLeave={stop}
      onContextMenu={(e) => e.preventDefault()}>
      {disabled && <b className="n">{num}</b>}
      <span>{label}</span>
    </div>
  )
}

// המסך השמאלי: כל שמות המתקפות. לחיצה ארוכה פותחת מקלדת להקלדת מספר התמונה.
export default function Titles({ order, done, onMatch }) {
  const cards = useMemo(() => shuffle([
    ...ATTACKS.map((a) => ({ key: a.id, id: a.id, title: a.title })),
    ...DECOYS.map((t, i) => ({ key: 'd' + i, id: null, title: t })),
  ]), [])
  const [pick, setPick] = useState(null) // הכרטיס שנבחר
  const [err, setErr] = useState(0) // מונה שגיאות (מפעיל את אנימציית הרעד)
  const [open, setOpen] = useState(null) // ההסבר שמוצג אחרי התאמה

  const submit = (n) => {
    if (pick.id && order.findIndex((a) => a.id === pick.id) + 1 === n) {
      playCorrect(); onMatch(pick.id); setOpen(pick.id); setPick(null); setErr(0)
    } else { playWrong(); setErr((e) => e + 1) }
  }
  const current = ATTACKS.find((a) => a.id === open)

  return (
    <section className="panel titles">
      <header><h2>שמות המתקפות</h2><span className="hint">לחיצה ארוכה על שם מתקפה פותחת מקלדת</span></header>
      <div className="cards" style={{ '--rows': Math.ceil(cards.length / 3) }}>
        {cards.map((c) => (
          <Card key={c.key} label={c.title} num={order.findIndex((a) => a.id === c.id) + 1} disabled={!!c.id && done.includes(c.id)}
            onLong={() => { setErr(0); setPick(c) }} />
        ))}
      </div>

      {pick && <Keypad key={pick.key} title={pick.title} error={err} onSubmit={submit} onCancel={() => setPick(null)} />}

      {current && (
        <div className="modal">
          <div className="dlg" role="dialog">
            <div className="pic" style={{ backgroundImage: `url(${current.image})` }} />
            <div className="bd">
              <h3>{current.title}</h3>
              <p>{current.text}</p>
              <button onClick={() => setOpen(null)}>המשך</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
