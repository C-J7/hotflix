import { useCallback, useSyncExternalStore } from "react"
import type { Movie } from "@/lib/types"

const KEY = "watchlist"
const EVENT = "watchlistUpdated"
const EMPTY: Movie[] = []

// Entries saved by the previous version of the app used snake_case fields and genre names.
type LegacyEntry = Partial<Movie> & {
  poster_path?: string | null
  backdrop_path?: string | null
  release_date?: string
  release_year?: string
  vote_average?: number
  genre_ids?: number[]
}

function normalize(e: LegacyEntry): Movie | null {
  if (typeof e?.id !== "number" || !e.title) return null
  return {
    id: e.id,
    title: e.title,
    overview: e.overview ?? "",
    posterPath: e.posterPath ?? e.poster_path ?? null,
    backdropPath: e.backdropPath ?? e.backdrop_path ?? null,
    releaseDate: e.releaseDate ?? e.release_date ?? (e.release_year ? `${e.release_year}-01-01` : null),
    rating: e.rating ?? e.vote_average ?? 0,
    genreIds: e.genreIds ?? e.genre_ids ?? [],
  }
}

let cachedRaw: string | null = null
let cachedList: Movie[] = EMPTY

function read(): Movie[] {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
  } catch {
    return EMPTY
  }
  if (raw === cachedRaw) return cachedList
  cachedRaw = raw
  try {
    const parsed: LegacyEntry[] = raw ? JSON.parse(raw) : []
    cachedList = parsed.map(normalize).filter((m): m is Movie => m !== null)
  } catch {
    cachedList = EMPTY
  }
  return cachedList
}

function write(list: Movie[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    return
  }
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange)
  window.addEventListener(EVENT, onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(EVENT, onChange)
  }
}

export function useWatchlist() {
  const list = useSyncExternalStore(subscribe, read, () => EMPTY)

  const has = useCallback((id: number) => list.some((m) => m.id === id), [list])

  const toggle = useCallback((movie: Movie) => {
    const current = read()
    const exists = current.some((m) => m.id === movie.id)
    // Store only the list fields, even when handed a full MovieDetail with cast and related films.
    const { id, title, overview, posterPath, backdropPath, releaseDate, rating, genreIds } = movie
    const entry: Movie = { id, title, overview, posterPath, backdropPath, releaseDate, rating, genreIds }
    write(exists ? current.filter((m) => m.id !== movie.id) : [entry, ...current])
    return !exists
  }, [])

  const remove = useCallback((id: number) => write(read().filter((m) => m.id !== id)), [])

  return { list, has, toggle, remove }
}

const noopSubscribe = () => () => {}

// True only after hydration, so client-only state (like the watchlist) can skip its empty first paint.
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false)
}
