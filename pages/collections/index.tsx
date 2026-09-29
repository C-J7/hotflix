import type { GetStaticProps } from "next"
import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"
import FadeImage from "@/components/FadeImage"
import PageHeader from "@/components/PageHeader"
import Seo from "@/components/Seo"
import { backdropUrl } from "@/lib/format"
import { GENRES } from "@/lib/genres"
import { discoverByGenre } from "@/lib/tmdb"
import styles from "@/styles/Collections.module.css"

type Tile = { slug: string; name: string; blurb: string; backdrop: string | null }

export default function Collections({ tiles }: { tiles: Tile[] }) {
  return (
    <>
      <Seo title="Collections" description="Browse films by mood: action, drama, horror, sci-fi and more, arranged as curated collections." />

      <PageHeader
        kicker="Collections"
        title={
          <>
            Pick a <em>mood</em>.
          </>
        }
        lede="Eighteen collections, each refreshed daily from what people are actually watching."
      />

      <ul className={`shell ${styles.grid}`}>
        {tiles.map((t, i) => {
          const src = backdropUrl(t.backdrop, i === 0 ? "w1280" : "w780")
          return (
            <li key={t.slug} className={styles.cell} data-feature={i === 0} style={{ "--i": i } as React.CSSProperties}>
              <Link href={`/collections/${t.slug}`} className={styles.tile}>
                {src && <FadeImage src={src} alt="" fill sizes={i === 0 ? "(max-width: 760px) 100vw, 66vw" : "(max-width: 760px) 100vw, 33vw"} className={styles.img} />}
                <span className={styles.shade} aria-hidden />
                <span className={styles.label}>
                  <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.name}>{t.name}</span>
                  <span className={styles.blurb}>
                    {t.blurb} <IconArrowRight size={14} aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export const getStaticProps: GetStaticProps<{ tiles: Tile[] }> = async () => {
  const results = await Promise.allSettled(GENRES.map((g) => discoverByGenre(g.id)))
  const used = new Set<string>()

  const tiles = GENRES.map((g, i) => {
    const r = results[i]
    // Popular films span many genres, so skip backdrops another tile already used.
    const pick = r.status === "fulfilled" ? r.value.results.find((m) => m.backdropPath && !used.has(m.backdropPath)) : undefined
    if (pick?.backdropPath) used.add(pick.backdropPath)
    return { slug: g.slug, name: g.name, blurb: g.blurb, backdrop: pick?.backdropPath ?? null }
  })

  return { props: { tiles }, revalidate: 86400 }
}
