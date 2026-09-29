import { IconCheck, IconPlus } from "@tabler/icons-react"
import { useState } from "react"
import { useWatchlist } from "@/hooks/useWatchlist"
import type { Movie } from "@/lib/types"
import styles from "@/styles/WatchlistButton.module.css"

type Props = { movie: Movie; variant?: "full" | "icon" }

export default function WatchlistButton({ movie, variant = "full" }: Props) {
  const { has, toggle } = useWatchlist()
  const saved = has(movie.id)
  // Bumped on each click so the icon's pop animation replays.
  const [pulse, setPulse] = useState(0)

  const onClick = () => {
    toggle(movie)
    setPulse((n) => n + 1)
  }

  const label = saved ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`
  const icon = (
    <span key={pulse} className={styles.icon} data-pulse={pulse > 0}>
      {saved ? <IconCheck size={variant === "icon" ? 17 : 18} stroke={2.2} /> : <IconPlus size={variant === "icon" ? 17 : 18} stroke={2} />}
    </span>
  )

  if (variant === "icon") {
    return (
      <button type="button" className={styles.round} aria-pressed={saved} aria-label={label} title={label} onClick={onClick}>
        {icon}
      </button>
    )
  }

  return (
    <button type="button" className="btn btn-ghost" aria-pressed={saved} aria-label={label} onClick={onClick}>
      {icon}
      <span>{saved ? "In My List" : "My List"}</span>
    </button>
  )
}
