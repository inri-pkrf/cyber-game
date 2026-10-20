import { useMemo, useState } from 'react'
import { ATTACKS } from './data.js'
import { tagsFor } from './impacts.js'
import Confetti from './Confetti.js'

// המתקפה "פריצה למצלמות" (id: cameras) לא משתתפת בחלק הזה. כדי להחזיר אותה מוחקים את הסינון.
const TOPICS = ATTACKS.filter((attack) => attack.id !== 'cameras')

// 12 תגיות בכל מתקפה (שתיים לכל מכלול), שש בכל מסך צדדי. התוכן נמצא ב-impacts.js.
// כדי שהתגיות יהיו מפוזרות בגבהים ובגדלים שונים (וגם מי שמסתיר חלק מהמסך יראה תגיות למעלה),
// לכל מקום יש גודל כתב, רוחב מרבי ויישור משלו. במסך השני מתחילים מאמצע הרשימה כדי שהצדדים לא יהיו זהים.
const SLOTS = [
  { fs: 3.2, mw: 80, as: 'flex-start', mt: 0 },
  { fs: 2.6, mw: 64, as: 'flex-end', mt: 1 },
  { fs: 3.0, mw: 74, as: 'center', mt: 0.5 },
  { fs: 2.5, mw: 60, as: 'flex-start', mt: 1.2 },
  { fs: 3.1, mw: 78, as: 'flex-end', mt: 0 },
  { fs: 2.7, mw: 68, as: 'center', mt: 0.8 },
]

function TagColumn({ tags, side, topic }) {
  return (
    <section className="panel meaning-side meaning-tag-panel">
      <header><h2>השפעות אפשריות</h2></header>
      <div className="impact-tags">
        {tags.map((t, i) => {
          const s = SLOTS[(i + side * 3) % SLOTS.length]
          return (
            <div className="impact-tag" key={`${topic}-${side}-${i}`}
              style={{ '--fs': `${s.fs}vh`, '--mw': `${s.mw}%`, '--as': s.as, '--mt': `${s.mt}vh`, animationDelay: `${(i * 2 + side) * 90}ms` }}>
              <b className="mk">{t.mk}</b>
              <span>{t.text}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function MeaningGame({ onAgain, forceFinish = false }) {
  const topics = useMemo(() => TOPICS, [])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const current = topics[index]
  const finished = forceFinish || index >= topics.length

  function advance() {
    if (!revealed) setRevealed(true)
    else { setIndex((n) => n + 1); setRevealed(false) }
  }

  if (finished) return <>
    <main className="stage meaning-stage meaning-learning">
      <section className="panel meaning-side empty-side" />
      <section className="panel meaning-center meaning-finish">
        <h1 className="meaning-title">ומה המשמעויות?</h1>
        <div className="meaning-score">סיימנו לעבור על {topics.length} מתקפות</div>
        <p className="meaning-finish-message">אילו השפעות נוספות זיהיתם במהלך הפעילות?</p>
        <button className="go" onClick={onAgain}>חזרה להתחלה</button>
      </section>
      <section className="panel meaning-side empty-side" />
    </main>
    <Confetti />
  </>

  const [sideA, sideB] = revealed ? tagsFor(current.id) : [[], []]

  return <main className="stage meaning-stage meaning-learning">
    <TagColumn tags={sideA} side={0} topic={index} />
    <section className="panel meaning-center meaning-learning-center">
      <h1 className="meaning-title">ומה המשמעויות?</h1>
      <h2 className="impact-topic-title">{current.title}</h2>
      <div className="meaning-image-wrap"><img src={current.image} alt={current.title} /></div>
      <p className="meaning-discussion">אילו השפעות לדעתכם יכולה המתקפה ליצור על התושבים ועל תפקוד הרשות בחירום?</p>
      <div className="learning-controls">
        <span className="meaning-step">מתקפה {index + 1} מתוך {topics.length}</span>
        <button className="go" onClick={advance}>{revealed ? (index === topics.length - 1 ? 'סיום הפעילות' : 'למתקפה הבאה') : 'חשיפת כל ההשפעות'}</button>
      </div>
      <div className="learning-progress"><i style={{ width: `${((index + (revealed ? 1 : 0)) / topics.length) * 100}%` }} /></div>
    </section>
    <TagColumn tags={sideB} side={1} topic={index} />
  </main>
}
