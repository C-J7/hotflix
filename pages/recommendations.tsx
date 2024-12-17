import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import { IconClipboardList } from "@tabler/icons-react";
import styles from "@/styles/Home.module.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  youtube_trailer_id: string;
}

interface EnhancedMovie extends Movie {
  genres: string[];
  release_year: string;
}

interface Genre {
  id: number;
  name: string;
}

const Recommendations: React.FC = () => {
  const [moodRecommendations, setMoodRecommendations] = useState<EnhancedMovie[]>([]);
  const [genreRecommendations, setGenreRecommendations] = useState<EnhancedMovie[]>([]);
  const [bestToday, setBestToday] = useState<EnhancedMovie[]>([]);
  const [allTimeBest, setAllTimeBest] = useState<EnhancedMovie[]>([]);
  const [actionMovies, setActionMovies] = useState<EnhancedMovie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<EnhancedMovie[]>([]);
  const [genreMapping, setGenreMapping] = useState<Record<number, string>>({});

  
  const fetchGenres = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      );
      const genres = response.data.genres;
      const mapping = genres.reduce((acc: Record<number, string>, genre: Genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
      setGenreMapping(mapping);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }, []);

  const fetchMoviesWithTrailers = useCallback(
    async (movies: Movie[]): Promise<EnhancedMovie[]> => {
      return await Promise.all(
        movies.map(async (movie) => {
          try {
            const trailerResponse = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
            );
            const trailer = trailerResponse.data.results.find(
              (video: { type: string; site: string }) => video.type === "Trailer" && video.site === "YouTube"
            );
            return {
              ...movie,
              youtube_trailer_id: trailer ? trailer.key : "",
              genres: movie.genre_ids.map((id) => genreMapping[id] || "Unknown"),
              release_year: movie.release_date?.split("-")[0] || "N/A",
            };
          } catch (error) {
            console.error(`Error fetching trailer for movie ID ${movie.id}:`, error);
            return {
              ...movie,
              youtube_trailer_id: "",
              genres: movie.genre_ids.map((id) => genreMapping[id] || "Unknown"),
              release_year: movie.release_date?.split("-")[0] || "N/A",
            };
          }
        })
      );
    },
    [genreMapping]
  );

  const fetchMovies = useCallback(async () => {
    try {
      const [allTimeRes, trendingRes, genreRes, moodRes, actionRes, comedyRes] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        ),
        axios.get(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        ),
        axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=16`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        ),
        axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=28`
        ),
        axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=35`
        ),
      ]);

      setAllTimeBest(await fetchMoviesWithTrailers(allTimeRes.data.results));
      setBestToday(await fetchMoviesWithTrailers(trendingRes.data.results));
      setGenreRecommendations(await fetchMoviesWithTrailers(genreRes.data.results));
      setMoodRecommendations(await fetchMoviesWithTrailers(moodRes.data.results.slice(0, 10)));
      setActionMovies(await fetchMoviesWithTrailers(actionRes.data.results));
      setComedyMovies(await fetchMoviesWithTrailers(comedyRes.data.results));
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }, [fetchMoviesWithTrailers]);

  useEffect(() => {
    fetchGenres(); 
  }, [fetchGenres]);

  useEffect(() => {
    if (Object.keys(genreMapping).length > 0) {
      fetchMovies(); 
    }
  }, [genreMapping, fetchMovies]);

  return (
    <div className={`${styles.page} bg-black text-white min-h-screen`}>
      <Header onSearch={() => {}} />
      <main className={`${styles.main} container mx-auto px-4 py-8`}>
        <div className="flex justify-between items-center mb-8 w-full">
          <h1 className={`${styles.recommendationTitle} text-white`}>Recommendations</h1>
          <button
            onClick={() => (window.location.href = "/watchlist")}
            className={`${styles.recommendationWatchlistButton} flex items-center space-x-2`}
          >
            <IconClipboardList size={24} />
            <span>My Watchlist</span>
          </button>
        </div>

        <div className="space-y-8">
          <Carousel title="Trending Now" movies={bestToday} />
          <Carousel title="Top Picks" movies={moodRecommendations} />
          <Carousel title="Animation Favorites" movies={genreRecommendations} />
          <Carousel title="All-Time Classics" movies={allTimeBest} />
          <Carousel title="Action Packed" movies={actionMovies} />
          <Carousel title="Comedy Corner" movies={comedyMovies} />
        </div>
      </main>
    </div>
  );
};

export default Recommendations;