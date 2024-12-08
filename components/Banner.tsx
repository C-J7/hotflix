import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/Home.module.css";

// Define the type for the movie object
interface Movie {
  backdrop_path: string | null; // Some movies might not have a backdrop
}

const Banner: React.FC = () => {
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        );

        // Explicitly type response.data.results
        const images = response.data.results
          .filter((movie: Movie) => movie.backdrop_path) // Ensure there's a valid backdrop
          .map((movie: Movie) => `https://image.tmdb.org/t/p/original${movie.backdrop_path}`);
        setBackgroundImages(images);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 15000); // Change image every 15 seconds

    return () => clearInterval(interval);
  }, [backgroundImages]);

  return (
    <div
      className={styles.banner}
      style={{
        backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
      }}
    >
      {backgroundImages.length === 0 && <p>Loading...</p>}
    </div>
  );
};

export default Banner;