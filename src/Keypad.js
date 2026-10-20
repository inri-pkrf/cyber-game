import { useState } from 'react'

// מקלדת מספרים קטנה שנפתחת בצד הכרטיס שנלחץ (at = המיקום של הכרטיס בתוך המסך השמאלי)
export default function Keypad({ title, at, onSubmit, onCancel, error }) {
  const [v, setV] = useState('')
  const add = (d) => setV((x) => (x.length < 3 ? x + d : x))
  const submit = () => { if (v) { onSubmit(Number(v)); setV('') } }

  // מיקום: ליד הכרטיס, בצד שבו יש יותר מקום, וצמוד לגבולות המסך
  const vh = window.innerHeight
  const pw = vh * 0.27, ph = vh * 0.6, gap = vh * 0.015, m = vh * 0.02
  let left = at.l + at.w / 2 < at.pw / 2 ? at.l + at.w + gap : at.l - gap - pw
  left = Math.max(m, Math.min(at.pw - pw - m, left))
  const top = Math.max(m, Math.min(at.ph - ph - m, at.t + at.h / 2 - ph / 2))

  return (
    <div className="pop" onPointerDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={'pad' + (error ? ' bad' : '')} key={error} role="dialog" style={{ left, top }}>
        <p className="q">מספר התמונה של</p>
        <h3>{title}</h3>
        <div className="disp" dir="ltr">{v || <span>מספר</span>}</div>
        <p className="err">{error ? 'לא מתאים, נסו שוב' : ' '}</p>
        <div className="keys" dir="ltr">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => <button key={d} onClick={() => add(String(d))}>{d}</button>)}
          <button className="alt" onClick={() => setV((x) => x.slice(0, -1))} aria-label="מחיקה">⌫</button>
          <button onClick={() => add('0')}>0</button>
          <button className="go2" onClick={submit} disabled={!v} aria-label="אישור">✓</button>
        </div>
        <button className="cancel" onClick={onCancel}>ביטול</button>
      </div>
    </div>
  )
}
