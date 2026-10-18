
import { useRef, useState } from 'react'
import Chip from './Chip'

function getImage(item) {
  return item.image ?? item.img ?? item.imageUrl ?? ''
}

function getDescription(item) {
  return item.text ?? item.description ?? item.info ?? ''
}

// חיפוש אזור הנחיתה בכל שלושת המסכים.
function getZoneAtPoint(x, y) {
  if (typeof document === 'undefined') return null

  const elements = document.querySelectorAll('[data-zone]')

  for (const element of elements) {
    const rect = element.getBoundingClientRect()

    if (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    ) {
      return element.dataset.zone
    }
  }

  return null
}

export default function Panel({
  index,
  items,
  chips,
  completedIds,
  onMatch,
}) {
  const [open, setOpen] = useState(null)
  const [hot, setHot] = useState(null)
  const [no, setNo] = useState(null)

  const handledRef = useRef(new Set())
  const completedSet = new Set(completedIds)

  const current = items.find(
    (item) => String(item.id) === String(open)
  )

  function handleMove(x, y) {
    const zone = getZoneAtPoint(x, y)
    setHot(zone)
  }

  function handleDrop(chip, x, y) {
    const zone = getZoneAtPoint(x, y)

    setHot(null)
    setNo(null)

    if (!zone) return

    const normalizedZone = String(zone)

    // התאמה שכבר הושלמה אינה נספרת שוב.
    if (completedSet.has(normalizedZone)) return

    const correct =
      chip.id !== null &&
      chip.id !== undefined &&
      String(chip.id) === normalizedZone

    if (correct) {
      if (handledRef.current.has(normalizedZone)) return

      handledRef.current.add(normalizedZone)
      onMatch(normalizedZone)
      setOpen(normalizedZone)
    } else {
      setNo(normalizedZone)

      setTimeout(() => {
        setNo(null)
      }, 450)
    }
  }

  const completedHere = items.filter((item) =>
    completedSet.has(String(item.id))
  ).length

  return (
    <section className="panel">
      <header className="header">
        <h2>חלק {index + 1}</h2>

        <div className="dots">
          {items.map((item) => (
            <span
              key={item.id}
              className={
                completedSet.has(String(item.id))
                  ? 'dot done'
                  : 'dot'
              }
            />
          ))}
        </div>
      </header>

      <div className="hud">
        הושלמו {completedHere} מתוך {items.length} בחלק הזה
      </div>

      <div className="zones">
        {items.map((item) => {
          const id = String(item.id)
          const done = completedSet.has(id)

          return (
            <div
              key={item.id}
              className={[
                'zone',
                done ? 'done' : '',
                hot === id ? 'hot' : '',
                no === id ? 'wrong' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              data-zone={id}
            >
              <div className="shot">
                {getImage(item) ? (
                  <img
                    src={getImage(item)}
                    alt={item.title}
                    draggable={false}
                  />
                ) : (
                  <div className="pic">{item.title}</div>
                )}
              </div>

              <div className="slot">
                {done
                  ? '✓ הותאם בהצלחה'
                  : 'גררו לכאן את השבב המתאים'}
              </div>
            </div>
          )
        })}
      </div>

      <div className="tray">
        {chips.map((chip) => (
          <Chip
            key={chip.key}
            label={chip.title}
            disabled={Boolean(open)}
            onMove={handleMove}
            onDrop={(x, y) => handleDrop(chip, x, y)}
          />
        ))}
      </div>

      {current && (
        <div className="modal">
          <div className="dlg" role="dialog" aria-modal="true">
            {getImage(current) && (
              <img
                className="pic"
                src={getImage(current)}
                alt={current.title}
                draggable={false}
              />
            )}

            <div className="bd">
              <h3>{current.title}</h3>
              <p>{getDescription(current)}</p>

              <button onClick={() => setOpen(null)}>
                המשך
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
