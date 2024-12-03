import React, { useState, useEffect } from "react";
import axios from "axios";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  youtube_trailer_id: string;
}

interface Genre {
  id: number;
  name: string;
}

const Homepage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]); // Added for filtering by genre
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [page, setPage] = useState(1); // Added for pagination

   // Fetch movies from TMDB API
   const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`
      );
      const moviesWithTrailers = await Promise.all(
        response.data.results.map(async (movie: Movie) => {
          // Fetch movie trailer
          const trailerResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
          );
          const trailer = trailerResponse.data.results.find(
            (video: any) => video.type === "Trailer" && video.site === "YouTube"
          );
          return {
            ...movie,
            youtube_trailer_id: trailer ? trailer.key : "", // Store YouTube trailer key
          };
        })
      );
      setMovies((prevMovies) => [...prevMovies, ...moviesWithTrailers]);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Fetch genres for filtering
  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      );
      setGenres(response.data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchGenres(); // Fetch genres once
  }, [page]);

  // Handle filtering by genre
  const handleFilterByGenre = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setMovies([]); // Clear previous results
    setPage(1); // Reset pagination
  };

  // Filter movies based on selected genre
  const filteredMovies = selectedGenre
    ? movies.filter((movie) => movie.genre_ids.includes(selectedGenre))
    : movies;

  // Handle adding movies to Watchlist
  const handleAddToWatchlist = (movie: Movie) => {
    const savedWatchlist = localStorage.getItem("watchlist");
    let watchlist = savedWatchlist ? JSON.parse(savedWatchlist) : [];

    // Check if the movie is already in the watchlist
    if (!watchlist.some((item: Movie) => item.id === movie.id)) {
      watchlist.push(movie);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      alert(`${movie.title} added to watchlist!`);
    } else {
      alert(`${movie.title} is already in your watchlist.`);
    }
  };

  return (
    <div>
      {/* Filter Bar for Genre */}
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

       {/* Watchlist Button */}
       <button
        onClick={() => (window.location.href = "/watchlist")}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#e50914",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Watchlist
      </button>

      <div
        style={{
          padding: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            style={{
              backgroundColor: "#333",
              color: "white",
              borderRadius: "8px",
              overflow: "hidden",
              textAlign: "center",
              padding: "1rem",
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
            <h3 style={{ margin: "1rem 0" }}>{movie.title}</h3>
            {/* Display Genre */}
            <p>
              Genres:{" "}
              {movie.genre_ids
                .map((id) => genres.find((genre) => genre.id === id)?.name)
                .join(", ")}
            </p>



                {/* Watch Preview Button */}
                <button
              onClick={() =>
                window.location.href = `/streaming?video_id=${movie.youtube_trailer_id}`
              }
              style={{
                backgroundColor: "#FFD700",
                color: "black",
                border: "none",
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Watch Preview
            </button>




            {/* Add to Watchlist Button */}
            <button
              onClick={() => handleAddToWatchlist(movie)}
              style={{
                backgroundColor: "#e50914",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add to Watchlist
            </button>
          </div>
        ))}
      </div>

      {/* Pagination: Load More Button */}
      <button
        onClick={() => setPage((prevPage) => prevPage + 1)}
        style={{
          margin: "1rem auto",
          display: "block",
          padding: "0.5rem 1rem",
          backgroundColor: "#333",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Load More
      </button>
    </div>
  );
};

export default Homepage;

