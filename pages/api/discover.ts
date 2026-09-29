import type { NextApiRequest, NextApiResponse } from "next"
import { discoverByGenre, type DiscoverSort } from "@/lib/tmdb"
import { genreBySlug } from "@/lib/genres"

const SORTS: DiscoverSort[] = ["popular", "top-rated", "newest"]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const genre = typeof req.query.genre === "string" ? genreBySlug(req.query.genre) : undefined
  if (!genre) return res.status(400).json({ error: "Unknown genre." })

  const sort = SORTS.includes(req.query.sort as DiscoverSort) ? (req.query.sort as DiscoverSort) : "popular"
  const page = Math.min(Math.max(Number(req.query.page) || 1, 1), 500)

  try {
    const data = await discoverByGenre(genre.id, page, sort)
    res.setHeader("Cache-Control", "public, s-maxage=21600, stale-while-revalidate=86400")
    return res.status(200).json(data)
  } catch {
    return res.status(502).json({ error: "Couldn't load this collection." })
  }
}
