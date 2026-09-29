import Link from "next/link"
import { IconPlayerPlayFilled, IconStarFilled } from "@tabler/icons-react"
import FadeImage from "./FadeImage"
import WatchlistButton from "./WatchlistButton"
import { useTrailer } from "./Trailer"
import { backdropUrl, genreList, posterUrl, ratingLabel, year } from "@/lib/format"
import type { Movie } from "@/lib/types"
import styles from "@/styles/Card.module.css"

function Actions({ movie }: { movie: Movie }) {
  const openTrailer = useTrailer()
  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.play}
        aria-label={`Play ${movie.title} trailer`}
        title="Play trailer"
        onClick={() => openTrailer({ id: movie.id, title: movie.title })}
      >
        <IconPlayerPlayFilled size={15} />
      </button>
      <WatchlistButton movie={movie} variant="icon" />
    </div>
  )
}

function Rating({ value }: { value: number }) {
  return (
    <span className={styles.rating}>
      <IconStarFilled size={11} aria-hidden />
      {ratingLabel(value)}
    </span>
  )
}

function Fallback({ title }: { title: string }) {
  return <div className={styles.fallback}>{title}</div>
}

export function PosterCard({ movie, priority = false }: { movie: Movie; priority?: boolean }) {
  const src = posterUrl(movie.posterPath, "w342")
  return (
    <article className={styles.card} data-variant="poster">
      <div className={`${styles.media} ${styles.poster}`}>
        {src ? (
          <FadeImage src={src} alt="" fill sizes="(max-width: 640px) 40vw, 200px" priority={priority} className={styles.img} />
        ) : (
          <Fallback title={movie.title} />
        )}
        <Actions movie={movie} />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link href={`/movie/${movie.id}`} className={styles.link}>
            {movie.title}
          </Link>
        </h3>
        <p className="meta">
          {movie.releaseDate && <span>{year(movie.releaseDate)}</span>}
          <Rating value={movie.rating} />
        </p>
      </div>
    </article>
  )
}

export function BackdropCard({ movie }: { movie: Movie }) {
  const src = backdropUrl(movie.backdropPath, "w780")
  const genres = genreList(movie.genreIds, 2)
  return (
    <article className={styles.card} data-variant="backdrop">
      <div className={`${styles.media} ${styles.backdrop}`}>
        {src ? (
          <FadeImage src={src} alt="" fill sizes="(max-width: 640px) 75vw, 380px" className={styles.img} />
        ) : (
          <Fallback title={movie.title} />
        )}
        <Actions movie={movie} />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link href={`/movie/${movie.id}`} className={styles.link}>
            {movie.title}
          </Link>
        </h3>
        <p className="meta">
          {movie.releaseDate && <span>{year(movie.releaseDate)}</span>}
          {genres.length > 0 && <span>{genres.join(", ")}</span>}
          <Rating value={movie.rating} />
        </p>
      </div>
    </article>
  )
}

export function RankedCard({ movie, rank }: { movie: Movie; rank: number }) {
  const src = posterUrl(movie.posterPath, "w342")
  return (
    <article className={`${styles.card} ${styles.ranked}`} data-variant="ranked">
      <span className={styles.rank} aria-hidden>
        {rank}
      </span>
      <div className={`${styles.media} ${styles.poster} ${styles.rankedMedia}`}>
        {src ? (
          <FadeImage src={src} alt="" fill sizes="(max-width: 640px) 34vw, 170px" className={styles.img} />
        ) : (
          <Fallback title={movie.title} />
        )}
        <Actions movie={movie} />
        <Link href={`/movie/${movie.id}`} className={styles.link}>
          <span className="visually-hidden">
            Number {rank}: {movie.title}
          </span>
        </Link>
      </div>
    </article>
  )
}
