import Link from "next/link"
import { useState } from "react"
import { IconArrowUpRight, IconPlayerPlayFilled, IconStarFilled } from "@tabler/icons-react"
import FadeImage from "./FadeImage"
import WatchlistButton from "./WatchlistButton"
import { useTrailer } from "./Trailer"
import { backdropUrl, genreList, ratingLabel, year } from "@/lib/format"
import type { Movie } from "@/lib/types"
import styles from "@/styles/Hero.module.css"

const pad = (n: number) => String(n).padStart(2, "0")

export default function Hero({ movies, kicker = "Tonight's Pick" }: { movies: Movie[]; kicker?: string }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const openTrailer = useTrailer()

  if (movies.length === 0) return null
  const movie = movies[index]
  const genres = genreList(movie.genreIds, 3)

  const advance = () => {
    // Under reduced motion the progress animation ends instantly; don't let that auto-advance.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setIndex((i) => (i + 1) % movies.length)
  }

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label={kicker}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false)
      }}
    >
      {/* Ambient wash: a tiny, heavily blurred copy of the current backdrop tints the whole section. */}
      <div className={styles.ambient} aria-hidden>
        {movies.map((m, i) => {
          const src = backdropUrl(m.backdropPath, "w300")
          return src ? <FadeImage key={m.id} src={src} alt="" fill sizes="300px" data-active={i === index} className={styles.ambientImg} /> : null
        })}
      </div>

      <div className={`shell ${styles.grid}`}>
        <div className={styles.frame}>
          {movies.map((m, i) => {
            const src = backdropUrl(m.backdropPath, "w1280")
            return src ? (
              <FadeImage
                key={m.id}
                src={src}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
                priority={i === 0}
                data-active={i === index}
                className={styles.slide}
              />
            ) : null
          })}
          <span className={styles.frameEdge} aria-hidden />
        </div>

        <div className={styles.copy} key={movie.id} aria-live="polite">
          <p className="kicker">
            {kicker} <span className={styles.issue}>· No. {pad(index + 1)}</span>
          </p>
          <h1 className={`display ${styles.title}`}>{movie.title}</h1>
          <p className="meta">
            {movie.releaseDate && <span>{year(movie.releaseDate)}</span>}
            {genres.length > 0 && <span>{genres.join(", ")}</span>}
            <span className={styles.rating}>
              <IconStarFilled size={12} aria-hidden /> {ratingLabel(movie.rating)}
            </span>
          </p>
          <p className={styles.overview}>{movie.overview}</p>
          <div className={styles.actions}>
            <button className="btn btn-primary" onClick={() => openTrailer({ id: movie.id, title: movie.title })}>
              <IconPlayerPlayFilled size={16} /> Watch trailer
            </button>
            <WatchlistButton movie={movie} />
            <Link href={`/movie/${movie.id}`} className={styles.details}>
              Details <IconArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        <ol className={styles.steps} aria-label="Choose a pick">
          {movies.map((m, i) => (
            <li key={m.id}>
              <button
                className={styles.step}
                data-state={i === index ? "active" : i < index ? "done" : "todo"}
                data-paused={paused}
                aria-label={`Show ${m.title}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
              >
                <span className={styles.stepNum}>{pad(i + 1)}</span>
                <span className={styles.bar}>
                  <span className={styles.fill} onAnimationEnd={i === index ? advance : undefined} />
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
