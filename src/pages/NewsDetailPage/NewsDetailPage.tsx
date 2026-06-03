import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNewsDetailLogic } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../context/ThemeContext';
// [CHANGE] Import styles module
import styles from './NewsDetail.module.css';
import NewsDetailSkeleton from './NewsDetailSkeleton';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { t } = useTranslation('NewsDetailPage');
  const { newsItem, contentParagraphs, isNotFound, isLoading } = useNewsDetailLogic(id);

  if (isLoading) {
    return <NewsDetailSkeleton />;
  }

  if (isNotFound || !newsItem) {
    return (
      <div className={styles.newsPageContainer} data-theme={theme}>
        <section className={`${styles.newsDetailContent} ${styles.notFound}`}>
          <h2>{t('news_detail.not_found.title')}</h2>
          <p>{t('news_detail.not_found.message', { id })}</p>
          {/* Reuse backLink style for consistency */}
          <Link to="/" className={styles.backLink}>{t('news_detail.not_found.back_home')}</Link>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.newsPageContainer} data-theme={theme}>
      <section className={styles.newsDetailContent}>
        <div className={styles.newsHeaderBar}>
          <h1>{newsItem.title}</h1>
        </div>

        <div className={styles.newsBody}>
          <img 
            src={newsItem.img} 
            alt={newsItem.title} 
            className={styles.newsImage} 
          />
          
          <div className={styles.fullContent}>
            {contentParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {newsItem.featuredQuote && (
            <blockquote className={styles.specialQuote}>
              {newsItem.featuredQuote}
              {newsItem.quoteAttribution && (
                <span className={styles.attribution}>{newsItem.quoteAttribution}</span>
              )}
            </blockquote>
          )}
        </div>
        
        <Link to="/" className={styles.backLink}>
          &larr; {t('news_detail.navigation.back_to_list')}
        </Link>
      </section>
    </div>
  );
};

export default NewsDetailPage;