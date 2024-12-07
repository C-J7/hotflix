import React, { useState, useEffect } from 'react';
import { 
  IconMenu2, 
  IconUser 
} from '@tabler/icons-react';
import Link from 'next/link';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import styles from '@/styles/Home.module.css';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ 
    name?: string; 
    email?: string; 
    watchStreak?: number 
  } | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = JSON.parse(localStorage.getItem('userProfile') || '{}');
      setUser(storedUser);
    }
  }, []);


  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* Sidebar Toggle Button */}
          <button 
            className={styles.searchIcon} 
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <IconMenu2 />
          </button>

          {/* My Logo */}
          <Link href="/" className="logo-link">
            <img src="/Favicon.ico" alt="Logo" className={styles.logo} />
          </Link>

          {/* Right Side Icons */}
          <div className={styles.rightIcons}>
            <SearchBar onSearch={onSearch} />
            
            <div 
              className={styles.profileContainer} 
              onClick={toggleProfileDropdown}
            >
              {/* User Icons */}
              <IconUser className={styles.userIcon} />
              
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
      </header>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
      />
    </>
  );
};

export default Header;