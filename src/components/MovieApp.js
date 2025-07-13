
import React, { useEffect, useState, useRef } from 'react';
import './MovieApp.css';
import axios from 'axios';
import { FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import MovieGrid from './MovieGrid';

export default function MovieApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [watchlist, setWatchlist] = useState(() => {
    const stored = localStorage.getItem('watchlist');
    return stored ? JSON.parse(stored) : [];
  });
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const cacheRef = useRef({});
  const inputRef = useRef(null);

  const genreList = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Science Fiction',
    'Romance', 'Thriller', 'Adventure', 'Animation', 'Fantasy', 'Crime'
  ];

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const query = searchQuery || selectedGenre;

        // 🔧 Use cached result if available
        if (cacheRef.current[query]) {
          setMovies(cacheRef.current[query]);
          setError(null);
          setLoading(false);
          return;
        }

        const res = await axios.get(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=1e72973d`);
        if (res.data.Response === 'True') {
          const detailed = await Promise.all(
            res.data.Search.map(async (movie) => {
              const detail = await axios.get(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=1e72973d`);
              return detail.data;
            })
          );
          let result = detailed.filter(m => m.Poster && m.Poster !== 'N/A');

          if (selectedGenre) {
            result = result.filter(m => m.Genre && m.Genre.toLowerCase().includes(selectedGenre.toLowerCase()));
          }

          // Cache the result
          cacheRef.current[query] = result;

          setMovies(result);
          setError(result.length === 0 ? 'No movies match your filters.' : null);
        } else {
          setMovies([]);
          setError('No results found.');
        }
      } catch {
        setError('Failed to fetch movies.');
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery || selectedGenre) {
      fetchMovies();
    } else if (activeSection === 'home') {
      const fetchDefaultMovies = async () => {
        const titles = ['The Wall', 'Dilwale', 'Twilight', 'Dil', 'Titanic', 'Sanam Teri Kasam',
          'Avengers', 'Batman', 'Spiderman', 'Wick Is Pain', 'AnnaBelle', 'The Human Centipede 2', 'Get out', 'The Chekist', 'Umar 55 Ki Dil Bachpan Ka'];
        setLoading(true);
        try {
          const allMovies = [];
          for (const title of titles) {
            const res = await axios.get(`https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=1e72973d`);
            if (res.data.Response === 'True') {
              const moviesWithPosters = res.data.Search.filter(m => m.Poster && m.Poster !== 'N/A');
              allMovies.push(...moviesWithPosters);
            }
          }
          setMovies(allMovies);
          setError(null);
        } catch {
          setError('Failed to load default movies.');
        } finally {
          setLoading(false);
        }
      };
      fetchDefaultMovies();
    }
  }, [searchQuery, selectedGenre, activeSection]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      const titles = ['Avengers', 'Inception', 'The Dark Knight', 'Interstellar', 'Titanic'];
      const fetchedMovies = [];

      for (const title of titles) {
        const res = await axios.get(`https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=1e72973d`);
        if (res.data.Response === 'True') {
          const detailed = await Promise.all(
            res.data.Search.map(async (movie) => {
              const detail = await axios.get(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=1e72973d`);
              return detail.data;
            })
          );
          fetchedMovies.push(...detailed.filter(m => m.Poster && m.Poster !== 'N/A'));
        }
      }

      setMovies(fetchedMovies);
    };

    if (activeSection === 'popular') {
      fetchPopularMovies();
    }
  }, [activeSection]);

  const toggleFavorite = (movie) => {
    let updated;
    if (favorites.find(f => f.imdbID === movie.imdbID)) {
      updated = favorites.filter(f => f.imdbID !== movie.imdbID);
    } else {
      updated = [...favorites, movie];
    }
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const toggleWatchlist = (movie) => {
    let updated;
    if (watchlist.find(w => w.imdbID === movie.imdbID)) {
      updated = watchlist.filter(w => w.imdbID !== movie.imdbID);
    } else {
      updated = [...watchlist, movie];
    }
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  const getDisplayedMovies = () => {
    if (activeSection === 'favorites') return favorites;
    if (activeSection === 'watchlist') return watchlist;
    return movies;
  };

  const handleCardClick = (movie) => {
    if (!watchlist.find(w => w.imdbID === movie.imdbID)) {
      const updated = [...watchlist, movie];
      setWatchlist(updated);
      localStorage.setItem('watchlist', JSON.stringify(updated));
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="movie-app" tabIndex={0} ref={inputRef}>
      <nav className="navbar">
        <h1 className="app-title">MovieMate</h1>
        <div className="nav-center">
          <ul className="nav-links">
            <li><button onClick={() => setActiveSection('home')} className={activeSection === 'home' ? 'active-link' : ''}>Home</button></li>
            <li><button onClick={() => setActiveSection('favorites')} className={activeSection === 'favorites' ? 'active-link' : ''}>Favorites</button></li>
            <li><button onClick={() => setActiveSection('watchlist')} className={activeSection === 'watchlist' ? 'active-link' : ''}>Watchlist</button></li>
            <li><button onClick={() => setActiveSection('popular')} className={activeSection === 'popular' ? 'active-link' : ''}>Popular</button></li>
          </ul>

          <div className="nav-search-right">
            <input
              type="text"
              className="search-input"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={handleClearSearch}>
                <FaTimes />
              </button>
            )}
            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
              <option value="">Genre</option>
              {genreList.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </nav>

      {/* ✅ Loading Spinner */}
      {loading && <div className="spinner"></div>}

      {/* Error message */}
      {error && <p className="error">{error}</p>}

      <MovieGrid
        movies={getDisplayedMovies()}
        favorites={favorites || []}
        watchlist={watchlist || []}
        onToggleFavorite={toggleFavorite}
        onToggleWatchlist={toggleWatchlist}
        onCardClick={handleCardClick}
      />

      <footer className="footer">
        <p>🎥 Movie Explorer - Search, filter, favorite, and build a watchlist using OMDb API. Built in React.</p>
      </footer>
    </div>
  );
}
