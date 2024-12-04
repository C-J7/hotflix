import React, { useState } from 'react';
import { FaBars, FaUser } from 'react-icons/fa'; 
import styles from '@/styles/Home.module.css';
import SearchBar from './SearchBar';
import Sidebar from './Sidebar'; 

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Sidebar Toggle Button */}
        <button className={styles.searchIcon} onClick={toggleSidebar}>
          <FaBars />
        </button>

        {/* Logo */}
        <img src="/Favicon.ico" alt="Logo" className={styles.logo} />

        {/* Right Side Icons */}
        <div className={styles.rightIcons}>
          <SearchBar onSearch={onSearch} />
          <button className={styles.searchIcon}>
            <FaUser />
          </button>
        </div>
      </div>

      {/* Sidebar Component */}
      {isSidebarOpen && <Sidebar onClose={toggleSidebar} />} {/* Conditionally render Sidebar */}
    </header>
  );
};

export default Header;