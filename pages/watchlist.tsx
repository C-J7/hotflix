import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"
import PageHeader from "@/components/PageHeader"
import Seo from "@/components/Seo"
import { GridSkeleton, MovieGrid } from "@/components/MovieGrid"
import { useHydrated, useWatchlist } from "@/hooks/useWatchlist"
import styles from "@/styles/Empty.module.css"

export default function Watchlist() {
  const { list } = useWatchlist()
  const hydrated = useHydrated()
  const count = list.length

  return (
    <>
      <Seo title="My List" noindex />
      <PageHeader
        kicker="My List"
        title={
          <>
            Saved for <em>later</em>.
          </>
        }
        lede={
          hydrated && count > 0
            ? `${count} ${count === 1 ? "film" : "films"} saved on this device.`
            : "Films you save live here, on this device. No account needed."
        }
      />
      <div className="shell">
        {!hydrated ? (
          <GridSkeleton count={6} />
        ) : count === 0 ? (
          <div className={styles.empty}>
            <p className="display">Nothing saved yet.</p>
            <p>Tap the + on any film to keep it here for later.</p>
            <Link href="/browse" className="btn btn-primary">
              Start exploring <IconArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <MovieGrid movies={list} />
        )}
      </div>
    </>
  )
}
