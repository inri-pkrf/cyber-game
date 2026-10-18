

import { useCallback, useState } from 'react'
import Panel from './Panel'
import Intro from './Intro'

export default function App() {
  const [phase, setPhase] = useState('intro')
  const [gameKey, setGameKey] = useState(0)
  const [completedPanels, setCompletedPanels] = useState([])

  const start = () => {
    setCompletedPanels([])
    setGameKey((key) => key + 1)
    setPhase('leaving')

    setTimeout(() => {
      setPhase('play')
    }, 500)
  }

  const handleComplete = useCallback((index) => {
    setCompletedPanels((previous) =>
      previous.includes(index) ? previous : [...previous, index]
    )
  }, [])

  const victory = completedPanels.length === 3

  const restart = () => {
    setCompletedPanels([])
    setGameKey((key) => key + 1)
    setPhase('intro')
  }

  return (
    <>
      <main className="stage">
        {[0, 1, 2].map((i) => (
          <Panel
            key={`${gameKey}-${i}`}
            index={i}
            onComplete={handleComplete}
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
          <div className="confetti-container" aria-hidden="true">
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
            <p>השלמתם בהצלחה את כל שלושת חלקי המשחק!</p>

            <button onClick={restart}>
              לשחק שוב 🔄
            </button>
          </div>
        </div>
      )}
    </>
  )
}
