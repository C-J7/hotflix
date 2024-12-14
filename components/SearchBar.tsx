import React, { useState } from "react";
import { IconSearch, IconX } from "@tabler/icons-react";
import styles from "@/styles/Home.module.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string>("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const fetchSearchResults = async (query: string) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`, // Replace with your environment variable
      },
    };

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${encodeURIComponent(
          query
        )}`,
        options
      );
      const data = await response.json();
      console.log("Search Results:", data.results); // Debugging purposes
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className={styles.searchBar}>
      {!isOpen && (
        <button className={styles.searchIcon} onClick={() => setIsOpen(true)} aria-label="Open Search">
          <IconSearch size={20} />
        </button>
      )}
      <form onSubmit={handleSearch} className={`${styles.searchForm} ${isOpen ? styles.open : ""}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          placeholder="Search movies..."
        />
        {isOpen && (
          <button
            type="button"
            className={styles.closeIcon}
            onClick={() => {
              setIsOpen(false);
              setQuery("");
            }}
            aria-label="Close Search"
          >
            <IconX size={20} />
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;