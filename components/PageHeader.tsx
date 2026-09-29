import type { ReactNode } from "react"
import styles from "@/styles/Page.module.css"

type Props = { kicker: string; title: ReactNode; lede?: ReactNode; aside?: ReactNode; backdrop?: ReactNode }

export default function PageHeader({ kicker, title, lede, aside, backdrop }: Props) {
  return (
    <header className={styles.header}>
      {backdrop && (
        <div className={styles.backdrop} aria-hidden>
          {backdrop}
        </div>
      )}
      <div className={`shell ${styles.inner}`}>
        <div className={styles.titles}>
          <p className="kicker">{kicker}</p>
          <h1 className={`display ${styles.title}`}>{title}</h1>
          {lede && <p className={styles.lede}>{lede}</p>}
        </div>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
    </header>
  )
}
