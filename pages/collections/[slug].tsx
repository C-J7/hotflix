import type { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { useCallback } from "react"
import FadeImage from "@/components/FadeImage"
import PageHeader from "@/components/PageHeader"
import Seo from "@/components/Seo"
import { InfiniteGrid } from "@/components/MovieGrid"
import { backdropUrl } from "@/lib/format"
import { GENRES, genreBySlug } from "@/lib/genres"
import { discoverByGenre, type DiscoverSort } from "@/lib/tmdb"
import type { Movie, Paged } from "@/lib/types"
import styles from "@/styles/Tabs.module.css"

const SORTS: { value: DiscoverSort; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "top-rated", label: "Top rated" },
  { value: "newest", label: "Newest" },
]

type Props = { slug: string; name: string; blurb: string; initial: Paged<Movie> }

export default function Collection({ slug, name, blurb, initial }: Props) {
  const router = useRouter()
  const requested = router.query.sort as DiscoverSort
  const sort: DiscoverSort = SORTS.some((s) => s.value === requested) ? requested : "popular"
  const activeIndex = SORTS.findIndex((s) => s.value === sort)
  const cover = backdropUrl(initial.results.find((m) => m.backdropPath)?.backdropPath ?? null, "w1280")

  const load = useCallback(
    (page: number, signal: AbortSignal) =>
      fetch(`/api/discover?genre=${slug}&sort=${sort}&page=${page}`, { signal }).then((r) =>
        r.ok ? (r.json() as Promise<Paged<Movie>>) : Promise.reject(new Error(String(r.status))),
      ),
    [slug, sort],
  )

  const setSort = (value: DiscoverSort) => {
    const query = value === "popular" ? { slug } : { slug, sort: value }
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false })
  }

  return (
    <>
      <Seo title={`${name} films`} description={`${blurb} Browse the most popular, top rated and newest ${name.toLowerCase()} films.`} />

      <PageHeader
        kicker="Collection"
        title={name}
        lede={blurb}
        backdrop={cover ? <FadeImage src={cover} alt="" fill sizes="100vw" priority /> : undefined}
        aside={
          <div className={styles.tabs} role="tablist" aria-label="Sort films" style={{ "--active": activeIndex } as React.CSSProperties}>
            <span className={styles.indicator} aria-hidden />
            {SORTS.map((s) => (
              <button key={s.value} role="tab" aria-selected={s.value === sort} className={styles.tab} onClick={() => setSort(s.value)}>
                {s.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="shell">
        <InfiniteGrid key={sort} initial={sort === "popular" ? initial : undefined} load={load} />
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: GENRES.map((g) => ({ params: { slug: g.slug } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const genre = genreBySlug(String(params?.slug))
  if (!genre) return { notFound: true }
  const initial = await discoverByGenre(genre.id)
  return { props: { slug: genre.slug, name: genre.name, blurb: genre.blurb, initial }, revalidate: 21600 }
}
