import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import styles from "@/styles/Home.module.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  youtube_trailer_id: string;
  genres: string[];
  release_year: string;
}

interface Genre {
  id: number;
  name: string;
}

const Homepage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch movies with YouTube trailers
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`
      );

      const moviesWithTrailers = await Promise.all(
        response.data.results.map(async (movie: Movie) => {
          const trailerResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
          );
          const trailer = trailerResponse.data.results.find(
            (video: { type: string; site: string }) => video.type === "Trailer" && video.site === "YouTube"
          );
          return {
            ...movie,
            youtube_trailer_id: trailer ? trailer.key : "",
          };
        })
      );
      setMovies((prevMovies) => [...prevMovies, ...moviesWithTrailers]);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Fetch movie genres
  const fetchGenres = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      );
      setGenres(response.data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }, []);

  // Process movies for MovieCard compatibility
  const getProcessedMovies = useCallback(
    (movies: Movie[]) =>
      movies.map((movie) => ({
        ...movie,
        genres: movie.genre_ids.map((id) => genres.find((g) => g.id === id)?.name || "Unknown"),
        release_year: movie.release_date.split("-")[0],
      })),
    [genres]
  );

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleFilterByGenre = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setQuery(null);
    setMovies([]);
    setPage(1);
  };

  const handleSearch = (query: string) => {
    setQuery(query);
    setSelectedGenre(null);
    setMovies([]);
    setPage(1);
  };

  const filteredMovies = movies.filter((movie) => {
    if (selectedGenre && !movie.genre_ids.includes(selectedGenre)) {
      return false;
    }
    if (query && !movie.title.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    return true;
  });

  const processedMovies = getProcessedMovies(filteredMovies);

  return (
    <div>
      <Header onSearch={handleSearch} />
      <div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Filter by Genre:</label>
          <select
            onChange={(e) => handleFilterByGenre(Number(e.target.value) || null)}
            style={{ marginLeft: "1rem" }}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => (window.location.href = "/watchlist")}
          className={styles.recommendationWatchlistButton}
        >
          Watchlist
        </button>

        <div className={styles.homePageMovieCard}>
          {processedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <button
          onClick={() => setPage((prevPage) => prevPage + 1)}
          className={styles.loadMoreButton}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
};

export default Homepage;