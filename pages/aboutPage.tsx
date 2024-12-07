import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import { 
  IconCode, 
  IconApps, 
  IconUser, 
  IconBulb, 
  IconRocket, 
  IconWorldWww 
} from '@tabler/icons-react';
import styles from '@/styles/AboutPage.module.css';


const AboutPage: React.FC = () => {
  return ( 
    <div> 
    <Header onSearch={() => {}} />
    <div className={styles['about-container']}>
      <div className={styles['hero-section']}>
        <h1 className={styles['hero-title']}>About Hotflix</h1>
        <p className={styles['hero-description']}>
          Revolutionizing movie discovery with intelligent recommendations and 
          a seamless watchlist experience. Your personal Movie companion.
        </p>
      </div>

      <div className={styles['profile-section']}>
        <div className={styles['profile-image']}>
          <Image 
            src="/-J7profile.png" 
            alt="C-J7 Profile"
            width={250} 
            height={250} 
          />
        </div>
        <div className={styles['profile-details']}>
          <h2 className={styles['profile-name']}>C-J7</h2>
          <p className={styles['profile-title']}>
            Full-stack Developer | Movie Enthusiast
          </p>
          <div className={styles['profile-skills']}>
            <div className={styles['skill-item']}>
              <IconApps className={styles['skill-icon']} />
              Building innovative web solutions
            </div>
            <div className={styles['skill-item']}>
              <IconCode className={styles['skill-icon']} />
              Tech Stack: Next.js, TypeScript, React...
            </div>
            <div className={styles['skill-item']}>
              <IconWorldWww className={styles['skill-icon']} />
              Passionate about smooth user experiences
            </div>
          </div>
        </div>
      </div>

      <div className={styles['project-highlights']}>
        <div className={styles['highlight-card']}>
          <IconUser className={styles['highlight-icon']} />
          <h3 className={styles['highlight-title']}>Personalized</h3>
          <p className={styles['highlight-description']}>
            Custom recommendations tailored to your unique taste
          </p>
        </div>
        <div className={styles['highlight-card']}>
          <IconBulb className={styles['highlight-icon']} />
          <h3 className={styles['highlight-title']}>Intelligent</h3>
          <p className={styles['highlight-description']}>
            Advanced algorithms powering smart movie suggestions
          </p>
        </div>
        <div className={styles['highlight-card']}>
          <IconRocket className={styles['highlight-icon']} />
          <h3 className={styles['highlight-title']}>Innovative</h3>
          <p className={styles['highlight-description']}>
            Cutting-edge technology meets cinematic exploration
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AboutPage;