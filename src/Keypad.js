import { useState } from 'react'

// מקלדת מספרים: מקלידים את מספר התמונה ומאשרים
export default function Keypad({ title, onSubmit, onCancel, error }) {
  const [v, setV] = useState('')
  const add = (d) => setV((x) => (x.length < 3 ? x + d : x))
  const submit = () => { if (v) { onSubmit(Number(v)); setV('') } }
  return (
    <div className="modal" onPointerDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={'pad' + (error ? ' bad' : '')} key={error} role="dialog">
        <p className="q">לאיזו תמונה מתאים</p>
        <h3>{title}</h3>
        <div className="disp" dir="ltr">{v || <span>מספר</span>}</div>
        <p className="err">{error ? 'לא מתאים, נסו שוב' : ' '}</p>
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
