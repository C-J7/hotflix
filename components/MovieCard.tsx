import React, { useState } from "react";
import { IconPlayerPlayFilled, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";
import Image from "next/image"; // Use Next.js Image component
import styles from "@/styles/MovieCard.module.css";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    youtube_trailer_id: string;
    genres: string[]; // Array of genres
    release_year: string; // Release year
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const router = useRouter();
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);

  const handlePlayClick = () => {
    if (movie.youtube_trailer_id) {
      router.push(`/streaming?video_id=${movie.youtube_trailer_id}`);
    }
  };

  const handleAddToWatchlist = () => {
    try {
      const savedWatchlist = localStorage.getItem("watchlist");
      const watchlist = savedWatchlist ? JSON.parse(savedWatchlist) : []; // Changed to `const`

      if (!watchlist.some((item: typeof movie) => item.id === movie.id)) {
        watchlist.push(movie);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        setTooltipMessage("Added to Watchlist");
      } else {
        setTooltipMessage("Already in Watchlist");
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      setTooltipMessage("Failed to Add to Watchlist");
    } finally {
      setTimeout(() => setTooltipMessage(null), 3000); // Clears the tooltip after 3 seconds
    }
  };

  return (
    <div className={styles.movieCard}>
      {/* Genre and Release Year */}
      <div className={styles.topInfo}>
        <span className={styles.genre}>{movie.genres.join(", ")}</span>
        <span className={styles.releaseYear}>{movie.release_year}</span>
      </div>

      {/* Movie Poster */}
      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className={styles.moviePoster}
        width={300} // Adjust width
        height={450} // Adjust height
        priority // Optimize for faster loading
      />

      {/* Tooltip */}
      {tooltipMessage && <div className={styles.tooltip}>{tooltipMessage}</div>}

      {/* Play Button */}
      <div className={styles.overlay} onClick={handlePlayClick}>
        <IconPlayerPlayFilled size={48} color="white" />
      </div>

      {/* Add to Watchlist Button */}
      <div className={styles.addOverlay} onClick={handleAddToWatchlist}>
        <IconPlus size={22} color="white" />
      </div>

      {/* Movie Title */}
      <div className={styles.movieInfo}>
        <h3 className={styles.movieTitle}>{movie.title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;