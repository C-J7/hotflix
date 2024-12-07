import React from 'react';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import styles from '@/styles/MovieCard.module.css';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    youtube_trailer_id: string;
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const router = useRouter();

  const handleClick = () => {
    if (movie.youtube_trailer_id) {
      router.push(`/streaming?video_id=${movie.youtube_trailer_id}`);
    }
  };

  return (
    <div className={styles.movieCard} onClick={handleClick}>
      <img 
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
        alt={movie.title} 
        className={styles.moviePoster} 
      />
      <div className={styles.overlay}>
        <IconPlayerPlayFilled size={48} color="white" />
      </div>
      <div className={styles.movieInfo}>
        <h3 className={styles.movieTitle}>{movie.title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;