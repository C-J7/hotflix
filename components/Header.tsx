import React, { useState, useEffect } from 'react';
import { FaBars, FaUser, FaCaretDown } from 'react-icons/fa';
import styles from '@/styles/Home.module.css';
import SearchBar from './SearchBar';
import Sidebar from './Sidebar';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string; watchStreak?: number } | null>(
    null
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // Ensure `localStorage` is accessed only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = JSON.parse(localStorage.getItem('userProfile') || '{}');
      setUser(storedUser);
    }
  }, []);

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
          <div className={styles.profileContainer} onClick={toggleProfileDropdown}>
            <FaUser />
            <FaCaretDown />
            {isProfileDropdownOpen && (
              <div className={styles.profileDropdown}>
                <p><strong>Name:</strong> {user?.name || 'Guest'}</p>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                <p><strong>Watch Streak:</strong> {user?.watchStreak || 0} day(s)</p>
                <button onClick={() => alert('Logout functionality coming soon!')}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}
    </header>
  );
};

export default Header;