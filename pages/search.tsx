import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback } from "react"
import PageHeader from "@/components/PageHeader"
import Seo from "@/components/Seo"
import { GridSkeleton, InfiniteGrid } from "@/components/MovieGrid"
import type { Movie, Paged } from "@/lib/types"
import styles from "@/styles/Empty.module.css"

export default function Search() {
  const router = useRouter()
  const q = typeof router.query.q === "string" ? router.query.q.trim() : ""

  const load = useCallback(
    (page: number, signal: AbortSignal) =>
      fetch(`/api/search?q=${encodeURIComponent(q)}&page=${page}`, { signal }).then((r) =>
        r.ok ? (r.json() as Promise<Paged<Movie>>) : Promise.reject(new Error(String(r.status))),
      ),
    [q],
  )

  return (
    <>
      <Seo title={q ? `“${q}”` : "Search"} noindex />
      <PageHeader
        kicker="Search"
        title={q ? <>“{q}”</> : "Search"}
        lede={q ? undefined : "Press / anywhere on the site to search."}
      />
      <div className="shell">
        {!router.isReady ? (
          <GridSkeleton />
        ) : q ? (
          <InfiniteGrid
            key={q}
            load={load}
            empty={
              <div className={styles.empty}>
                <p className="display">Nothing by that name.</p>
                <p>Check the spelling, or try a shorter title.</p>
                <Link href="/browse" className="btn btn-ghost">
                  Back to Discover
                </Link>
              </div>
            }
          />
        ) : null}
      </div>
    </>
  )
}
