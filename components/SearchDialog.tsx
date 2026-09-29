import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { IconArrowRight, IconSearch, IconStarFilled } from "@tabler/icons-react"
import Dialog from "./Dialog"
import { genreList, posterUrl, ratingLabel, year } from "@/lib/format"
import type { Movie } from "@/lib/types"
import styles from "@/styles/Search.module.css"

type Status = "idle" | "loading" | "done" | "error"

export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const controller = useRef<AbortController | null>(null)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Movie[]>([])
  const [status, setStatus] = useState<Status>("idle")
  const [active, setActive] = useState(0)

  useEffect(
    () => () => {
      window.clearTimeout(timer.current)
      controller.current?.abort()
    },
    [],
  )

  const onChange = (value: string) => {
    setQuery(value)
    setActive(0)
    window.clearTimeout(timer.current)
    controller.current?.abort()

    const q = value.trim()
    if (!q) {
      setResults([])
      setStatus("idle")
      return
    }

    setStatus("loading")
    timer.current = window.setTimeout(() => {
      const ac = new AbortController()
      controller.current = ac
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ac.signal })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((data: { results: Movie[] }) => {
          setResults(data.results.slice(0, 7))
          setStatus("done")
        })
        .catch((err: Error) => {
          if (err.name !== "AbortError") setStatus("error")
        })
    }, 220)
  }

  const seeAllHref = `/search?q=${encodeURIComponent(query.trim())}`

  return (
    <Dialog label="Search films" variant="top" onClose={onClose} initialFocus={inputRef} panelClassName={styles.panel}>
      {(close) => {
        const go = (href: string) => {
          close()
          router.push(href)
        }

        return (
          <>
            <div className={styles.field} data-loading={status === "loading"}>
              <IconSearch size={20} stroke={1.8} className={styles.fieldIcon} />
              <input
                ref={inputRef}
                className={styles.input}
                value={query}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault()
                    setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)))
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault()
                    setActive((i) => Math.max(i - 1, 0))
                  } else if (e.key === "Enter" && query.trim()) {
                    e.preventDefault()
                    go(results[active] ? `/movie/${results[active].id}` : seeAllHref)
                  }
                }}
                placeholder="Search by title…"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="search-results"
                aria-activedescendant={results[active] ? `search-result-${results[active].id}` : undefined}
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className={styles.esc}>esc</kbd>
            </div>

            <div className={styles.body}>
              {status === "idle" && <p className={styles.hint}>Titles, sequels, old favourites. Start typing.</p>}
              {status === "error" && <p className={styles.hint}>Search is unavailable right now. Try again in a moment.</p>}
              {status === "done" && results.length === 0 && (
                <p className={styles.hint}>
                  No films match <em>“{query.trim()}”</em>.
                </p>
              )}

              {results.length > 0 && (
                <ul id="search-results" role="listbox" className={styles.list} data-stale={status === "loading"}>
                  {results.map((m, i) => {
                    const thumb = posterUrl(m.posterPath, "w185")
                    return (
                      <li key={m.id} id={`search-result-${m.id}`} role="option" aria-selected={i === active}>
                        <Link
                          href={`/movie/${m.id}`}
                          className={styles.result}
                          data-active={i === active}
                          onMouseEnter={() => setActive(i)}
                          onClick={(e) => {
                            e.preventDefault()
                            go(`/movie/${m.id}`)
                          }}
                        >
                          <span className={styles.thumb}>
                            {thumb && <Image src={thumb} alt="" fill sizes="46px" />}
                          </span>
                          <span className={styles.info}>
                            <span className={styles.name}>{m.title}</span>
                            <span className="meta">
                              {m.releaseDate && <span>{year(m.releaseDate)}</span>}
                              {genreList(m.genreIds, 2).length > 0 && <span>{genreList(m.genreIds, 2).join(", ")}</span>}
                            </span>
                          </span>
                          <span className={styles.score}>
                            <IconStarFilled size={11} aria-hidden /> {ratingLabel(m.rating)}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {query.trim() && (
              <div className={styles.foot}>
                <span className={styles.keys}>
                  <kbd>↑</kbd>
                  <kbd>↓</kbd> to move <kbd>↵</kbd> to open
                </span>
                <Link
                  href={seeAllHref}
                  className={styles.all}
                  onClick={(e) => {
                    e.preventDefault()
                    go(seeAllHref)
                  }}
                >
                  All results <IconArrowRight size={15} />
                </Link>
              </div>
            )}
          </>
        )
      }}
    </Dialog>
  )
}
