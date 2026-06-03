// src/pages/HomePage/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useHomeLogic } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
// 1. Import CSS Module
import styles from './HomePage.module.css';
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton';

const HomePage: React.FC = () => {
  const { trendingAnime, genres, latestNews, isLoading } = useHomeLogic();
  const { t } = useTranslation(['HomePage', 'common']);



  return (
    // 3. Áp dụng styles module cho toàn bộ trang
    <div className={styles.homePage}>

      {/* --- PHẦN 1: Hero Section --- */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 dangerouslySetInnerHTML={{ __html: t('HomePage:hero.title') }}></h1>
          <p>{t('HomePage:hero.subtitle')}</p>
        </div>
        <div className={styles.heroImage}>
          <img src="/images/dashboard.png" alt="Dashboard statistics" />
        </div>
      </section>

      {/* --- PHẦN 2: Features Section --- */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresTextContent}>
          <span className={styles.featuresLabel}>{t('HomePage:features.label')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('HomePage:features.title') }}></h2>
          <p className={styles.featuresIntro}>{t('HomePage:features.intro')}</p>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className={styles.featureDetails}>
              <h3>{t('HomePage:features.exploration.title')}</h3>
              <p>{t('HomePage:features.exploration.desc')}</p>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <i className="fas fa-chart-line"></i>
            </div>
            <div className={styles.featureDetails}>
              <h3>{t('HomePage:features.analytics.title')}</h3>
              <p>{t('HomePage:features.analytics.desc')}</p>
            </div>
          </div>
        </div>
        <div className={styles.featuresImage}>
          <img src="/images/laptop-dashboard.png" alt="Laptop showing data analytics" />
        </div>
      </section>

      {/* --- PHẦN 3: Video Call-to-Action --- */}
      <section className={styles.videoSection}>
        <video
          className={styles.videoBackground}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/phainonH264.mp4" type="video/mp4" />
          {t('common:video_unsupported')}
        </video>
        <div className={styles.videoOverlay}></div>
        <div className={styles.contentContainer}>
          <div className={styles.textContainer}>
            <h3>{t('HomePage:community_cta.title')}</h3>
            <p>{t('HomePage:community_cta.desc')}</p>
          </div>
          <div>
            <Link to="/signup" className={styles.signUpButton}>{t('common:buttons.sign_up')}</Link>
          </div>
        </div>
      </section>

      {/* --- PHẦN 4: Trending Now Section --- */}
      <section className={styles.trendingSection}>
        <h2>{t('HomePage:sections.popular')}</h2>
        <div className={styles.animeGrid}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className={styles.animeCard} style={{ border: 'none', background: 'transparent' }}>
                <Skeleton width="100%" height="300px" borderRadius="12px" />
                <div className={styles.cardContent} style={{ padding: '16px 0' }}>
                  <Skeleton width="80%" height="24px" style={{ marginBottom: '8px' }} />
                  <Skeleton width="100%" height="16px" count={2} style={{ marginBottom: '4px' }} />
                  <Skeleton width="120px" height="36px" borderRadius="20px" style={{ marginTop: '16px' }} />
                </div>
              </div>
            ))
          ) : (
            trendingAnime.map((anime: any) => {
              const title = anime.title?.english || anime.title?.romaji || anime.title?.native || 'Unknown Title';
              const imgUrl = anime.coverImage?.large || anime.coverImage?.medium || anime.coverImage?.extraLarge || anime.img || '';
              
              return (
                <Link to={`/anime/${anime.id}`} key={anime.id} className={styles.animeCard}>
                  <img src={imgUrl} alt={title} />
                  <div className={styles.cardContent}>
                    <h3>{title}</h3>
                    {anime.description && <p>{anime.description}</p>}
                    <span className={styles.cardButton}>{t('common:buttons.learn_more')}</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* --- PHẦN 5: Explore by Genre Section --- */}
      <section className={styles.genreSection}>
        <h2>{t('HomePage:sections.genres')}</h2>
        <div className={styles.genreChips}>
          {genres.map(genre => (
            <Link to={`/genre/${genre.toLowerCase()}`} key={genre} className={styles.genreChip}>
              {genre}
            </Link>
          ))}
        </div>
      </section>

      {/* --- PHẦN 6: Latest News Section --- */}
      <section className={styles.latestNewsSection}>
        <h2>{t('HomePage:sections.latest_news')}</h2>
        <div className={styles.newsGrid}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <article key={idx} className={styles.newsArticle} style={{ border: 'none', background: 'transparent', padding: 0 }}>
                <Skeleton width="100%" height="200px" borderRadius="12px 12px 0 0" />
                <div className={styles.newsContent} style={{ padding: '16px 0' }}>
                  <Skeleton width="90%" height="24px" style={{ marginBottom: '8px' }} />
                  <Skeleton width="100%" height="16px" count={3} style={{ marginBottom: '4px' }} />
                  <Skeleton width="100px" height="20px" style={{ marginTop: '12px' }} />
                </div>
              </article>
            ))
          ) : (
            latestNews.map(news => (
              <article key={news.id} className={styles.newsArticle}>
                <img src={news.img} alt={news.title} />
                <div className={styles.newsContent}>
                  <h4>{news.title}</h4>
                  <p>{news.snippet}</p>
                  <Link to={`/news/${news.id}`} className={styles.readMoreLink}>
                    {t('common:buttons.read_more')} &rarr;
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* --- PHẦN 7: Footer --- */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link to="/about">{t('common:footer.about_us')}</Link>
          <Link to="/contact">{t('common:footer.contact')}</Link>
          <Link to="/privacy">{t('common:footer.privacy_policy')}</Link>
          <Link to="/terms">{t('common:footer.terms_of_service')}</Link>
        </div>
        <p>{t('common:footer.copyright', { year: 2025 })}</p>
      </footer>
    </div>
  );
};

export default HomePage;