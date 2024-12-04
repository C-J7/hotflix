import { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "../components/Carousel"; // Carousel Component
import styles from "@/styles/Home.module.css";
import Header from "@/components/Header";

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
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);

  // Helper Function: Fetch movies with trailers
  const fetchMoviesWithTrailers = async (movies: Movie[]) => {
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

  // Fetch all movie data categories
  const fetchAllTimeBest = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
    );
    setAllTimeBest(await fetchMoviesWithTrailers(response.data.results));
  };

  const fetchBestToday = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
    );
    setBestToday(await fetchMoviesWithTrailers(response.data.results));
  };

  const fetchGenreRecommendations = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=16`
    );
    setGenreRecommendations(await fetchMoviesWithTrailers(response.data.results));
  };

  const fetchMoodRecommendations = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
    );
    setMoodRecommendations(await fetchMoviesWithTrailers(response.data.results.slice(0, 10)));
  };

  const fetchActionMovies = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=28`
    );
    setActionMovies(await fetchMoviesWithTrailers(response.data.results));
  };

  const fetchComedyMovies = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=35`
    );
    setComedyMovies(await fetchMoviesWithTrailers(response.data.results));
  };

  useEffect(() => {
    fetchAllTimeBest();
    fetchBestToday();
    fetchGenreRecommendations();
    fetchMoodRecommendations();
    fetchActionMovies();
    fetchComedyMovies();
  }, []);

  return (
    <div>
      <Header onSearch={() => {}} />
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.recommendationTitle}>Movie Recommendations</h1>
          <button
            onClick={() => (window.location.href = "/watchlist")}
            className={styles.recommendationWatchlistButton}
          >
            Go to Watchlist
          </button>

          {/* Each Carousel limited to 3 movies at a time */}
          <Carousel title="Happy" movies={moodRecommendations.slice(0, 10)} />
          <Carousel title="Animation" movies={genreRecommendations.slice(0, 10)} />
          <Carousel title="Best Today" movies={bestToday.slice(0, 10)} />
          <Carousel title="All-Time Best" movies={allTimeBest.slice(0, 10)} />
          <Carousel title="Action" movies={actionMovies.slice(0, 10)} />
          <Carousel title="Comedy" movies={comedyMovies.slice(0, 10)} />
          </main>
      </div>
    </div>
  );
};

export default Recommendations;

