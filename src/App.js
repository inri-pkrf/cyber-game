import { useEffect, useState } from 'react'
import { ATTACKS } from './data.js'
import Gallery from './Gallery.js'
import Info from './Info.js'
import Titles from './Titles.js'
import Intro from './Intro.js'
import { unlock } from './sound.js'
import MeaningGame from './MeaningGame.js'

const shuffle = (a) => {
  a = [...a]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

// שלושה מסכים. הדף כתוב מימין לשמאל, ולכן הראשון הוא הימני:
// ימין = תמונות ממוספרות, אמצע = הוראות ומונה, שמאל = שמות המתקפות.
export default function App() {
  const [phase, setPhase] = useState('intro') // intro -> leaving -> play -> first-finish -> meaning-intro -> meaning-play
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
  const match = (id) => setDone((d) => {
    if (d.includes(id)) return d
    const next = [...d, id]
    if (next.length === ATTACKS.length) setTimeout(() => setPhase('first-finish'), 900)
    return next
  })
  const startMeanings = () => setPhase('meaning-play')
  const goToMeaningsIntro = () => setPhase('meaning-intro')
  if (phase === 'meaning-play') return <MeaningGame onAgain={again} />
  if (phase === 'first-finish') return (
    <main className="stage meaning-stage meaning-transition">
      <section className="panel meaning-side empty-side" />
      <section className="panel meaning-center meaning-finish">
        <h1 className="meaning-title">זיהוי מתקפות סייבר</h1>
        <div className="meaning-score">כל הכבוד! 14 / 14</div>
        <div className="meaning-bar"><i style={{ width: '100%' }} /></div>
        <p className="meaning-finish-message">סיימתם את החלק הראשון!</p>
        <button className="go" onClick={goToMeaningsIntro}>לחלק הבא</button>
      </section>
      <section className="panel meaning-side empty-side" />
    </main>
  )
  if (phase === 'meaning-intro') return (
    <main className="stage meaning-stage meaning-transition">
      <section className="panel meaning-side empty-side" />
      <section className="panel meaning-center"><h1 className="meaning-title">ומה המשמעויות?</h1><button className="go" onClick={startMeanings}>התחלה</button></section>
      <section className="panel meaning-side empty-side" />
    </main>
  )
  return (
    <>
      <main className="stage">
        <Gallery order={order} done={done} numbered={phase !== 'intro'} />
        <Info done={done} onAgain={again} />
        <Titles key={game} order={order} done={done} onMatch={match} />
      </main>
      {(phase === 'intro' || phase === 'leaving') && <Intro leaving={phase === 'leaving'} onStart={start} />}
    </>
  )
}
