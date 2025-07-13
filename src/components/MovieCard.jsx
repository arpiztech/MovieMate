
 import React from 'react';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import './MovieCard.css';
import { Link } from 'react-router-dom';

export default function MovieCard({
  movie,
  isFavorite,
  isInWatchlist,
  onToggleFavorite,
  onToggleWatchlist
}) {
  return (
    <div className="movie-card">
      <div className="poster-wrapper">
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}
          alt={movie.Title}
        />
        <div className="card-actions">
          <button
            className="favorite-icon"
            onClick={() => onToggleFavorite(movie)}
            aria-label="Toggle Favorite"
          >
            {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
          </button>
        </div>
      </div>

      <Link
        to={`/movie/${movie.imdbID}`}
        className="movie-details"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <h3>{movie.Title}</h3>
        <p><strong>Year:</strong> {movie.Year}</p>
        <p><strong>Type:</strong> {movie.Type}</p>
      </Link>
    </div>
  );
}
