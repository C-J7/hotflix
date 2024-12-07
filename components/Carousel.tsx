import React, { useRef } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import MovieCard from "./MovieCard";
import styles from "@/styles/Carousel.module.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  youtube_trailer_id: string;
  genres: string[]; // Include genres as an array of strings
  release_year: string; // Include release year
}

interface CarouselProps {
  title: string;
  movies: Movie[]; 
}

const Carousel: React.FC<CarouselProps> = ({ title, movies }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth;
      const offset = direction === "left" ? -scrollAmount : scrollAmount;
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.header}>
        <h2 className={styles.carouselTitle}>{title}</h2>
        <div className={styles.navButtons}>
          <button onClick={() => scroll("left")} className={styles.navButton}>
            <IconChevronLeft size={24} />
          </button>
          <button onClick={() => scroll("right")} className={styles.navButton}>
            <IconChevronRight size={24} />
          </button>
        </div>
      </div>

      <div ref={carouselRef} className={styles.carouselWrapper}>
        {movies.map((movie) => (
          <div key={movie.id} className={styles.carouselItem}>
            {/* Pass full movie data to MovieCard */}
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;