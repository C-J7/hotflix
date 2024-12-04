import React, { useState } from 'react'; 
import { FaHome, FaFilm, FaBookmark, FaInfoCircle, FaTimes } from 'react-icons/fa';
import styles from '@/styles/Sidebar.module.css'; 

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Menu Button with Toggle */}
      <button className={styles.menuButton} onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaHome />} {/* Toggle between Home and Close icon */}
      </button>

      {/* Sidebar - Add Close button inside the sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes /> {/* Close icon inside sidebar */}
        </button>
        <nav>
          <ul className={styles.navList}>
            <li>
              <a href="/homepage">
                <FaHome className={styles.icon} />
                Home
              </a>
            </li>
            <li>
              <a href="/recommendations">
                <FaFilm className={styles.icon} />
                Recommendations
              </a>
            </li>
            <li>
              <a href="/watchlist">
                <FaBookmark className={styles.icon} />
                Watchlist
              </a>
            </li>
            <li>
              <a href="/aboutPage">
                <FaInfoCircle className={styles.icon} />
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;