import React, { useState } from "react";
import { IconPlayerPlayFilled, IconPlus, IconMinus } from "@tabler/icons-react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "@/styles/MovieCard.module.css";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    youtube_trailer_id: string;
    genres: string[];
    release_year: string;
  };
  isWatchlistPage?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isWatchlistPage = false }) => {
  const router = useRouter();
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);

  const handlePlayClick = () => {
    if (movie.youtube_trailer_id) {
      router.push(`/streaming?video_id=${movie.youtube_trailer_id}`);
    }
  };

  const handleRemoveFromWatchlist = () => {
    try {
      const savedWatchlist = localStorage.getItem("watchlist");
      if (savedWatchlist) {
        let watchlist = JSON.parse(savedWatchlist);
        watchlist = watchlist.filter((item: typeof movie) => item.id !== movie.id);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        window.dispatchEvent(new Event("watchlistUpdated")); // Notify watchlist page
        setTooltipMessage("Removed from Watchlist");
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      setTooltipMessage("Failed to Remove from Watchlist");
    } finally {
      setTimeout(() => setTooltipMessage(null), 3000);
    }
  };
  const primaryGenre = movie.genres?.[0] || "Unknown Genre";
  return (
    <div className={styles.movieCard}>
      {/* Genre and Release Year */}
      <div className={styles.topInfo}>
        <span className={styles.genre}>{primaryGenre}</span>
        <span className={styles.releaseYear}>{movie.release_year}</span>
      </div>

      {/* Movie Poster */}
      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className={styles.moviePoster}
        width={400}
        height={450}
        priority
      />

      {/* Tooltip */}
      {tooltipMessage && <div className={styles.tooltip}>{tooltipMessage}</div>}

      {/* Play Button */}
      <div className={styles.overlay} onClick={handlePlayClick}>
        <IconPlayerPlayFilled size={48} color="white" />
      </div>

      {/* Add/Remove Watchlist Button */}
      <div
        className={styles.addOverlay}
        onClick={isWatchlistPage ? handleRemoveFromWatchlist : undefined}
      >
        {isWatchlistPage ? (
          <IconMinus size={22} color="white" />
        ) : (
          <IconPlus size={22} color="white" />
        )}
      </div>

      {/* Movie Title */}
      <div className={styles.movieInfo}>
        <h3 className={styles.movieTitle}>{movie.title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;