
import { useRef, useState } from 'react'

export default function Chip({ label, disabled, onMove, onDrop }) {
  const [drag, setDrag] = useState(null)
  const pointer = useRef(null)

  function down(e) {
    if (disabled || pointer.current !== null) return

    pointer.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      element: e.currentTarget,
    }

    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ dx: 0, dy: 0 })
  }

  function move(e) {
    if (!pointer.current || e.pointerId !== pointer.current.id) return

    const { x, y } = pointer.current

    setDrag({
      dx: e.clientX - x,
      dy: e.clientY - y,
    })

    onMove?.(e.clientX, e.clientY)
  }

  function up(e) {
    if (!pointer.current || e.pointerId !== pointer.current.id) return

    const { element } = pointer.current
    const x = e.clientX
    const y = e.clientY

    pointer.current = null

    if (element.hasPointerCapture?.(e.pointerId)) {
      element.releasePointerCapture(e.pointerId)
    }

    onDrop?.(x, y)
    setDrag(null)
  }

  return (
    <div
      className={'chip' + (drag ? ' drag' : '')}
      style={
        drag
          ? {
              transform: `translate(${drag.dx}px, ${drag.dy}px) scale(1.05)`,
              position: 'relative',
              zIndex: 1000,
              touchAction: 'none',
            }
          : { touchAction: 'none' }
      }
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <i className="grip" />
      {label}
    </div>
  )
}
