import { useRef, useState } from 'react'
import { ATTACKS, DECOYS } from './data.js'
import Chip from './Chip'

const shuffle = (a) => {
  a = [...a]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

export default function Panel({ index }) {
  const items = ATTACKS.filter((a) => a.panel === index)
  const [chips] = useState(() => shuffle([
    ...items.map((a) => ({ key: a.id, id: a.id, title: a.title })),
    ...DECOYS[index].map((t, i) => ({ key: 'd' + i, id: null, title: t })),
  ]))
  const [done, setDone] = useState([])
  const [open, setOpen] = useState(null)
  const [hot, setHot] = useState(null)
  const [no, setNo] = useState(null)
  const ref = useRef(null)

  // מוצא את הכרטיס הקרוב לאצבע (עם שוליים נדיבים כדי שגרירה לא מדויקת תתפוס)
  const findZone = (x, y) => {
    const m = window.innerHeight * 0.03
    let best = null, bd = Infinity
    ref.current.querySelectorAll('[data-zone]:not([data-done])').forEach((z) => {
      const r = z.getBoundingClientRect()
      if (x > r.left - m && x < r.right + m && y > r.top - m && y < r.bottom + m) {
        const d = Math.hypot(x - (r.left + r.right) / 2, y - (r.top + r.bottom) / 2)
        if (d < bd) { bd = d; best = z.dataset.zone }
      }
    })
    return best
  }
  const drop = (chip, x, y) => {
    const z = findZone(x, y)
    setHot(null)
    if (z && chip.id === z) {
      setDone((d) => [...d, z])
      setTimeout(() => setOpen(z), 450)
    } else if (z) {
      setNo(z); setTimeout(() => setNo(null), 450)
    }
  }

  const finished = done.length === items.length && !open
  const current = ATTACKS.find((a) => a.id === open)

  return (
    <section className="panel" ref={ref}>
      <header>
        <h2>גררו כל שם מתקפה אל המקום שמתחת לתמונה</h2>
        <div className="dots">{items.map((a) => <b key={a.id} className={done.includes(a.id) ? 'on' : ''} />)}</div>
      </header>

      <div className="zones">
        {items.map((a) => {
          const d = done.includes(a.id)
          return (
            <div key={a.id} data-zone={a.id} data-done={d || undefined}
              className={'zone' + (d ? ' done' : '') + (hot === a.id ? ' hot' : '') + (no === a.id ? ' no' : '')}>
              <div className="shot"><img src={a.image} alt="" draggable={false} /><i className="hud" /></div>
              <div className="slot">{d ? a.title : <small>גררו לכאן את שם המתקפה</small>}</div>
            </div>
          )
        })}
      </div>

      <footer className="tray">
        {finished
          ? <p className="fin">כל המתקפות בחלק זה זוהו</p>
          : chips.filter((c) => !c.id || !done.includes(c.id)).map((c) => (
              <Chip key={c.key} label={c.title} disabled={!!open}
                onMove={(x, y) => setHot(findZone(x, y))} onDrop={(x, y) => drop(c, x, y)} />
            ))}
      </footer>

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
