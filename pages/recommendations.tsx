import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import { IconClipboardList } from '@tabler/icons-react';
import styles from '@/styles/Home.module.css';

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

  // Fetch movie categories from TMDB API
  const fetchMovies = async () => {
    try {
      const [allTimeRes, trendingRes, genreRes, moodRes, actionRes, comedyRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`),
        axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`),
        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=16`),
        axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`),
        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=28`),
        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=35`)
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
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className={`${styles.page} bg-black text-white min-h-screen`}>
      <Header onSearch={() => {}} />
      <main className={`${styles.main} container mx-auto px-4 py-8`}>
        <div className="flex justify-between items-center mb-8 w-full">
          <h1 className={`${styles.recommendationTitle} text-white`}>Recommendations</h1>
          <button 
            onClick={() => window.location.href = "/watchlist"}
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