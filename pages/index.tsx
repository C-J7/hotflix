import type { GetStaticProps } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"
import { IconArrowRight } from "@tabler/icons-react"
import FadeImage from "@/components/FadeImage"
import Seo from "@/components/Seo"
import { backdropUrl, posterUrl } from "@/lib/format"
import { hasBackdrop, listMovies } from "@/lib/tmdb"
import type { Movie } from "@/lib/types"
import type { HotflixPage } from "./_app"
import styles from "@/styles/Landing.module.css"

type Props = { covers: Movie[]; ticker: Movie[]; edition: string }

const Landing: HotflixPage<Props> = ({ covers, ticker, edition }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (covers.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % covers.length), 7000)
    return () => window.clearInterval(id)
  }, [covers.length])

  const current = covers[index]

  return (
    <>
      <Seo />

      <section className={styles.cover}>
        <div className={styles.backdrops} aria-hidden>
          {covers.map((m, i) => {
            const src = backdropUrl(m.backdropPath, "original")
            return src ? (
              <FadeImage key={m.id} src={src} alt="" fill sizes="100vw" priority={i === 0} data-active={i === index} className={styles.backdrop} />
            ) : null
          })}
        </div>
        <div className={styles.scrim} aria-hidden />

        <div className={`shell ${styles.content}`}>
          <p className={`kicker ${styles.kicker}`}>Film discovery · {edition}</p>
          <h1 className={`display ${styles.headline}`}>
            Find something <em>worth</em> watching tonight.
          </h1>
          <p className={styles.lede}>
            Trailers, ratings and hand-picked collections across thousands of films. No account, no noise. Just
            the good stuff, arranged well.
          </p>
          <div className={styles.ctas}>
            <Link href="/browse" className={`btn btn-primary ${styles.cta}`}>
              Explore movies <IconArrowRight size={18} />
            </Link>
            <Link href="/collections" className={`btn btn-ghost ${styles.cta}`}>
              Browse collections
            </Link>
          </div>
        </div>

        {current && (
          <p className={`shell ${styles.caption}`} key={current.id}>
            <span>On screen</span>
            <Link href={`/movie/${current.id}`}>{current.title}</Link>
          </p>
        )}
      </section>

      {ticker.length > 0 && (
        <section className={styles.ticker} aria-label="Now showing">
          <p className={`shell kicker ${styles.tickerLabel}`}>Now showing</p>
          <div className={styles.track}>
            {[0, 1].map((copy) => (
              <ul key={copy} className={styles.reel} aria-hidden={copy === 1}>
                {ticker.map((m) => {
                  const src = posterUrl(m.posterPath, "w342")
                  return (
                    <li key={m.id}>
                      <Link href={`/movie/${m.id}`} className={styles.poster} tabIndex={copy === 1 ? -1 : undefined} aria-label={m.title}>
                        {src && <FadeImage src={src} alt="" fill sizes="150px" />}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

Landing.overlayHeader = true

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [nowPlaying, trending] = await Promise.all([
    listMovies("/movie/now_playing", {}, hasBackdrop),
    listMovies("/trending/movie/day"),
  ])

  return {
    props: {
      covers: nowPlaying.slice(0, 6),
      ticker: trending.slice(0, 16),
      edition: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    },
    revalidate: 3600,
  }
}

export default Landing
