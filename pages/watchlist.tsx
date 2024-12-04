import { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/Home.module.css";
import Header from "@/components/Header";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  youtube_trailer_id: string; // Store YouTube trailer ID here
}

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [isClient, setIsClient] = useState(false); // Track if we are on the client-side

  useEffect(() => {
    // Set to true once the component is mounted on the client side
    setIsClient(true);

    // Fetch the watchlist from localStorage after the component mounts
    const savedWatchlist = localStorage.getItem("watchlist");
    if (savedWatchlist) {
      const watchlistData = JSON.parse(savedWatchlist);

      // Fetch trailer video ID for each movie in the watchlist
      const fetchTrailerIds = async () => {
        const updatedWatchlist = await Promise.all(
          watchlistData.map(async (movie: Movie) => {
            try {
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
            } catch (error) {
              console.error("Error fetching trailer for movie:", error);
              return movie;
            }
          })
        );
        setWatchlist(updatedWatchlist); // Update state with movie data including trailer ID
      };

      fetchTrailerIds();
    }
  }, []);

  // Ensure the component only renders once the client-side logic is done
  if (!isClient) {
    return <div>Loading...</div>; // Show loading during SSR
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
              <div key={movie.id} className={styles.movieCard}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className={styles.moviePoster}
                />
                <h3>{movie.title}</h3>

                {/* Watch Preview Button */}
                <button
                  onClick={() =>
                    window.location.href = `/streaming?video_id=${movie.youtube_trailer_id}`
                  }
                  className={styles.watchlistPreviewButton}
                >
                  Preview
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
    </div>
  );
};

export default Watchlist;


