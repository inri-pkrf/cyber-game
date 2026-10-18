
import { useState } from 'react'
import Panel from './Panel'
import Intro from './Intro'

export default function App() {
  const [phase, setPhase] = useState('intro')
  const [gameKey, setGameKey] = useState(0)

  const start = () => {
    setGameKey((key) => key + 1)
    setPhase('leaving')
    setTimeout(() => setPhase('play'), 500)
  }

  return (
    <>
      <main className="stage">
        {[0, 1, 2].map((i) => (
          <Panel key={`${gameKey}-${i}`} index={i} />
        ))}
      </main>

      {phase !== 'play' && (
        <Intro
          leaving={phase === 'leaving'}
          onStart={start}
        />
      )}
    </>
  )
}
