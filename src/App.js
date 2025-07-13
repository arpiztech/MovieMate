
// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MovieApp from './components/MovieApp'; // ✅ correct path
import MovieDetail from './pages/MovieDetail'; // ✅ correct path

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieApp />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
    </Routes>
  );
}
