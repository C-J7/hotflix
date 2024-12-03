import { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "../components/Carousel";
import styles from "@/styles/Home.module.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  youtube_trailer_id: string;
}

const Recommendations: React.FC = () => {
  const [moodRecommendations, setMoodRecommendations] = useState<Movie[]>([]);
  const [genreRecommendations, setGenreRecommendations] = useState<Movie[]>([]);
  const [bestToday, setBestToday] = useState<Movie[]>([]);
  const [allTimeBest, setAllTimeBest] = useState<Movie[]>([]);

  // Helper to fetch movies with trailers
  const fetchMoviesWithTrailers = async (movies: any[]) => {
    return await Promise.all(
      movies.map(async (movie) => {
        const trailerResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
        );
        const trailer = trailerResponse.data.results.find(
          (video: any) => video.type === "Trailer" && video.site === "YouTube"
        );
        return {
          ...movie,
          youtube_trailer_id: trailer ? trailer.key : "",
        };
      })
    );
  };

  // Fetch All-Time Best
  const fetchAllTimeBest = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
    );
    setAllTimeBest(await fetchMoviesWithTrailers(response.data.results));
  };

  // Fetch Best Today
  const fetchBestToday = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
    );
    setBestToday(await fetchMoviesWithTrailers(response.data.results));
  };

  // Fetch Genre-Based Recommendations (e.g., Animation - genre_id 16)
  const fetchGenreRecommendations = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=16`
    );
    setGenreRecommendations(await fetchMoviesWithTrailers(response.data.results));
  };

  // Fetch Mood Recommendations (Predefined Static Happy Moods using Top Rated)
  const fetchMoodRecommendations = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
    );
    setMoodRecommendations(await fetchMoviesWithTrailers(response.data.results.slice(0, 10)));
  };

  useEffect(() => {
    fetchAllTimeBest();
    fetchBestToday();
    fetchGenreRecommendations();
    fetchMoodRecommendations();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Movie Recommendations</h1>
        <button
          onClick={() => (window.location.href = "/watchlist")}
          className={styles.watchlistButton}
        >
          Go to Watchlist
        </button>
        <Carousel title="Happy" movies={moodRecommendations} />
        <Carousel title="Animation " movies={genreRecommendations} />
        <Carousel title="Best Today" movies={bestToday} />
        <Carousel title="All-Time Best" movies={allTimeBest} />
      </main>
    </div>
  );
};

export default Recommendations;




