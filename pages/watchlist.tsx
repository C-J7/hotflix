import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import styles from "@/styles/Home.module.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  youtube_trailer_id: string;
  release_date: string;
  genre_ids: number[];
}

interface Genre {
  id: number;
  name: string;
}

interface ProcessedMovie extends Movie {
  genres: string[];
  release_year: string;
}

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<ProcessedMovie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isClient, setIsClient] = useState(false);

  const fetchGenres = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      );
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }, []);

  const enhanceWatchlist = useCallback(
    (movies: Movie[]): ProcessedMovie[] =>
      movies.map((movie) => ({
        ...movie,
        genres: movie.genre_ids
          ? movie.genre_ids.map((id) => genres.find((g) => g.id === id)?.name || "Unknown")
          : [],
        release_year: movie.release_date ? movie.release_date.split("-")[0] : "N/A",
      })),
    [genres]
  );

  // Update watchlist whenever localStorage is updated
  const updateWatchlist = useCallback(() => {
    const savedWatchlist = localStorage.getItem("watchlist");
    if (savedWatchlist) {
      const watchlistData: Movie[] = JSON.parse(savedWatchlist);
      setWatchlist(enhanceWatchlist(watchlistData));
    }
  }, [enhanceWatchlist]);

  useEffect(() => {
    setIsClient(true);
    updateWatchlist();
  }, [updateWatchlist]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  // Listen for watchlist updates triggered by MovieCard
  useEffect(() => {
    const handleWatchlistUpdate = () => updateWatchlist();
    window.addEventListener("watchlistUpdated", handleWatchlistUpdate);
    return () => window.removeEventListener("watchlistUpdated", handleWatchlistUpdate);
  }, [updateWatchlist]);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header onSearch={() => {}} />
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.title}>Your Watchlist</h1>
          {watchlist.length === 0 ? (
            <p>Your watchlist is empty!</p>
          ) : (
            <div className={styles.movieGrid}>
              {watchlist.map((movie) => (
                <MovieCard key={movie.id} movie={movie} isWatchlistPage={true} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Watchlist;

