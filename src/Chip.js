import { useRef, useState } from 'react'

// כרטיס שם מתקפה שגוררים באצבע. אחרי שחררו, onDrop מחליט אם ההתאמה נכונה.
export default function Chip({ label, disabled, onMove, onDrop }) {
  const [s, setS] = useState(null)
  const st = useRef({ id: null, x: 0, y: 0 })

  const down = (e) => {
    if (disabled || st.current.id !== null) return
    st.current = { id: e.pointerId, x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
    setS({ dx: 0, dy: 0 })
  }
  const move = (e) => {
    if (e.pointerId !== st.current.id) return
    setS({ dx: e.clientX - st.current.x, dy: e.clientY - st.current.y })
    onMove(e.clientX, e.clientY)
  }
  const up = (e) => {
    if (e.pointerId !== st.current.id) return
    st.current.id = null
    onDrop(e.clientX, e.clientY)
    setS(null)
  }

  return (
    <div
      className={'chip' + (s ? ' drag' : '')}
      style={s ? { transform: `translate(${s.dx}px, ${s.dy}px) scale(1.05)` } : undefined}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
    >
      <i className="grip" />{label}
    </div>
  )
}
