import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './MovieDetail.css'; // Optional: Create this CSS file for styling


export default function MovieDetail() {
  const { id } = useParams(); // Get :id from URL
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?i=${id}&apikey=1e72973d`
        );
        if (response.data.Response === 'True') {
          setMovie(response.data);
          setError(null);
        } else {
          setError('Movie not found!');
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to fetch movie details.');
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <p>{error}</p>
        <Link to="/">← Go Back</Link>
      </div>
    );
  }

  if (!movie) {
    return <p style={{ textAlign: 'center' }}>Loading movie details...</p>;
  }

  return (
    <div className="movie-detail-container">
      <Link to="/" className="back-link">← Back to Home</Link>
      <div className="movie-detail">
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x445?text=No+Image'}
          alt={movie.Title}
          className="movie-poster"
        />
        <div className="movie-info">
          <h2>{movie.Title}</h2>
          <p><strong>Year:</strong> {movie.Year}</p>
          <p><strong>Genre:</strong> {movie.Genre}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Actors:</strong> {movie.Actors}</p>
          <p><strong>Plot:</strong> {movie.Plot}</p>
          <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
          <p><strong>Runtime:</strong> {movie.Runtime}</p>
          <p><strong>Language:</strong> {movie.Language}</p>
        </div>
      </div>
    </div>
  );
}
