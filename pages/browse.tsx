import type { GetStaticProps } from "next"
import Link from "next/link"
import Hero from "@/components/Hero"
import Row from "@/components/Row"
import Seo from "@/components/Seo"
import { BackdropCard, PosterCard, RankedCard } from "@/components/Cards"
import { GENRES } from "@/lib/genres"
import { discoverByGenre, hasBackdrop, listMovies } from "@/lib/tmdb"
import type { Movie } from "@/lib/types"
import type { HotflixPage } from "./_app"
import styles from "@/styles/Browse.module.css"

type GenreRow = { slug: string; name: string; movies: Movie[] }

type Props = {
  picks: Movie[]
  trending: Movie[]
  top10: Movie[]
  popular: Movie[]
  inCinemas: Movie[]
  acclaimed: Movie[]
  genreRows: GenreRow[]
}

const FEATURED_GENRES = ["science-fiction", "animation", "horror", "comedy"]

const Browse: HotflixPage<Props> = ({ picks, trending, top10, popular, inCinemas, acclaimed, genreRows }) => {
  return (
    <>
      <Seo
        title="Discover"
        description="Tonight's pick, what's trending, the Top 10 and hand-picked collections. Watch trailers and build your list."
      />

      <Hero movies={picks} />

      <Row title="Trending this week" kicker="Everyone's watching" variant="backdrop">
        {trending.map((m) => (
          <BackdropCard key={m.id} movie={m} />
        ))}
      </Row>

      <Row title="Top 10 today" kicker="Ranked" variant="ranked">
        {top10.map((m, i) => (
          <RankedCard key={m.id} movie={m} rank={i + 1} />
        ))}
      </Row>

      <Row title="Popular right now" variant="poster">
        {popular.map((m) => (
          <PosterCard key={m.id} movie={m} />
        ))}
      </Row>

      <Row title="In cinemas" kicker="Now showing" variant="backdrop">
        {inCinemas.map((m) => (
          <BackdropCard key={m.id} movie={m} />
        ))}
      </Row>

      <section className={`shell ${styles.genres}`} aria-labelledby="genres-heading">
        <div>
          <p className="kicker">Collections</p>
          <h2 id="genres-heading" className={styles.genresTitle}>
            Browse by <em>mood</em>
          </h2>
        </div>
        <ul className={styles.chips}>
          {GENRES.map((g) => (
            <li key={g.id}>
              <Link href={`/collections/${g.slug}`} className={styles.chip}>
                {g.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Row title="Critically acclaimed" kicker="Highest rated" variant="poster">
        {acclaimed.map((m) => (
          <PosterCard key={m.id} movie={m} />
        ))}
      </Row>

      {genreRows.map((row) => (
        <Row key={row.slug} title={row.name} kicker="Collection" href={`/collections/${row.slug}`} variant="poster">
          {row.movies.map((m) => (
            <PosterCard key={m.id} movie={m} />
          ))}
        </Row>
      ))}
    </>
  )
}

Browse.overlayHeader = true

export const getStaticProps: GetStaticProps<Props> = async () => {
  const featured = GENRES.filter((g) => FEATURED_GENRES.includes(g.slug))

  const [week, day, popular, nowPlaying, topRated, ...genreResults] = await Promise.allSettled([
    listMovies("/trending/movie/week", {}, hasBackdrop),
    listMovies("/trending/movie/day"),
    listMovies("/movie/popular"),
    listMovies("/movie/now_playing", {}, hasBackdrop),
    listMovies("/movie/top_rated"),
    ...featured.map((g) => discoverByGenre(g.id)),
  ])

  const value = <T,>(r: PromiseSettledResult<T>, fallback: T) => (r.status === "fulfilled" ? r.value : fallback)
  const weekly = value(week, [])

  // Without the hero's source list the page has nothing to show, so fail the (re)build and keep the last good page.
  if (weekly.length === 0) throw new Error("Couldn't load trending movies from TMDB.")

  const genreRows = featured
    .map((g, i) => ({ slug: g.slug, name: g.name, movies: value(genreResults[i], { results: [] as Movie[], page: 1, totalPages: 0 }).results }))
    .filter((r) => r.movies.length > 0)

  return {
    props: {
      picks: weekly.slice(0, 6),
      trending: weekly.slice(6, 20),
      top10: value(day, []).slice(0, 10),
      popular: value(popular, []),
      inCinemas: value(nowPlaying, []),
      acclaimed: value(topRated, []),
      genreRows,
    },
    revalidate: 3600,
  }
}

export default Browse
