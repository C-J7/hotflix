import { useRouter } from "next/router";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { IconPlayerPlay } from "@tabler/icons-react";
import styles from "@/styles/Streaming.module.css";

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
  const { video_id } = router.query; // TMDB movie ID
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  const fetchMovieDetails = async (movieId: string) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
          },
        }
      );
      const data: Movie = await response.json();
      setMovieDetails(data);

      const similarResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
          },
        }
      );
      const similarData = await similarResponse.json();
      setSimilarMovies(similarData.results || []);
    } catch (error) {
      console.error("Error fetching movie details or similar movies:", error);
    }
  };

  useEffect(() => {
    if (video_id) {
      fetchMovieDetails(video_id as string);
    }
  }, [video_id]);

  if (!video_id) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>{movieDetails?.title || "Streaming"} - Hotflix</title>
      </Head>
      <div className={styles.streamingContainer}>
        <h1 className={styles.title}>{movieDetails?.title || "Streaming Movie"}</h1>

        <iframe
          className={styles.videoPlayer}
          src={`https://www.youtube.com/embed/${video_id}?autoplay=1`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>

        {movieDetails && (
          <div className={styles.movieDetails}>
            <h2>About the Movie</h2>
            <p>
              <strong>Release Date:</strong>{" "}
              {movieDetails.release_date || "N/A"}
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {movieDetails.genres?.map((g) => g.name).join(", ") || "Unknown"}
            </p>
            <p>
              <strong>Overview:</strong>{" "}
              {movieDetails.overview || "No description available."}
            </p>

            <button
              className={styles.watchOnSuperembed}
              onClick={() => {
                if (movieDetails.id) {
                  window.location.href = `https://multiembed.mov/?video_id=${movieDetails.id}&tmdb=1`;
                }
              }}
            >
              <IconPlayerPlay size={20} />
              <span>Watch on Superembed</span>
            </button>
          </div>
        )}

        <div className={styles.similarMovies}>
          <h2>Similar Movies</h2>
          <div className={styles.moviesContainer}>
            {similarMovies.length > 0 ? (
              similarMovies.map((movie) => (
                <div key={movie.id} className={styles.movieCard}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className={styles.moviePoster}
                  />
                  <p className={styles.movieTitle}>{movie.title}</p>
                </div>
              ))
            ) : (
              <p>No similar movies found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Streaming;