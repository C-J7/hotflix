// Server-only: imported by getStaticProps and API routes, never by components.
import type { CastMember, Movie, MovieDetail, Paged } from "./types"

const API = "https://api.themoviedb.org/3"

export class TmdbError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

function apiKey(): string {
  const key = process.env.TMDB_API_KEY ?? process.env.NEXT_PUBLIC_TMDB_API_KEY
  if (!key) throw new Error("TMDB_API_KEY is not set. Copy .env.example to .env.local and add your key.")
  return key
}

async function tmdb<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const url = new URL(API + path)
  url.searchParams.set("api_key", apiKey())
  url.searchParams.set("language", "en-US")
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) url.searchParams.set(k, String(v))
  }
  const res = await fetch(url)
  if (!res.ok) throw new TmdbError(res.status, `TMDB ${path} failed with ${res.status}`)
  return res.json() as Promise<T>
}

type RawMovie = {
  id: number
  title: string
  overview?: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  vote_average?: number
  genre_ids?: number[]
  genres?: { id: number; name: string }[]
}

type RawPage = { results: RawMovie[]; page: number; total_pages: number }

export function toMovie(m: RawMovie): Movie {
  return {
    id: m.id,
    title: m.title,
    overview: m.overview ?? "",
    posterPath: m.poster_path,
    backdropPath: m.backdrop_path,
    releaseDate: m.release_date || null,
    rating: Math.round((m.vote_average ?? 0) * 10) / 10,
    genreIds: m.genre_ids ?? m.genres?.map((g) => g.id) ?? [],
  }
}

function toPaged(raw: RawPage, keep: (m: RawMovie) => boolean = (m) => Boolean(m.poster_path)): Paged<Movie> {
  return {
    results: raw.results.filter(keep).map(toMovie),
    page: raw.page,
    totalPages: Math.min(raw.total_pages, 500), // TMDB rejects pages past 500
  }
}

export const hasBackdrop = (m: RawMovie) => Boolean(m.backdrop_path && m.poster_path)

export async function listMovies(
  path: string,
  params: Record<string, string | number | undefined> = {},
  keep?: (m: RawMovie) => boolean,
): Promise<Movie[]> {
  return toPaged(await tmdb<RawPage>(path, params), keep).results
}

export type DiscoverSort = "popular" | "top-rated" | "newest"

const SORTS: Record<DiscoverSort, Record<string, string | number>> = {
  popular: { sort_by: "popularity.desc" },
  "top-rated": { sort_by: "vote_average.desc", "vote_count.gte": 400 },
  newest: { sort_by: "primary_release_date.desc", "vote_count.gte": 50 },
}

export async function discoverByGenre(genreId: number, page = 1, sort: DiscoverSort = "popular"): Promise<Paged<Movie>> {
  const raw = await tmdb<RawPage>("/discover/movie", {
    with_genres: genreId,
    page,
    include_adult: "false",
    "release_date.lte": new Date().toISOString().slice(0, 10),
    ...SORTS[sort],
  })
  return toPaged(raw)
}

export async function searchMovies(query: string, page = 1): Promise<Paged<Movie>> {
  const raw = await tmdb<RawPage>("/search/movie", { query, page, include_adult: "false" })
  return toPaged(raw)
}

type RawVideo = { key: string; site: string; type: string; official?: boolean }

export function pickTrailer(videos: RawVideo[]): string | null {
  const yt = videos.filter((v) => v.site === "YouTube")
  const pick =
    yt.find((v) => v.type === "Trailer" && v.official) ??
    yt.find((v) => v.type === "Trailer") ??
    yt.find((v) => v.type === "Teaser") ??
    yt[0]
  return pick?.key ?? null
}

export async function trailerFor(movieId: number): Promise<string | null> {
  const raw = await tmdb<{ results: RawVideo[] }>(`/movie/${movieId}/videos`)
  return pickTrailer(raw.results)
}

type RawDetail = RawMovie & {
  tagline?: string
  runtime?: number
  genres: { id: number; name: string }[]
  videos?: { results: RawVideo[] }
  credits?: { cast: { id: number; name: string; character: string; profile_path: string | null }[] }
  recommendations?: RawPage
  similar?: RawPage
  release_dates?: { results: { iso_3166_1: string; release_dates: { certification: string }[] }[] }
}

export async function movieDetail(id: number): Promise<MovieDetail> {
  const raw = await tmdb<RawDetail>(`/movie/${id}`, {
    append_to_response: "videos,credits,recommendations,similar,release_dates",
  })

  const us = raw.release_dates?.results.find((r) => r.iso_3166_1 === "US")
  const certification = us?.release_dates.find((d) => d.certification)?.certification ?? null

  const cast: CastMember[] = (raw.credits?.cast ?? []).slice(0, 16).map((c) => ({
    id: c.id,
    name: c.name,
    character: c.character,
    profilePath: c.profile_path,
  }))

  const recs = raw.recommendations?.results ?? []
  const relatedRaw = recs.length >= 6 ? recs : [...recs, ...(raw.similar?.results ?? [])]
  const seen = new Set<number>([raw.id])
  const related = relatedRaw
    .filter((m) => m.poster_path && !seen.has(m.id) && seen.add(m.id))
    .slice(0, 20)
    .map(toMovie)

  return {
    ...toMovie(raw),
    tagline: raw.tagline || null,
    runtime: raw.runtime || null,
    genres: raw.genres,
    certification,
    trailerKey: pickTrailer(raw.videos?.results ?? []),
    cast,
    related,
  }
}
