import React from 'react';
import { FaBars, FaCog } from 'react-icons/fa'; // Import icons from react-icons
import styles from '@/styles/Home.module.css';
import SearchBar from './SearchBar';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <button className={styles.iconButton}>
          <FaBars />
        </button>
        <img src="/Favicon.ico" alt="Logo" className={styles.logo} />
        <div className={styles.rightIcons}>
          <SearchBar onSearch={onSearch} />
          <button className={styles.iconButton}>
            <FaCog />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;