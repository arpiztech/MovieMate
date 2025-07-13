import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

export default function SearchBar({ searchQuery, onChange, onSubmit }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search Movies..."
        value={searchQuery}
        onChange={onChange}
        className="search-input"
      />
      <button onClick={onSubmit} className="search-button">
        <AiOutlineSearch />
      </button>
    </div>
  );
}



