import React from 'react';
import styles from '@/styles/AboutPage.module.css';
import Header from '@/components/Header';

const AboutPage: React.FC = () => {
  return (
    <div>
    <Header onSearch={() => {
        return console.log("THIS IS AN ABOUT PAGE");
    }}/>
    <div className={styles.aboutPage}>
      <h1 className={styles.title}>About Hotflix</h1>
      <p className={styles.description}>
        Hotflix is a movie watchlist and recommendation system designed to deliver a Netflix-style experience.
      </p>
      <div className={styles.developerSection}>
        <h2 className={styles.subtitle}>Developer Profile</h2>
        <div className={styles.profileContainer}>
          <div className={styles.imagePlaceholder}></div>
          <div>
            <h3 className={styles.profileName}>Developer Name</h3>
            <p className={styles.profileDescription}>Full-stack developer and passionate about creating engaging user experiences.</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AboutPage;