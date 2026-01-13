import React from 'react';
//import { Link } from 'react-router-dom';
import { type HeroSectionProps } from '@umamusumeenjoyer/shared-logic';
import { useHeroSection } from '@umamusumeenjoyer/shared-logic';
// [CHANGE] Import styles from module
import styles from './HeroSection.module.css';

const HeroSection: React.FC<HeroSectionProps> = ({ slides }) => {
  // Kết nối với ViewModel
  const { current, moveDot, hasSlides } = useHeroSection(slides);

  // Guard clause: Nếu không có slide thì không render gì cả (logic từ file gốc)
  if (!hasSlides) {
    return null;
  }

  return (
    <div className={styles.heroSlider}>
      {slides.map((slide, index) => (
        <div
          className={`${styles.slide} ${index === current ? styles.active : ''}`}
          key={slide.id}
        >
          {index === current && (
            <>
              <div className={styles.heroBackground}>
                <img src={slide.bannerUrl} alt={slide.title} />
                <div className={styles.heroOverlay}></div>
              </div>

              {/* [CHANGE] Kết hợp class local styles.container và styles.heroContent */}
              <div className={`${styles.heroContent} ${styles.container}`}>
                <h1 className={styles.heroTitle}>{slide.title}</h1>
                <p className={styles.heroDescription}>{slide.description}</p>
                
                <div className={styles.heroActions}>
                  {/* Example button commented out in original file, updated classes just in case */}
                  {/* <Link 
                    to={`/anime/${slide.id}`} 
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <i className="fas fa-play"></i> See details
                  </Link> */}
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      <div className={styles.sliderDots}>
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => moveDot(index)}
            className={`${styles.dot} ${current === index ? styles.active : ''}`}
            role="button"
            tabIndex={0}
            aria-label={`Go to slide ${index + 1}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;