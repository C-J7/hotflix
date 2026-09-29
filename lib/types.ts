export type Movie = {
  id: number
  title: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string | null
  rating: number
  genreIds: number[]
}

export type CastMember = {
  id: number
  name: string
  character: string
  profilePath: string | null
}

export type MovieDetail = Movie & {
  tagline: string | null
  runtime: number | null
  genres: { id: number; name: string }[]
  certification: string | null
  trailerKey: string | null
  cast: CastMember[]
  related: Movie[]
}

export type Paged<T> = {
  results: T[]
  page: number
  totalPages: number
}
