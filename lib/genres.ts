// TMDB's movie genre list is effectively fixed, so it lives here instead of costing a request per page.
export const GENRES: { id: number; name: string; slug: string; blurb: string }[] = [
  { id: 28, name: "Action", slug: "action", blurb: "Set pieces, chases and last-second saves." },
  { id: 12, name: "Adventure", slug: "adventure", blurb: "Maps, quests and the long way home." },
  { id: 16, name: "Animation", slug: "animation", blurb: "Hand-drawn, stop-motion and everything rendered." },
  { id: 35, name: "Comedy", slug: "comedy", blurb: "For when you need the room to laugh." },
  { id: 80, name: "Crime", slug: "crime", blurb: "Heists, detectives and the ones who got away." },
  { id: 99, name: "Documentary", slug: "documentary", blurb: "True stories, told well." },
  { id: 18, name: "Drama", slug: "drama", blurb: "Big feelings, small rooms." },
  { id: 10751, name: "Family", slug: "family", blurb: "Something everyone on the couch agrees on." },
  { id: 14, name: "Fantasy", slug: "fantasy", blurb: "Other worlds, older magic." },
  { id: 36, name: "History", slug: "history", blurb: "The past, dramatised." },
  { id: 27, name: "Horror", slug: "horror", blurb: "Lights off. Volume up." },
  { id: 10402, name: "Music", slug: "music", blurb: "Stages, studios and the songs that stayed." },
  { id: 9648, name: "Mystery", slug: "mystery", blurb: "Clues first, answers last." },
  { id: 10749, name: "Romance", slug: "romance", blurb: "Meet-cutes and long goodbyes." },
  { id: 878, name: "Science Fiction", slug: "science-fiction", blurb: "Futures, near and far." },
  { id: 53, name: "Thriller", slug: "thriller", blurb: "Tension you can feel in your shoulders." },
  { id: 10752, name: "War", slug: "war", blurb: "Frontlines and the cost of them." },
  { id: 37, name: "Western", slug: "western", blurb: "Dust, horizons and hard choices." },
]

const byId = new Map(GENRES.map((g) => [g.id, g]))

export function genreName(id: number): string | undefined {
  return byId.get(id)?.name
}

export function genreBySlug(slug: string) {
  return GENRES.find((g) => g.slug === slug)
}
