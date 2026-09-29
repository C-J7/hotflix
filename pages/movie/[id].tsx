import type { GetStaticPaths, GetStaticProps } from "next"
import Link from "next/link"
import { IconPlayerPlayFilled, IconStarFilled } from "@tabler/icons-react"
import FadeImage from "@/components/FadeImage"
import Row from "@/components/Row"
import Seo from "@/components/Seo"
import WatchlistButton from "@/components/WatchlistButton"
import { PosterCard } from "@/components/Cards"
import { useTrailer } from "@/components/Trailer"
import { backdropUrl, posterUrl, profileUrl, ratingLabel, runtime, year } from "@/lib/format"
import { GENRES } from "@/lib/genres"
import { movieDetail, TmdbError } from "@/lib/tmdb"
import type { MovieDetail } from "@/lib/types"
import type { HotflixPage } from "../_app"
import styles from "@/styles/Movie.module.css"

const slugFor = (id: number) => GENRES.find((g) => g.id === id)?.slug

const MoviePage: HotflixPage<{ movie: MovieDetail }> = ({ movie }) => {
  const openTrailer = useTrailer()
  const backdrop = backdropUrl(movie.backdropPath, "original")
  const poster = posterUrl(movie.posterPath, "w500")

  return (
    <>
      <Seo
        title={`${movie.title}${movie.releaseDate ? ` (${year(movie.releaseDate)})` : ""}`}
        description={movie.overview || `${movie.title} on Hotflix.`}
        image={backdropUrl(movie.backdropPath, "w1280")}
      />

      <section className={styles.hero}>
        <div className={styles.backdrop} aria-hidden>
          {backdrop && <FadeImage src={backdrop} alt="" fill sizes="100vw" priority className={styles.backdropImg} />}
        </div>

        <div className={`shell ${styles.layout}`}>
          <div className={styles.poster}>
            {poster ? (
              <FadeImage src={poster} alt={`${movie.title} poster`} fill sizes="(max-width: 760px) 40vw, 280px" priority />
            ) : (
              <div className={styles.noPoster}>{movie.title}</div>
            )}
          </div>

          <div className={styles.info}>
            {movie.genres.length > 0 && (
              <p className={`kicker ${styles.genres}`}>
                {movie.genres.map((g, i) => {
                  const slug = slugFor(g.id)
                  return (
                    <span key={g.id}>
                      {i > 0 && <span className={styles.sep}> / </span>}
                      {slug ? <Link href={`/collections/${slug}`}>{g.name}</Link> : g.name}
                    </span>
                  )
                })}
              </p>
            )}

            <h1 className={`display ${styles.title}`}>{movie.title}</h1>
            {movie.tagline && <p className={styles.tagline}>{movie.tagline}</p>}

            <p className="meta">
              {movie.releaseDate && <span>{year(movie.releaseDate)}</span>}
              {movie.runtime && <span>{runtime(movie.runtime)}</span>}
              {movie.certification && <span className={styles.cert}>{movie.certification}</span>}
              <span className={styles.rating}>
                <IconStarFilled size={13} aria-hidden /> {ratingLabel(movie.rating)}
                <span className={styles.outOf}>/ 10</span>
              </span>
            </p>

            {movie.overview && <p className={styles.overview}>{movie.overview}</p>}

            <div className={styles.actions}>
              {movie.trailerKey && (
                <button
                  className="btn btn-primary"
                  onClick={() => openTrailer({ id: movie.id, title: movie.title, trailerKey: movie.trailerKey })}
                >
                  <IconPlayerPlayFilled size={16} /> Watch trailer
                </button>
              )}
              <WatchlistButton movie={movie} />
            </div>
          </div>
        </div>
      </section>

      {movie.cast.length > 0 && (
        <Row title="Cast" variant="cast">
          {movie.cast.map((c) => {
            const src = profileUrl(c.profilePath)
            return (
              <figure key={c.id} className={styles.person}>
                <div className={styles.portrait}>
                  {src ? <FadeImage src={src} alt="" fill sizes="132px" /> : <span>{c.name.charAt(0)}</span>}
                </div>
                <figcaption>
                  <span className={styles.personName}>{c.name}</span>
                  {c.character && <span className={styles.character}>{c.character}</span>}
                </figcaption>
              </figure>
            )
          })}
        </Row>
      )}

      {movie.related.length > 0 && (
        <Row title="More like this" kicker="If you liked this" variant="poster">
          {movie.related.map((m) => (
            <PosterCard key={m.id} movie={m} />
          ))}
        </Row>
      )}
    </>
  )
}

MoviePage.overlayHeader = true

// Film pages are built on first request, then cached and refreshed daily.
export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: "blocking" })

export const getStaticProps: GetStaticProps<{ movie: MovieDetail }> = async ({ params }) => {
  const id = Number(params?.id)
  if (!Number.isInteger(id) || id <= 0) return { notFound: true }

  try {
    return { props: { movie: await movieDetail(id) }, revalidate: 86400 }
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return { notFound: true, revalidate: 3600 }
    throw err
  }
}

export default MoviePage
