import { INTRO as T } from './data.js'

// מסך הפתיחה: שלוש עמודות, אחת לכל מסך. מימין: על המשחק. באמצע: כותרת וכפתור. משמאל: הוראות.
export default function Intro({ leaving, onStart }) {
  return (
    <div className={'intro' + (leaving ? ' out' : '')}>
      <section className="ip">
        <h2>{T.aboutTitle}</h2>
        <p>{T.about}</p>
      </section>
      <section className="ip mid">
        <h1>{T.title}</h1>
        <p className="lead">{T.lead}</p>
        <button className="go" onClick={onStart}>{T.start}</button>
      </section>
      <section className="ip">
        <h2>{T.howTitle}</h2>
        <ol>{T.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
      </section>
    </div>
  )
}
