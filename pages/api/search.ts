import type { NextApiRequest, NextApiResponse } from "next"
import { searchMovies } from "@/lib/tmdb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : ""
  const page = Math.min(Math.max(Number(req.query.page) || 1, 1), 500)
  if (!q) return res.status(200).json({ results: [], page: 1, totalPages: 0 })

  try {
    const data = await searchMovies(q, page)
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400")
    return res.status(200).json(data)
  } catch {
    return res.status(502).json({ error: "Search is unavailable right now." })
  }
}
