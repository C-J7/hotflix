import type { NextApiRequest, NextApiResponse } from "next"
import { trailerFor } from "@/lib/tmdb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id)
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid movie id." })

  try {
    const key = await trailerFor(id)
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800")
    return res.status(200).json({ key })
  } catch {
    return res.status(502).json({ error: "Couldn't load the trailer." })
  }
}
