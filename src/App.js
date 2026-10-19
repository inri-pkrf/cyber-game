import { useEffect, useState } from 'react'
import { ATTACKS } from './data.js'
import Gallery from './Gallery'
import Info from './Info'
import Titles from './Titles'
import Intro from './Intro'
import { unlock } from './sound'

const shuffle = (a) => {
  a = [...a]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

// שלושה מסכים. הדף כתוב מימין לשמאל, ולכן הראשון הוא הימני:
// ימין = תמונות ממוספרות, אמצע = הוראות ומונה, שמאל = שמות המתקפות.
export default function App() {
  const [phase, setPhase] = useState('intro') // intro -> leaving -> play
  const [done, setDone] = useState([]) // מזהי המתקפות שהותאמו נכון
  const [order, setOrder] = useState(() => shuffle(ATTACKS)) // סדר התמונות = המספרים (מתערבב בכל משחק חדש)
  const [game, setGame] = useState(0)

  // הדפדפן מתיר שמע רק אחרי נגיעה ראשונה
  useEffect(() => {
    const f = () => unlock()
    window.addEventListener('pointerdown', f)
    return () => window.removeEventListener('pointerdown', f)
  }, [])

  const start = () => { setPhase('leaving'); setTimeout(() => setPhase('play'), 500) }
  // משחק חדש: מערבבים מחדש את מספרי התמונות ואת השמות ומאפסים את ההתאמות. (בטעינת הדף הם מתערבבים גם כן.)
  const again = () => { setOrder(shuffle(ATTACKS)); setDone([]); setGame((g) => g + 1); setPhase('intro') }
  const match = (id) => setDone((d) => (d.includes(id) ? d : [...d, id]))
  return (
    <>
      <main className="stage">
        <Gallery order={order} done={done} numbered={phase !== 'intro'} />
        <Info done={done} onAgain={again} />
        <Titles key={game} order={order} done={done} onMatch={match} />
      </main>
      {phase !== 'play' && <Intro leaving={phase === 'leaving'} onStart={start} />}
    </>
  )
}
