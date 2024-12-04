import React from "react";
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5"; 
import styles from "@/styles/Carousel.module.css";

interface CarouselProps {
  title: string;
  movies: Array<{
    id: number;
    title: string;
    poster_path: string;
    youtube_trailer_id: string;
  }>;
}

const Carousel: React.FC<CarouselProps> = ({ title, movies }) => {
  const scrollLeft = () => {
    const container = document.getElementById(title);
    container?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    const container = document.getElementById(title);
    container?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.carouselTitle}>{title}</h2>

      <div className={styles.carouselWrapper}>
        {/* Left Scroll Button */}
        <IoChevronBackCircle
          className={styles.navButtonLeft}
          onClick={scrollLeft}
        />

        {/* Movie Scroll Area */}
        <div id={title} className={styles.scrollContainer}>
          {movies.map((movie) => (
            <div key={movie.id} className={styles.carouselItem}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className={styles.moviePoster}
              />
              <h3 className={styles.movieTitle}>{movie.title}</h3>
              <button
                className={styles.previewButton}
                onClick={() =>
                  (window.location.href = `/streaming?video_id=${movie.youtube_trailer_id}`)
                }
              >
                Watch Preview
              </button>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <IoChevronForwardCircle
          className={styles.navButtonRight}
          onClick={scrollRight}
        />
      </div>
    </div>
  );
};

export default Carousel;
