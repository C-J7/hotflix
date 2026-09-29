import { genreName } from "./genres"

type PosterSize = "w185" | "w342" | "w500" | "w780"
type BackdropSize = "w300" | "w780" | "w1280" | "original"

export const posterUrl = (path: string | null, size: PosterSize = "w342") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null

export const backdropUrl = (path: string | null, size: BackdropSize = "w780") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null

export const profileUrl = (path: string | null) => (path ? `https://image.tmdb.org/t/p/w185${path}` : null)

export const year = (date: string | null) => (date ? date.slice(0, 4) : "")

export function runtime(minutes: number | null): string {
  if (!minutes) return ""
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h ? `${h}h ${m}m` : `${m}m`
}

export function genreList(ids: number[], max = 2): string[] {
  return ids.map(genreName).filter((n): n is string => Boolean(n)).slice(0, max)
}

export const ratingLabel = (rating: number) => (rating > 0 ? rating.toFixed(1) : "NR")
