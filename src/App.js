
import { useCallback, useMemo, useRef, useState } from 'react'
import Panel from './Panel'
import Intro from './Intro'
import { ATTACKS, DECOYS } from './data.js'

const PANEL_COUNT = 3

function shuffle(array) {
  const result = [...array]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

function distribute(items) {
  const panels = Array.from({ length: PANEL_COUNT }, () => [])

  items.forEach((item, index) => {
    panels[index % PANEL_COUNT].push(item)
  })

  return panels
}

function createAllChips() {
  const attackChips = ATTACKS.map((attack) => ({
    key: `attack-${attack.id}`,
    id: String(attack.id),
    title: attack.title,
  }))

  const decoyChips = DECOYS.flat().map((title, index) => ({
    key: `decoy-${index}`,
    id: null,
    title,
  }))

  return [...attackChips, ...decoyChips]
}

export default function App() {
  const [phase, setPhase] = useState('intro')
  const [gameKey, setGameKey] = useState(0)
  const [completedIds, setCompletedIds] = useState([])
  const [startVersion, setStartVersion] = useState(0)

  const completedRef = useRef(new Set())
  const startTimer = useRef(null)

  // מערבבים את כל התמונות והשבבים לפני החלוקה למסכים.
  const game = useMemo(() => {
    const shuffledImages = shuffle(ATTACKS)
    const shuffledChips = shuffle(createAllChips())

    return {
      imagesByPanel: distribute(shuffledImages),
      chipsByPanel: distribute(shuffledChips),
    }
  }, [gameKey])

  const start = useCallback(() => {
    if (startTimer.current) {
      clearTimeout(startTimer.current)
    }

    completedRef.current = new Set()
    setCompletedIds([])
    setGameKey((key) => key + 1)
    setPhase('leaving')
    setStartVersion((version) => version + 1)
  }, [])

  // מעבר מסך הפתיחה למשחק.
  useMemo(() => {
    if (phase !== 'leaving') return

    const version = startVersion

    startTimer.current = setTimeout(() => {
      setPhase((current) =>
        current === 'leaving' ? 'play' : current
      )
    }, 500)

    return () => {
      if (startTimer.current) {
        clearTimeout(startTimer.current)
      }
    }
  }, [phase, startVersion])

  const handleMatch = useCallback((id) => {
    const normalizedId = String(id)

    if (completedRef.current.has(normalizedId)) return

    completedRef.current.add(normalizedId)

    setCompletedIds((previous) =>
      previous.includes(normalizedId)
        ? previous
        : [...previous, normalizedId]
    )
  }, [])

  const restart = useCallback(() => {
    if (startTimer.current) {
      clearTimeout(startTimer.current)
    }

    completedRef.current = new Set()
    setCompletedIds([])
    setGameKey((key) => key + 1)
    setPhase('intro')
  }, [])

  const victory =
    ATTACKS.length > 0 &&
    completedIds.length === ATTACKS.length

  return (
    <>
      <main className="stage">
        {game.imagesByPanel.map((items, index) => (
          <Panel
            key={`${gameKey}-${index}`}
            index={index}
            items={items}
            chips={game.chipsByPanel[index]}
            completedIds={completedIds}
            onMatch={handleMatch}
          />
        ))}
      </main>

      {phase !== 'play' && (
        <Intro
          leaving={phase === 'leaving'}
          onStart={start}
        />
      )}

      {victory && phase === 'play' && (
        <div className="success-modal">
          <div
            className="confetti-container"
            aria-hidden="true"
          >
            {Array.from({ length: 100 }, (_, i) => (
              <i
                key={i}
                className="confetti"
                style={{
                  left: `${(i * 37) % 100}%`,
                  animationDelay: `${(i % 12) * 0.12}s`,
                  animationDuration: `${2 + (i % 5) * 0.4}s`,
                }}
              />
            ))}
          </div>

          <div
            className="success-dialog"
            role="dialog"
            aria-modal="true"
          >
            <div className="success-emoji">🎉</div>
            <h2>כל הכבוד!</h2>
            <p>השלמתם בהצלחה את כל ההתאמות במשחק!</p>
            <button onClick={restart}>
              לשחק שוב 🔄
            </button>
          </div>
        </div>
      )}
    </>
  )
}
