import { useRouter } from "next/router";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { IconPlayerPlay } from "@tabler/icons-react";
import styles from "@/styles/Streaming.module.css";
import axios from "axios";
import Image from "next/image";

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  genres: { id: number; name: string }[];
}

const Streaming: React.FC = () => {
  const router = useRouter();
  const { video_id, trailer_id } = router.query; // Fetch both IDs
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  const fetchMovieDetails = async (movieId: number) => {
    try {
      // Fetch movie details
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      );
      setMovieDetails(response.data);
  
      // Fetch similar movies
      const similarResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
      );
      setSimilarMovies(similarResponse.data.results || []);
    } catch (error) {
      console.error("Error fetching movie details or similar movies:", error);
    }
  };

  useEffect(() => {
    if (video_id) {
      fetchMovieDetails(Number(video_id));
    }
  }, [video_id]);

  if (!video_id || !trailer_id) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>{movieDetails?.title || "Streaming"} - Hotflix</title>
      </Head>
      <div className={styles.streamingContainer}>
        <h1 className={styles.title}>{movieDetails?.title || "Streaming Movie"}</h1>

        {/* YouTube Trailer */}
        <iframe
          className={styles.videoPlayer}
          src={`https://www.youtube.com/embed/${trailer_id}?autoplay=1`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>

        {/* Movie Details */}
        {movieDetails && (
          <div className={styles.movieDetails}>
            <h2 className={`${styles.spacing} ${styles.title}`}>About the Movie</h2> 
            <p className={styles.spacing}>
              <strong>Release Date:</strong> {movieDetails.release_date || "N/A"}
            </p>
            <p className={styles.spacing}>
              <strong>Genres:</strong>{" "}
              {movieDetails.genres?.map((g) => g.name).join(", ") || "Unknown"}
            </p>
            <p className={styles.spacing}>
              <strong>Overview:</strong>{" "}
              {movieDetails.overview || "No description available."}
            </p>

            {/* Watch on Superembed */}
            <button
              className={styles.watchOnSuperembed}
              onClick={() => {
                window.location.href = `https://multiembed.mov/?video_id=${video_id}&tmdb=1`;
              }}
            >
              <IconPlayerPlay size={20} />
              <span>Watch Now</span>
            </button>
          </div>
        )}

        {/* Similar Movies */}
<div className={styles.similarMovies}>
  <h2 className={styles.title}>Similar Movies</h2>
  <div className={styles.sliderContainer}>
    {/* Left Button */}
    <button
      className={`${styles.sliderButton} ${styles.leftButton}`}
      onClick={() => {
        const container = document.querySelector(`.${styles.moviesContainer}`);
        if (container) container.scrollLeft -= 300;
      }}
      aria-label="Scroll Left"
    >
      &#8249;
    </button>

    {/* Slider */}
    <div className={styles.moviesContainer}>
      {similarMovies.length > 0 ? (
        similarMovies.map((movie) => (
          <div key={movie.id} className={styles.movieCard}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className={styles.moviePoster}
              layout="responsive"
              width={300}  // Intrinsic width
              height={450} // Intrinsic height
              priority
            />
            <p className={styles.movieTitle}>{movie.title}</p>
          </div>
        ))
      ) : (
        <p>No similar movies found.</p>
      )}
    </div>

    {/* Right Button */}
    <button
      className={`${styles.sliderButton} ${styles.rightButton}`}
      onClick={() => {
        const container = document.querySelector(`.${styles.moviesContainer}`);
        if (container) container.scrollLeft += 300;
      }}
      aria-label="Scroll Right"
    >
      &#8250;
    </button>
  </div>
</div>
      </div>
    </>
  );
};

export default Streaming;