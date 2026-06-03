import React from 'react';
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton';
import styles from './NewsDetail.module.css';
import { useTheme } from '../../context/ThemeContext';

const NewsDetailSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={styles.newsPageContainer} data-theme={theme}>
      <section className={styles.newsDetailContent}>
        <div className={styles.newsHeaderBar}>
          <Skeleton width="60%" height="40px" className="mb-2" />
        </div>

        <div className={styles.newsBody}>
          <Skeleton width="100%" height="400px" borderRadius="12px" className={styles.newsImage} />
          
          <div className={styles.fullContent}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <Skeleton width="100%" height="18px" style={{ marginBottom: '8px' }} />
                <Skeleton width="100%" height="18px" style={{ marginBottom: '8px' }} />
                <Skeleton width="90%" height="18px" style={{ marginBottom: '8px' }} />
              </div>
            ))}
          </div>

          <blockquote className={styles.specialQuote} style={{ borderLeftColor: 'transparent' }}>
            <Skeleton width="80%" height="24px" style={{ marginBottom: '8px' }} />
            <Skeleton width="60%" height="24px" style={{ marginBottom: '16px' }} />
            <Skeleton width="120px" height="16px" style={{ display: 'block', marginLeft: 'auto' }} />
          </blockquote>
        </div>
        
        <Skeleton width="150px" height="24px" style={{ marginTop: '24px' }} />
      </section>
    </div>
  );
};

export default NewsDetailSkeleton;
