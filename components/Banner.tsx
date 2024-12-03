import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/Home.module.css';

const Banner: React.FC = () => {
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        );
        const images = response.data.results.map((movie: any) => `https://image.tmdb.org/t/p/original${movie.backdrop_path}`);
        setBackgroundImages(images);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 30000); // Change image every minute

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