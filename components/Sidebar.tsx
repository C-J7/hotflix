import React from 'react';
import Link from 'next/link';
import { 
  IconHome, 
  IconMovie, 
  IconBookmark, 
  IconInfoCircle, 
  IconX 
} from '@tabler/icons-react';
import styles from '@/styles/Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <button 
        className={styles.closeButton} 
        onClick={onClose}
        aria-label="Close Sidebar"
      >
        <IconX stroke={1.5} />
      </button>
      
      <nav className={styles.sidebarNav}>
        <ul className={styles.navList}>
          {[
            { 
              href: "/homepage", 
              icon: <IconHome stroke={1.5} />, 
              label: "Home" 
            },
            { 
              href: "/recommendations", 
              icon: <IconMovie stroke={1.5} />, 
              label: "Recommendations" 
            },
            { 
              href: "/watchlist", 
              icon: <IconBookmark stroke={1.5} />, 
              label: "Watchlist" 
            },
            { 
              href: "/aboutPage", 
              icon: <IconInfoCircle stroke={1.5} />, 
              label: "About" 
            }
          ].map(({ href, icon, label }) => (
            <li key={href}>
              <Link href={href} className={styles.navLink}>
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;