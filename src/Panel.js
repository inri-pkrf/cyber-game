
import { useRef, useState, useEffect } from 'react'
import { ATTACKS, DECOYS } from './data.js'
import Chip from './Chip'

const shuffle = (array) => {
  const result = [...array]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

const createChips = (items, index) =>
  shuffle([
    ...items.map((a) => ({
      key: a.id,
      id: a.id,
      title: a.title,
    })),
    ...DECOYS[index].map((title, i) => ({
      key: `d${i}`,
      id: null,
      title,
    })),
  ])

export default function Panel({ index, onComplete }) {
  const items = ATTACKS.filter((a) => a.panel === index)

  const [gameItems, setGameItems] = useState(() => shuffle(items))
  const [chips, setChips] = useState(() => createChips(items, index))
  const [done, setDone] = useState([])
  const [open, setOpen] = useState(null)
  const [hot, setHot] = useState(null)
  const [no, setNo] = useState(null)

  const ref = useRef(null)
  const reported = useRef(false)

  const restartGame = () => {
    setGameItems(shuffle(items))
    setChips(createChips(items, index))
    setDone([])
    setOpen(null)
    setHot(null)
    setNo(null)
    reported.current = false
  }

  const findZone = (x, y) => {
    if (!ref.current) return null

    const margin = window.innerHeight * 0.03
    let best = null
    let bestDistance = Infinity

    ref.current
      .querySelectorAll('[data-zone]:not([data-done])')
      .forEach((zone) => {
        const rect = zone.getBoundingClientRect()

        if (
          x > rect.left - margin &&
          x < rect.right + margin &&
          y > rect.top - margin &&
          y < rect.bottom + margin
        ) {
          const distance = Math.hypot(
            x - (rect.left + rect.right) / 2,
            y - (rect.top + rect.bottom) / 2
          )

          if (distance < bestDistance) {
            bestDistance = distance
            best = zone.dataset.zone
          }
        }
      })

    return best
  }

  const drop = (chip, x, y) => {
    const zone = findZone(x, y)
    setHot(null)

    if (zone && chip.id === zone) {
      setDone((previous) =>
        previous.includes(zone) ? previous : [...previous, zone]
      )

      setTimeout(() => setOpen(zone), 450)
    } else if (zone) {
      setNo(zone)
      setTimeout(() => setNo(null), 450)
    }
  }

  const finished = items.length > 0 && done.length === items.length && !open
  const current = ATTACKS.find((a) => a.id === open)

  useEffect(() => {
    if (finished && !reported.current) {
      reported.current = true
      onComplete(index)
    }
  }, [finished, index, onComplete])

  return (
    <section className="panel" ref={ref}>
      <header>
        <h2>גררו כל שם מתקפה אל המקום שמתחת לתמונה</h2>

        <div className="dots">
          {gameItems.map((a) => (
            <b
              key={a.id}
              className={done.includes(a.id) ? 'on' : ''}
            />
          ))}
        </div>
      </header>

      <div className="zones">
        {gameItems.map((a) => {
          const isDone = done.includes(a.id)

          return (
            <div
              key={a.id}
              data-zone={a.id}
              data-done={isDone || undefined}
              className={
                'zone' +
                (isDone ? ' done' : '') +
                (hot === a.id ? ' hot' : '') +
                (no === a.id ? ' no' : '')
              }
            >
              <div className="shot">
                <img src={a.image} alt="" draggable={false} />
                <i className="hud" />
              </div>

              <div className="slot">
                {isDone ? a.title : <small>גררו לכאן את שם המתקפה</small>}
              </div>
            </div>
          )
        })}
      </div>

      <footer className="tray">
        {chips
          .filter((chip) => !chip.id || !done.includes(chip.id))
          .map((chip) => (
            <Chip
              key={chip.key}
              label={chip.title}
              disabled={!!open || finished}
              onMove={(x, y) => setHot(findZone(x, y))}
              onDrop={(x, y) => drop(chip, x, y)}
            />
          ))}
      </footer>

      {current && (
        <div className="modal">
          <div className="dlg" role="dialog">
            <div
              className="pic"
              style={{ backgroundImage: `url(${current.image})` }}
            />

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
