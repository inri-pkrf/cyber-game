import { useMemo, useState } from 'react'
import { ATTACKS } from './data'
import { playCorrect, playWrong } from './sound'

// החלק השני: תמונה אחת במרכז ומשפטי משמעות בשני המסכים הצדדיים.
const shuffle = (a) => {
  const out = [...a]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// לא כוללים את התמונה cameras.jpg בחלק השני, בהתאם לבקשה.
const MEANINGS = ATTACKS.filter((a) => !String(a.image).toLowerCase().endsWith('/cameras.jpg'))

export default function MeaningGame({ onAgain }) {
  const questions = useMemo(() => shuffle(MEANINGS), [])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [feedback, setFeedback] = useState({ id: null, correct: false })
  const current = questions[index]
  const options = useMemo(() => shuffle(questions), [questions, index])
  const correctCount = Object.values(answers).filter(Boolean).length
  const finished = index >= questions.length

  function choose(option) {
    if (!current || answers[current.id] !== undefined) return
    const correct = option.id === current.id
    setFeedback({ id: option.id, correct })
    if (correct) {
      playCorrect()
      setAnswers((old) => ({ ...old, [current.id]: true }))
      window.setTimeout(() => { setIndex((n) => n + 1); setFeedback({ id: null, correct: false }) }, 850)
    } else {
      playWrong()
      window.setTimeout(() => setFeedback({ id: null, correct: false }), 650)
    }
  }

  if (finished) return <main className="stage meaning-stage">
    <section className="panel meaning-side empty-side" />
    <section className="panel meaning-center meaning-finish">
      <h1 className="meaning-title">ומה המשמעויות?</h1>
      <div className="meaning-score">כל הכבוד! {correctCount} / {questions.length}</div>
      <div className="meaning-bar"><i style={{ width: '100%' }} /></div>
      <button onClick={onAgain}>משחק חדש</button>
    </section>
    <section className="panel meaning-side empty-side" />
  </main>

  return <main className="stage meaning-stage">
    <section className="panel meaning-side">
      <header><h2>מה המשמעות?</h2></header>
      <div className="meaning-options">
        {options.slice(0, 7).map((option) => <button key={option.id} className={'meaning-option' + (answers[option.id] ? ' meaning-done' : '') + (feedback.id === option.id ? (feedback.correct ? ' meaning-correct' : ' meaning-wrong') : '')} disabled={!!answers[option.id]} onClick={() => choose(option)}>{option.text}</button>)}
      </div>
    </section>
    <section className="panel meaning-center">
      <h1 className="meaning-title">ומה המשמעויות?</h1>
      <div className="meaning-image-wrap"><img src={current.image} alt="תמונה להתאמה" /></div>
      <div className={'meaning-progress score' + (correctCount === questions.length ? ' all' : '')}>
        <span className="lbl">הצלחנו להתאים</span>
        <strong className="big"><span dir="ltr">{correctCount} / {questions.length}</span></strong>
        <div className="bar"><i style={{ width: `${(correctCount / questions.length) * 100}%` }} /></div>
        <span className="meaning-step">תמונה {index + 1} מתוך {questions.length}</span>
      </div>
    </section>
    <section className="panel meaning-side">
      <header><h2>מה המשמעות?</h2></header>
      <div className="meaning-options">
        {options.slice(7).map((option) => <button key={option.id} className={'meaning-option' + (answers[option.id] ? ' meaning-done' : '') + (feedback.id === option.id ? (feedback.correct ? ' meaning-correct' : ' meaning-wrong') : '')} disabled={!!answers[option.id]} onClick={() => choose(option)}>{option.text}</button>)}
      </div>
    </section>
  </main>
}
