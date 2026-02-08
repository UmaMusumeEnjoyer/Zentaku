import React, { useMemo, useState }  from 'react'; // ✅ Thêm useState
import styles from '../WatchPage.module.css';
import EditorModal from '../../../components/AnimeModal/EditorModal';
import { useSummarySection } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  animeData: any;
  animeId: string | undefined;
}

export const Sidebar: React.FC<SidebarProps> = ({ animeData, animeId }) => {
  const { t } = useTranslation(['AnimeModal', 'common']);
  
  // ✅ THÊM: State cho expand synopsis
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);

  const anime = useMemo(() => ({
    id: animeId || animeData?.id,
    cover_image: animeData?.cover_image,
    name_romaji: animeData?.name_romaji,
    desc: animeData?.desc
  }), [animeId, animeData?.id, animeData?.cover_image, animeData?.name_romaji, animeData?.desc]);

  const {
    isModalOpen,
    currentStatusData,
    watchStatus,
    isLoadingStatus,
    isFollowing,
    handleBtnClick,
    handleCloseModal,
    handleSave,
    handleDelete
  } = useSummarySection(anime);

  const buttonLabel = React.useMemo(() => {
    if (isLoadingStatus) return 'Loading...';
    if (isFollowing && watchStatus) {
      return t(`AnimeModal:status_options.${watchStatus}`);
    }
    return t('AnimeModal:status_options.default') || 'Add to List';
  }, [isLoadingStatus, isFollowing, watchStatus, t]);

  const totalEpisodes = animeData?.airing_episodes || 0;
  const releasedEpisodes = totalEpisodes;
  const watchedEpisodes = currentStatusData?.episode_progress || 0;

  const releasedPercent = totalEpisodes > 0 ? (releasedEpisodes / totalEpisodes) * 100 : 0;
  const watchedPercent = totalEpisodes > 0 ? (watchedEpisodes / totalEpisodes) * 100 : 0;

  const season = animeData?.season && animeData?.season_year 
    ? `${animeData.season} ${animeData.season_year}` 
    : 'Unknown';
  
  const studio = animeData?.studios && animeData.studios.length > 0 
    ? animeData.studios[0] 
    : 'Unknown';

  const genres = animeData?.genres || [];

  if (!animeData) {
    return <aside className={styles.sidebarColumn}>Loading...</aside>;
  }

  return (
    <>
      <aside className={styles.sidebarColumn}>
        <div className={styles.sidebarCard}>
          <div className={styles.posterWrapper}>
            <img
              src={animeData.cover_image}
              alt={animeData.name_romaji}
              className={styles.posterImg}
            />
          </div>

          <h2 className={styles.animeTitleSidebar}>{animeData.name_romaji}</h2>

          <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Season:</span>
                  <span className={styles.metaValue}>{season}</span>
              </div>
              <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Studio:</span>
                  <span className={styles.metaValue}>{studio}</span>
              </div>
              <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Status:</span>
                  <span className={styles.metaValue}>{animeData.airing_status || 'Unknown'}</span>
              </div>
              <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Format:</span>
                  <span className={styles.metaValue}>{animeData.airing_format || 'Unknown'}</span>
              </div>
          </div>

          <div className={styles.progressContainer}>
              <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Progress</span>
                  <span className={styles.progressValue}>
                      Ep {watchedEpisodes} <span style={{opacity: 0.5}}>/ {releasedEpisodes} ({totalEpisodes})</span>
                  </span>
              </div>
              <div className={styles.track}>
                  <div
                      className={styles.barReleased}
                      style={{ width: `${releasedPercent}%` }}
                      title={`Released: ${releasedEpisodes}/${totalEpisodes}`}
                  ></div>

                  <div
                      className={styles.barWatched}
                      style={{ width: `${watchedPercent}%` }}
                      title={`Watched: ${watchedEpisodes}`}
                  ></div>
              </div>
              <div className={styles.progressLegend}>
                  <div className={styles.legendItem}>
                      <span className={`${styles.dot} ${styles.dotWatched}`}></span> Watched
                  </div>
                  <div className={styles.legendItem}>
                      <span className={`${styles.dot} ${styles.dotReleased}`}></span> Released
                  </div>
              </div>
          </div>

          <div className={styles.tags}>
            {genres.slice(0, 5).map((genre: string, index: number) => (
              <span key={index} className={styles.tag}>{genre}</span>
            ))}
          </div>

          {/* ✅ CHỈNH SỬA: Synopsis với See More/Less */}
          <div className={styles.synopsis}>
              <h3 className={styles.synopsisTitle}>Synopsis</h3>
              <p 
                className={`${styles.synopsisText} ${isSynopsisExpanded ? styles.synopsisExpanded : styles.synopsisCollapsed}`}
                dangerouslySetInnerHTML={{ __html: animeData.desc || 'No synopsis available.' }}
              />
              {/* ✅ Button See More/Less */}
              <button 
                className={styles.seeMoreBtn}
                onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
              >
                {isSynopsisExpanded ? 'See less' : 'See more'}
              </button>
          </div>
        </div>

        <button 
          className={styles.modalBtn}
          onClick={handleBtnClick}
        >
          {buttonLabel}
        </button>
      </aside>

      <EditorModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        anime={anime}
        initialData={currentStatusData}
        onSave={handleSave} 
        onDelete={handleDelete}
      />
    </>
  );
};