import React from 'react';
import MovieCard from './MovieCard';

export default function MovieGrid({
  movies,
  favorites,
  watchlist,
  onToggleFavorite,
  onToggleWatchlist,
  onCardClick
}) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          isFavorite={favorites.some(f => f.imdbID === movie.imdbID)}
          isInWatchlist={watchlist.some(w => w.imdbID === movie.imdbID)}
          onToggleFavorite={onToggleFavorite}
          onToggleWatchlist={onToggleWatchlist}
          onCardClick={onCardClick} // 👈 Pass click handler
        />
      ))}
    </div>
  );
}
