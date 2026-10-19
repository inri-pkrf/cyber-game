// מחלק את התמונות לשורות של עד 4, כשהשורות האמצעיות מלאות יותר: 14 תמונות = 3, 4, 4, 3
export const rowsFor = (n) => {
  const r = Math.ceil(n / 4)
  const base = Math.floor(n / r)
  const counts = Array(r).fill(base)
  const order = [...counts.keys()].sort((a, b) => Math.abs(a - (r - 1) / 2) - Math.abs(b - (r - 1) / 2))
  for (let k = 0; k < n - base * r; k++) counts[order[k]]++
  return counts
}

// המסך הימני: כל התמונות באותו גודל, ממורכזות, בלי מסגרת, עם מספר קטן בפינה הימנית העליונה.
// המספר הוא המקום בסדר (order), והסדר מתערבב בכל משחק חדש.
// הגודל נקבע לפי הגובה וגם לפי הרוחב של המסך, כדי שכל התמונות ייכנסו בשלמותן.
export default function Gallery({ order, done }) {
  const rows = rowsFor(order.length)
  const widest = Math.max(...rows)
  const starts = rows.map((_, i) => rows.slice(0, i).reduce((s, c) => s + c, 0))
  const byHeight = Math.min(28, ((72 - (rows.length - 1) * 1.6) / rows.length) * 1.5)
  const w = `min(${byHeight}vh, calc((100cqw - ${(widest - 1) * 1.6}vh) / ${widest} - .3vh))`
  return (
    <section className="panel gallery">
      <header><h2>תמונות</h2></header>
      <div className="rows" style={{ '--w': w }}>
        {rows.map((c, i) => (
          <div className="row" key={i}>
            {order.slice(starts[i], starts[i] + c).map((a, j) => {
              const ok = done.includes(a.id)
              return (
                <figure key={a.id} className={'tile' + (ok ? ' ok' : '')}>
                  <img src={a.image} alt="" draggable={false} />
                  <b className="num">{starts[i] + j + 1}</b>
                  {ok && <figcaption>{a.title}</figcaption>}
                </figure>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
