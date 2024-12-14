import React, { useState } from "react";
import { IconSearch, IconX } from "@tabler/icons-react";
import styles from "@/styles/Home.module.css";

interface SearchBarProps {
  onSearch: (query: string, results: Movie[]) => void; 
}


interface Movie {
  id: number;
  title: string;
  poster_path?: string; 
  release_date?: string;
  overview?: string;
}

interface SearchResponse {
  results: Movie[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string>("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const results = await fetchSearchResults(query);
      onSearch(query, results); 
    }
  };

  const fetchSearchResults = async (query: string): Promise<Movie[]> => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`, 
      },
    };

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${encodeURIComponent(
          query
        )}`,
        options
      );

      if (!response.ok) {
        console.error("Error fetching search results:", response.statusText);
        return [];
      }

      const data: SearchResponse = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error fetching search results:", error);
      return [];
    }
  };

  return (
    <div className={styles.searchBar}>
      {!isOpen && (
        <button
          className={styles.searchIcon}
          onClick={() => setIsOpen(true)}
          aria-label="Open Search"
        >
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