import { useState } from 'react'
import Panel from './Panel'
import Intro from './Intro'

// שלושה חלקים במסך. כדי לשנות את מספר החלקים עדכנו גם את grid-template-columns ב-styles.css
export default function App() {
  const [phase, setPhase] = useState('intro') // intro -> leaving -> play
  const start = () => { setPhase('leaving'); setTimeout(() => setPhase('play'), 500) }
  return (
    <>
      <main className="stage">
        {[0, 1, 2].map((i) => <Panel key={i} index={i} />)}
      </main>
      {phase !== 'play' && <Intro leaving={phase === 'leaving'} onStart={start} />}
    </>
  )
}
