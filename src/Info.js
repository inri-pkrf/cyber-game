import { ATTACKS, INTRO as T } from './data.js'

// המסך האמצעי: ההוראות ומספר ההתאמות שהצליחו
export default function Info({ done, onAgain }) {
  const total = ATTACKS.length
  const n = done.length
  const all = n === total
  return (
    <section className="panel info">
      <h1 className="title">{T.title}</h1>
      <div className={'score' + (all ? ' all' : '')}>
        <span className="lbl">הצלחנו להתאים</span>
        <strong className="big"><span dir="ltr">{n} / {total}</span></strong>
        <div className="bar"><i style={{ width: `${(n / total) * 100}%` }} /></div>
        {all && <p className="msg">כל הכבוד! התאמנו את כל המתקפות</p>}
        {all && <button className="again" onClick={onAgain}>משחק חדש</button>}
      </div>
    </section>
  )
}
