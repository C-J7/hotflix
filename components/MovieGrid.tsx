import { useCallback, useEffect, useRef, useState } from "react"
import { PosterCard } from "./Cards"
import type { Movie, Paged } from "@/lib/types"
import styles from "@/styles/Grid.module.css"

export function MovieGrid({ movies }: { movies: Movie[] }) {
  return (
    <ul className={styles.grid}>
      {movies.map((m, i) => (
        <li key={m.id} className={styles.cell} style={{ "--i": i % 18 } as React.CSSProperties}>
          <PosterCard movie={m} priority={i < 6} />
        </li>
      ))}
    </ul>
  )
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <ul className={styles.grid} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className={styles.cell}>
          <div className={`skeleton ${styles.skeletonPoster}`} />
          <div className={`skeleton ${styles.skeletonLine}`} />
        </li>
      ))}
    </ul>
  )
}

type LoadPage = (page: number, signal: AbortSignal) => Promise<Paged<Movie>>

// Remount (via `key`) to reset when the source changes, e.g. a new sort or query.
export function InfiniteGrid({ initial, load, empty }: { initial?: Paged<Movie>; load: LoadPage; empty?: React.ReactNode }) {
  const [items, setItems] = useState<Movie[]>(initial?.results ?? [])
  const [page, setPage] = useState(initial?.page ?? 0)
  const [totalPages, setTotalPages] = useState(initial?.totalPages ?? 1)
  const [status, setStatus] = useState<"idle" | "loading" | "error">(initial ? "idle" : "loading")
  const sentinel = useRef<HTMLDivElement>(null)
  const controller = useRef<AbortController | null>(null)
  const loadRef = useRef(load)

  useEffect(() => {
    loadRef.current = load
  }, [load])

  // Cancel-and-replace rather than gate-and-skip: a `busy` flag guarding entry can deadlock under
  // Strict Mode's double-invoke, since an aborted call's catch/finally resolves asynchronously,
  // after the second call has already seen the (still-true) flag and bailed out.
  const fetchPage = useCallback((next: number) => {
    controller.current?.abort()
    const ac = new AbortController()
    controller.current = ac
    loadRef
      .current(next, ac.signal)
      .then((data) => {
        setItems((prev) => {
          const seen = new Set(prev.map((m) => m.id))
          return [...prev, ...data.results.filter((m) => !seen.has(m.id))]
        })
        setPage(data.page)
        setTotalPages(data.totalPages)
        setStatus("idle")
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") setStatus("error")
      })
  }, [])

  const hasMore = page < totalPages

  const loadMore = useCallback(() => {
    if (status === "loading" || !hasMore) return
    setStatus("loading")
    fetchPage(page + 1)
  }, [fetchPage, hasMore, page, status])

  // First page on the client when nothing was prerendered.
  useEffect(() => {
    if (!initial) fetchPage(1)
    return () => controller.current?.abort()
  }, [initial, fetchPage])

  useEffect(() => {
    const el = sentinel.current
    if (!el || !hasMore || status === "error") return
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && loadMore(), { rootMargin: "600px 0px" })
    io.observe(el)
    return () => io.disconnect()
  }, [hasMore, status, loadMore])

  if (status === "loading" && items.length === 0) return <GridSkeleton />
  if (status !== "loading" && items.length === 0 && status !== "error") return <>{empty}</>

  return (
    <>
      <MovieGrid movies={items} />
      <div ref={sentinel} className={styles.more}>
        {status === "error" ? (
          <>
            <p>That didn&apos;t load.</p>
            <button className="btn btn-ghost" onClick={loadMore}>
              Try again
            </button>
          </>
        ) : hasMore ? (
          <button className="btn btn-ghost" onClick={loadMore} disabled={status === "loading"} aria-busy={status === "loading"}>
            {status === "loading" ? "Loading…" : "Load more"}
          </button>
        ) : (
          <p className={styles.end}>That&apos;s everything.</p>
        )}
      </div>
    </>
  )
}
