import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa'; // Import the search and close icons from react-icons
import styles from '@/styles/Home.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className={styles.searchBar}>
      {!isOpen && (
        <button className={styles.searchIcon} onClick={() => setIsOpen(true)}>
          <FaSearch />
        </button>
      )}
      <form onSubmit={handleSearch} className={`${styles.searchForm} ${isOpen ? styles.open : ''}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          placeholder="Search movies..."
        />
        {isOpen && (
          <button type="button" className={styles.closeIcon} onClick={() => setIsOpen(false)}>
            <FaTimes />
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;