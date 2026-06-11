import React, { useState, useRef, useCallback, useEffect } from 'react';
import { adminService } from '@umamusumeenjoyer/shared-logic';
import type { FilmServerEpisode } from '@umamusumeenjoyer/shared-logic';
import styles from './AdminUploadMovie.module.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ConfirmModal from './components/ConfirmModal/ConfirmModal';

// ==================== Types ====================
interface AnimeResult {
  id: number;
  idMal?: number;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  coverImage?: {
    medium?: string;
    large?: string;
  };
  format?: string;
  status?: string;
  episodes?: number;
  seasonYear?: number;
  genres?: string[];
}

type Step = 'search' | 'episode' | 'upload';



// ==================== Helper ====================
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

// ==================== Component ====================
const AdminUploadMovie: React.FC = () => {
  const { t } = useTranslation(['Admin']);

  const STEPS: { key: Step; label: string }[] = [
    { key: 'search', label: t('Admin:uploadMovie.steps.search') },
    { key: 'episode', label: t('Admin:uploadMovie.steps.episode') },
    { key: 'upload', label: t('Admin:uploadMovie.steps.upload') },
  ];

  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    type: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: '',
    type: 'danger',
    onConfirm: () => {},
  });

  const closeConfirmModal = () => setConfirmModalState(prev => ({ ...prev, isOpen: false }));
  // Step management
  const [currentStep, setCurrentStep] = useState<Step>('search');
  const [searchMode, setSearchMode] = useState<'server' | 'new'>('server');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});
  const [uploadResult, setUploadResult] = useState<Record<number, { status: 'uploading' | 'success' | 'error', data?: any, error?: string }>>({});
  const [isBatchCompleted, setIsBatchCompleted] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Server anime state
  const [serverAnimes, setServerAnimes] = useState<AnimeResult[]>([]);
  const [serverSearchQuery, setServerSearchQuery] = useState('');
  const [isFetchingServer, setIsFetchingServer] = useState(false);
  const [isDeletingEpisode, setIsDeletingEpisode] = useState<string | null>(null);
  const [isDeletingAnime, setIsDeletingAnime] = useState(false);

  // Manage Episode (Replace Source)
  const [managingEpisode, setManagingEpisode] = useState<FilmServerEpisode | null>(null);
  const [manageVideoFile, setManageVideoFile] = useState<File | null>(null);
  const [manageSubtitleFile, setManageSubtitleFile] = useState<File | null>(null);
  const [isUpdatingSource, setIsUpdatingSource] = useState(false);

  // Selected anime
  const [selectedAnime, setSelectedAnime] = useState<AnimeResult | null>(null);

  // Episode state
  const [selectedEpisodes, setSelectedEpisodes] = useState<number[]>([]);
  const [manualEpisodeInput, setManualEpisodeInput] = useState<string>('');
  const [existingEpisodes, setExistingEpisodes] = useState<FilmServerEpisode[]>([]);

  // File state (Batch)
  const [uploadFiles, setUploadFiles] = useState<
    Record<number, { video: File | null; subtitle: File | null; previewUrl: string | null }>
  >({});
  const [videoDragOver, setVideoDragOver] = useState<number | null>(null);
  const [subtitleDragOver, setSubtitleDragOver] = useState<number | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ==================== Search Logic ====================
  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await adminService.searchAnime(query, 1, 12);
      // Backend returns { success: true, data: { items: [...] } }
      const results = data?.data?.items || data?.items || [];
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 400);
  };

  const selectAnime = (anime: AnimeResult) => {
    setSelectedAnime(anime);
    setCurrentStep('episode');
    // Fetch existing episodes
    fetchExistingEpisodes(anime.id);
  };

  const fetchExistingEpisodes = async (animeId: number) => {
    try {
      const episodes = await adminService.getEpisodes(animeId);
      setExistingEpisodes(Array.isArray(episodes) ? episodes : []);
    } catch {
      setExistingEpisodes([]);
    }
  };

  // Lắng nghe sự kiện conversion-complete từ Widget để tự động refetch danh sách tập
  useEffect(() => {
    const handleConversionComplete = (e: any) => {
      const { animeId } = e.detail;
      if (selectedAnime && selectedAnime.id === Number(animeId)) {
        console.log(`[Auto-Refresh] HLS conversion finished for anime ${animeId}, refetching episodes...`);
        fetchExistingEpisodes(selectedAnime.id);
      }
    };

    window.addEventListener('global-conversion-complete', handleConversionComplete);
    return () => window.removeEventListener('global-conversion-complete', handleConversionComplete);
  }, [selectedAnime]);

  // ==================== File Handling ====================
  const handleVideoSelect = (file: File, ep: number) => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const validVideoExts = ['.mp4', '.mkv', '.webm'];
    if (!validVideoExts.includes(ext)) {
      toast.error(t('Admin:uploadMovie.alerts.invalidVideo', { ext }));
      return;
    }
    const url = URL.createObjectURL(file);
    setUploadFiles(prev => ({
      ...prev,
      [ep]: { ...prev[ep], video: file, previewUrl: url }
    }));
  };

  const handleSubtitleSelect = (file: File, ep: number) => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (ext !== '.vtt') {
      toast.error(t('Admin:uploadMovie.alerts.invalidSubtitle', { ext }));
      return;
    }
    setUploadFiles(prev => ({
      ...prev,
      [ep]: { ...prev[ep], subtitle: file }
    }));
  };

  const handleDrop = (
    e: React.DragEvent,
    type: 'video' | 'subtitle',
    ep: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'video') setVideoDragOver(null);
    else setSubtitleDragOver(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (type === 'video') handleVideoSelect(files[0], ep);
      else handleSubtitleSelect(files[0], ep);
    }
  };

  const handleDeleteEpisode = async (epNum: string) => {
    if (!selectedAnime) return;
    setConfirmModalState({
      isOpen: true,
      message: t('Admin:uploadMovie.alerts.deleteEpisodeConfirm', { epNum }),
      type: 'danger',
      onConfirm: async () => {
        closeConfirmModal();
        setIsDeletingEpisode(epNum);
        try {
          await adminService.deleteEpisode(selectedAnime.id, Number(epNum));
          const eps = await adminService.getEpisodes(selectedAnime.id);
          setExistingEpisodes(eps);
          setSelectedEpisodes(prev => prev.filter(e => e !== Number(epNum)));
          toast.success(t('Admin:uploadMovie.alerts.deleteEpisodeSuccess', { epNum }));
        } catch (err) {
          console.error(err);
          toast.error(t('Admin:uploadMovie.alerts.deleteEpisodeError'));
        } finally {
          setIsDeletingEpisode(null);
        }
      }
    });
  };

  const handleDeleteAnime = async () => {
    if (!selectedAnime) return;
    setConfirmModalState({
      isOpen: true,
      message: t('Admin:uploadMovie.alerts.deleteAllConfirm', { count: existingEpisodes.length }),
      type: 'danger',
      onConfirm: async () => {
        closeConfirmModal();
        setIsDeletingAnime(true);
        try {
          await adminService.deleteAnime(selectedAnime.id);
          setExistingEpisodes([]);
          setSelectedEpisodes([]);
          toast.success(t('Admin:uploadMovie.alerts.deleteAllSuccess'));
        } catch (err) {
          console.error(err);
          toast.error(t('Admin:uploadMovie.alerts.deleteAllError'));
        } finally {
          setIsDeletingAnime(false);
        }
      }
    });
  };

  const handleUpdateSource = async () => {
    if (!selectedAnime || !managingEpisode || !manageVideoFile) return;
    
    setIsUpdatingSource(true);
    try {
      await adminService.uploadEpisode({
        animeId: selectedAnime.id,
        episodeNumber: Number(managingEpisode.episodeNumber),
        videoFile: manageVideoFile,
        subtitleFile: manageSubtitleFile || undefined
      });
      toast.success(t('Admin:uploadMovie.alerts.updateSourceSuccess'));
      // Xoá file đã chọn
      setManageVideoFile(null);
      setManageSubtitleFile(null);
      setManagingEpisode(null);
      // Refetch episodes
      const eps = await adminService.getEpisodes(selectedAnime.id);
      setExistingEpisodes(eps);
    } catch (err) {
      console.error('Lỗi khi cập nhật source:', err);
      toast.error(t('Admin:uploadMovie.alerts.updateSourceError'));
    } finally {
      setIsUpdatingSource(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleEpisodeToggle = (ep: number) => {
    setSelectedEpisodes(prev => 
      prev.includes(ep) ? prev.filter(e => e !== ep) : [...prev, ep].sort((a,b) => a-b)
    );
  };

  const handleManualEpisodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setManualEpisodeInput(val);
    
    // Parse string like '1, 2, 3-5'
    const eps = new Set<number>();
    const parts = val.split(',').map(p => p.trim()).filter(Boolean);
    parts.forEach(part => {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end) && start <= end && end - start < 1000) {
          for(let i = start; i <= end; i++) eps.add(i);
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num)) eps.add(num);
      }
    });
    
    setSelectedEpisodes(Array.from(eps).sort((a,b) => a-b));
  };

  // ==================== Upload Logic ====================
  const handleUpload = async () => {
    if (!selectedAnime || selectedEpisodes.length === 0) return;
    
    const hasAnyFiles = selectedEpisodes.some(ep => uploadFiles[ep]?.video || uploadFiles[ep]?.subtitle);
    if (!hasAnyFiles) {
      toast.warning(t('Admin:uploadMovie.alerts.noFilesSelected'));
      return;
    }

    setIsUploading(true);
    setIsBatchCompleted(false);

    for (const ep of selectedEpisodes) {
      const epFiles = uploadFiles[ep];
      if (!epFiles?.video && !epFiles?.subtitle) {
        continue; // Skip if no files for this episode
      }

      setUploadResult(prev => ({ ...prev, [ep]: { status: 'uploading' } }));
      
      try {
        const result = await adminService.uploadEpisode({
          animeId: selectedAnime.id,
          episodeNumber: ep,
          videoFile: epFiles.video || undefined,
          subtitleFile: epFiles.subtitle || undefined,
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setUploadProgress(prev => ({ ...prev, [ep]: percent }));
              
              window.dispatchEvent(new CustomEvent('global-upload-progress', {
                detail: {
                  animeId: selectedAnime.id,
                  episodeNumber: ep,
                  progress: percent
                }
              }));
            }
          },
        });

        window.dispatchEvent(new CustomEvent('global-upload-complete', {
          detail: { animeId: selectedAnime.id, episodeNumber: ep }
        }));

        setUploadResult(prev => ({ ...prev, [ep]: { status: 'success', data: result } }));
      } catch (err: any) {
        setUploadResult(prev => ({ ...prev, [ep]: { status: 'error', error: err.message || 'Unknown error' } }));
      }
    }

    setIsUploading(false);
    setIsBatchCompleted(true);
  };

  const resetForm = () => {
    setCurrentStep('search');
    setSelectedAnime(null);
    setSelectedEpisodes([]);
    setManualEpisodeInput('');
    setUploadFiles({});
    setUploadProgress({});
    setUploadResult({});
    setIsBatchCompleted(false);
    setSearchQuery('');
    setSearchResults([]);
    setExistingEpisodes([]);
    Object.values(uploadFiles).forEach(f => {
      if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
  };

  // Fetch existing movies from FilmServer
  useEffect(() => {
    if (searchMode === 'server') {
      const fetchServerMovies = async () => {
        setIsFetchingServer(true);
        try {
          const moviesObj = await adminService.getMovies();
          console.log('moviesObj:', moviesObj);
          const animeIds = Object.keys(moviesObj).map(Number).filter(id => !isNaN(id));
          console.log('animeIds:', animeIds);
          
          if (animeIds.length > 0) {
            // Fetch basic info for all these ids in parallel (limit to 20 for performance)
            const idsToFetch = animeIds.slice(0, 20);
            const infos = await Promise.all(
              idsToFetch.map(id => adminService.getAnimeBasicInfo(id).catch(() => null))
            );
            
            const validAnimes: AnimeResult[] = infos
              .filter(info => info && (info.id || info.idAnilist))
              .map(info => ({
                ...info,
                id: info.id || info.idAnilist
              }));
            
            setServerAnimes(validAnimes);
          } else {
            setServerAnimes([]);
          }
        } catch (err) {
          console.error('Failed to fetch server movies', err);
        } finally {
          setIsFetchingServer(false);
        }
      };
      
      fetchServerMovies();
    }
  }, [searchMode]);



  // ==================== Step Helpers ====================
  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);

  const getStepClass = (idx: number) => {
    if (idx < stepIndex) return `${styles.stepItem} ${styles.completed}`;
    if (idx === stepIndex) return `${styles.stepItem} ${styles.active}`;
    return styles.stepItem;
  };



  // ==================== Render ====================
  return (
    <div className={styles.uploadContainer}>
      {/* Stepper */}
      <div className={styles.stepper}>
        {STEPS.map((step, idx) => (
          <React.Fragment key={step.key}>
            <div className={getStepClass(idx)}>
              <span className={styles.stepNumber}>
                {idx < stepIndex ? '✓' : idx + 1}
              </span>
              {step.label}
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`${styles.stepConnector} ${
                  idx < stepIndex ? styles.active : ''
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Search Anime */}
      {currentStep === 'search' && (
        <div className={styles.searchSection}>
          <div className={styles.searchModeTabs}>
            <div 
              className={`${styles.searchModeTab} ${searchMode === 'server' ? styles.active : ''}`}
              onClick={() => setSearchMode('server')}
            >
              {t('Admin:uploadMovie.search.tabServer')}
            </div>
            <div 
              className={`${styles.searchModeTab} ${searchMode === 'new' ? styles.active : ''}`}
              onClick={() => setSearchMode('new')}
            >
              {t('Admin:uploadMovie.search.tabNew')}
            </div>
          </div>

          {searchMode === 'new' && (
            <>
              <div className={styles.searchInputWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  id="anime-search-input"
                  type="text"
                  className={styles.searchInput}
                  placeholder={t('Admin:uploadMovie.search.placeholderNew')}
                  value={searchQuery}
                  onChange={onSearchChange}
                  autoFocus
                />
              </div>

              {isSearching && (
                <div className={styles.searchLoading}>{t('Admin:uploadMovie.search.loading')}</div>
              )}

              {!isSearching && searchResults.length === 0 && searchQuery.length >= 2 && (
                <div className={styles.noResults}>
                  {t('Admin:uploadMovie.search.noResultsNew', { query: searchQuery }).split('"')[0]} "{searchQuery}"
                </div>
              )}

              <div className={styles.searchResults}>
                {searchResults.map((anime) => (
                  <div
                    key={anime.id}
                    className={styles.searchResultItem}
                    onClick={() => selectAnime(anime)}
                    id={`anime-result-${anime.id}`}
                  >
                    {anime.coverImage?.medium && (
                      <img
                        className={styles.resultCover}
                        src={anime.coverImage.medium}
                        alt={anime.title?.romaji || ''}
                        loading="lazy"
                      />
                    )}
                    <div className={styles.resultInfo}>
                      <div className={styles.resultTitle}>
                        {anime.title?.english || anime.title?.romaji || 'Unknown'}
                      </div>
                      <div className={styles.resultMeta}>
                        <span>ID: {anime.id}</span>
                        {anime.format && <span>{anime.format}</span>}
                        {anime.episodes && <span>{anime.episodes} eps</span>}
                        {anime.seasonYear && <span>{anime.seasonYear}</span>}
                      </div>
                      {anime.genres && anime.genres.length > 0 && (
                        <div className={styles.resultMeta}>
                          {anime.genres.slice(0, 4).map((g) => (
                            <span key={g} className={styles.resultBadge}>{g}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {searchMode === 'server' && (
            <>
              {isFetchingServer ? (
                <div className={styles.searchLoading}>{t('Admin:uploadMovie.search.loadingServer')}</div>
              ) : serverAnimes.length === 0 ? (
                <div className={styles.noResults}>
                  {t('Admin:uploadMovie.search.noResultsServer')}
                </div>
              ) : (
                <>
                  <div className={styles.searchInputWrapper}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder={t('Admin:uploadMovie.search.placeholderServer')}
                      value={serverSearchQuery}
                      onChange={(e) => setServerSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className={styles.searchResults}>
                    {serverAnimes
                      .filter(anime => {
                        if (!serverSearchQuery) return true;
                        const q = serverSearchQuery.toLowerCase();
                        return (
                          anime.title?.english?.toLowerCase().includes(q) ||
                          anime.title?.romaji?.toLowerCase().includes(q) ||
                          String(anime.id).includes(q)
                        );
                      })
                      .map((anime) => (
                      <div
                        key={anime.id}
                        className={styles.searchResultItem}
                        onClick={() => selectAnime(anime)}
                      >
                      {anime.coverImage?.medium && (
                        <img
                          className={styles.resultCover}
                          src={anime.coverImage.medium}
                          alt={anime.title?.romaji || ''}
                          loading="lazy"
                        />
                      )}
                      <div className={styles.resultInfo}>
                        <div className={styles.resultTitle}>
                          {anime.title?.english || anime.title?.romaji || 'Unknown'}
                        </div>
                        <div className={styles.resultMeta}>
                          <span>ID: {anime.id}</span>
                          {anime.format && <span>{anime.format}</span>}
                          {anime.episodes && <span>{anime.episodes} eps</span>}
                          {anime.seasonYear && <span>{anime.seasonYear}</span>}
                        </div>
                        {anime.genres && anime.genres.length > 0 && (
                          <div className={styles.resultMeta}>
                            {anime.genres.slice(0, 4).map((g) => (
                              <span key={g} className={styles.resultBadge}>{g}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Step 2: Episode Number */}
      {currentStep === 'episode' && selectedAnime && (
        <div className={styles.episodeForm}>
          {/* Selected Anime Display */}
          <div className={styles.selectedAnime}>
            {selectedAnime.coverImage?.medium && (
              <img
                className={styles.selectedAnimeCover}
                src={selectedAnime.coverImage.medium}
                alt={selectedAnime.title?.romaji || ''}
              />
            )}
            <div className={styles.selectedAnimeInfo}>
              <div className={styles.selectedAnimeTitle}>
                {selectedAnime.title?.english || selectedAnime.title?.romaji}
              </div>
              <div className={styles.selectedAnimeId}>
                AniList ID: {selectedAnime.id}
              </div>
            </div>
            <button className={styles.changeAnimeBtn} onClick={() => setCurrentStep('search')}>
              {t('Admin:uploadMovie.episode.changeAnime')}
            </button>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {t('Admin:uploadMovie.episode.selectLabel', { count: selectedEpisodes.length })}
            </label>
            
            {/* Grid of buttons if total episodes are known */}
            {selectedAnime.episodes && selectedAnime.episodes > 0 && (
              <div className={styles.episodeSelectionGrid}>
                {Array.from({ length: selectedAnime.episodes }).map((_, i) => {
                  const ep = i + 1;
                  const isSelected = selectedEpisodes.includes(ep);
                  const isExisting = existingEpisodes.some(e => Number(e.episodeNumber) === ep);
                  return (
                    <button
                      key={ep}
                      className={`${styles.episodeSelectBtn} ${isSelected ? styles.selected : ''}`}
                      onClick={() => handleEpisodeToggle(ep)}
                      disabled={isExisting}
                      title={isExisting ? "Tập này đã có trên server" : `Chọn tập ${ep}`}
                    >
                      {ep}
                    </button>
                  );
                })}
              </div>
            )}

            <div className={styles.manualEpisodeGroup}>
              <label className={styles.formLabel} htmlFor="manual-episode-input">
                {t('Admin:uploadMovie.episode.manualInputLabel')}
              </label>
              <input
                id="manual-episode-input"
                type="text"
                className={styles.episodeInput}
                value={manualEpisodeInput}
                onChange={handleManualEpisodeChange}
                placeholder={t('Admin:uploadMovie.episode.manualInputPlaceholder')}
              />
              <div className={styles.manualInputHint}>
                {selectedEpisodes.length > 0 ? t('Admin:uploadMovie.episode.selectedHint', { episodes: selectedEpisodes.join(', ') }) : t('Admin:uploadMovie.episode.noSelectedHint')}
              </div>
            </div>
          </div>

          {/* Existing episodes from FilmServer */}
          {existingEpisodes.length > 0 && (
            <div className={styles.existingEpisodes}>
              <div className={styles.existingHeaderRow}>
                <div className={styles.existingTitle}>
                  {t('Admin:uploadMovie.episode.existingTitle', { count: existingEpisodes.length })}
                </div>
                <button 
                  className={styles.deleteAllBtn}
                  onClick={handleDeleteAnime}
                  disabled={isDeletingAnime}
                >
                  {isDeletingAnime ? t('Admin:uploadMovie.episode.deleteAllBtnLoading') : `🗑️ ${t('Admin:uploadMovie.episode.deleteAllBtn')}`}
                </button>
              </div>
              <div className={styles.episodeGrid}>
                {existingEpisodes.map((ep) => (
                  <div key={ep.episodeNumber} className={styles.episodeTagWrapper}>
                    <span
                      className={`${styles.episodeTag} ${
                        ep.hasHls ? styles.episodeTagReady : styles.episodeTagProcessing
                      } ${styles.clickable}`}
                      onClick={() => setManagingEpisode(ep)}
                      title={t('Admin:uploadMovie.episode.manageSourceTitle')}
                    >
                      Ep {ep.episodeNumber} {ep.hasHls ? '✓' : '⏳'}
                    </span>
                    <button
                      className={styles.deleteEpisodeBtn}
                      onClick={() => handleDeleteEpisode(ep.episodeNumber)}
                      disabled={isDeletingEpisode === ep.episodeNumber}
                      title={t('Admin:uploadMovie.episode.deleteEpisodeBtnTitle')}
                    >
                      {isDeletingEpisode === ep.episodeNumber ? '...' : '✕'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button
              className={styles.btnSecondary}
              onClick={() => setCurrentStep('search')}
            >
              {t('Admin:uploadMovie.episode.btnBack')}
            </button>
            <button
              className={styles.btnPrimary}
              onClick={() => setCurrentStep('upload')}
              disabled={selectedEpisodes.length === 0}
            >
              {t('Admin:uploadMovie.episode.btnNext')}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Upload Files */}
      {currentStep === 'upload' && selectedAnime && (
        <div className={styles.uploadSection}>
          {/* Selected info summary */}
          <div className={styles.selectedAnime}>
            {selectedAnime.coverImage?.medium && (
              <img
                className={styles.selectedAnimeCover}
                src={selectedAnime.coverImage.medium}
                alt={selectedAnime.title?.romaji || ''}
              />
            )}
            <div className={styles.selectedAnimeInfo}>
              <div className={styles.selectedAnimeTitle}>
                {selectedAnime.title?.english || selectedAnime.title?.romaji}
              </div>
              <div className={styles.selectedAnimeId}>
                {t('Admin:uploadMovie.upload.summary', { id: selectedAnime.id, count: selectedEpisodes.length })}
              </div>
            </div>
          </div>

          {isBatchCompleted ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✅</div>
              <div className={styles.successTitle}>{t('Admin:uploadMovie.upload.successTitle', { count: selectedEpisodes.length })}</div>
              <div className={styles.successSub}>{t('Admin:uploadMovie.upload.successSub')}</div>
              <button className={styles.btnPrimary} onClick={resetForm} style={{ marginTop: '20px' }}>
                {t('Admin:uploadMovie.upload.btnContinue')}
              </button>
            </div>
          ) : (
            <>
              {isUploading && (
                <div className={styles.batchProgressContainer}>
                  <div className={styles.batchProgressHeader}>
                    <span>{t('Admin:uploadMovie.upload.progressHeader')}</span>
                  </div>
                  {selectedEpisodes.map(ep => {
                    const prog = uploadProgress[ep] || 0;
                    const res = uploadResult[ep];
                    let statusText = `Đang chờ (${prog}%)`;
                    if (res?.status === 'uploading') statusText = `Đang upload (${prog}%)`;
                    if (res?.status === 'success') statusText = 'Hoàn tất ✓';
                    if (res?.status === 'error') statusText = 'Lỗi ✕';
                    
                    return (
                      <div key={ep} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                          <span>Tập {ep}</span>
                          <span>{statusText}</span>
                        </div>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ 
                              width: `${prog}%`, 
                              background: res?.status === 'success' ? '#22c55e' : res?.status === 'error' ? '#ef4444' : undefined 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className={styles.uploadCardsContainer}>
                {selectedEpisodes.map((ep) => {
                  const epFiles = uploadFiles[ep] || {};
                  const res = uploadResult[ep];
                  
                  let statusClass = styles.statusPending;
                  let statusLabel = 'Chưa upload';
                  if (res?.status === 'uploading') { statusClass = styles.statusUploading; statusLabel = 'Đang upload...'; }
                  if (res?.status === 'success') { statusClass = styles.statusSuccess; statusLabel = 'Thành công'; }
                  if (res?.status === 'error') { statusClass = styles.statusError; statusLabel = 'Thất bại'; }

                  return (
                    <div key={ep} className={styles.uploadCard}>
                      <div className={styles.uploadCardHeader}>
                        <div className={styles.uploadCardTitle}>Tập {ep}</div>
                        {isUploading && (
                          <div className={`${styles.uploadCardStatus} ${statusClass}`}>
                            {statusLabel}
                          </div>
                        )}
                      </div>

                      <div className={styles.uploadDropZones}>
                        {/* Video */}
                        <div
                          className={`${styles.miniDropZone} ${videoDragOver === ep ? styles.dragOver : ''}`}
                          onDragOver={(e) => { handleDragOver(e); setVideoDragOver(ep); }}
                          onDragLeave={() => setVideoDragOver(null)}
                          onDrop={(e) => handleDrop(e, 'video', ep)}
                          onClick={() => { if (!isUploading) fileInputRefs.current[`video-${ep}`]?.click() }}
                        >
                          <div className={styles.miniDropZoneIcon}>🎬</div>
                          <div className={styles.miniDropZoneTitle}>
                            {epFiles.video ? epFiles.video.name : 'Chọn Video'}
                          </div>
                          {epFiles.video && (
                            <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
                              {formatFileSize(epFiles.video.size)}
                            </div>
                          )}
                          <input
                            ref={(el) => { fileInputRefs.current[`video-${ep}`] = el; }}
                            type="file"
                            accept=".mp4,.mkv,.webm"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleVideoSelect(e.target.files[0], ep);
                            }}
                          />
                        </div>

                        {/* Subtitle */}
                        <div
                          className={`${styles.miniDropZone} ${subtitleDragOver === ep ? styles.dragOver : ''}`}
                          onDragOver={(e) => { handleDragOver(e); setSubtitleDragOver(ep); }}
                          onDragLeave={() => setSubtitleDragOver(null)}
                          onDrop={(e) => handleDrop(e, 'subtitle', ep)}
                          onClick={() => { if (!isUploading) fileInputRefs.current[`subtitle-${ep}`]?.click() }}
                        >
                          <div className={styles.miniDropZoneIcon}>📝</div>
                          <div className={styles.miniDropZoneTitle}>
                            {epFiles.subtitle ? epFiles.subtitle.name : 'Chọn Phụ đề (.vtt)'}
                          </div>
                          {epFiles.subtitle && (
                            <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
                              {formatFileSize(epFiles.subtitle.size)}
                            </div>
                          )}
                          <input
                            ref={(el) => { fileInputRefs.current[`subtitle-${ep}`] = el; }}
                            type="file"
                            accept=".vtt"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleSubtitleSelect(e.target.files[0], ep);
                            }}
                          />
                        </div>
                      </div>

                      {epFiles.previewUrl && !isUploading && (
                        <div className={styles.videoPreview} style={{ marginTop: '12px' }}>
                          <video src={epFiles.previewUrl} controls preload="metadata" style={{ maxHeight: '200px' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Buttons */}
              <div className={styles.buttonGroup}>
                <button
                  className={styles.btnSecondary}
                  onClick={() => setCurrentStep('episode')}
                  disabled={isUploading}
                >
                  Quay Lại
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={handleUpload}
                  disabled={isUploading || selectedEpisodes.length === 0}
                  id="upload-submit-btn"
                >
                  {isUploading ? 'Đang Upload...' : '🚀 Bắt Đầu Upload'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* EPISODE MANAGER MODAL */}
      {managingEpisode && (
        <div className={styles.modalOverlay} onClick={() => setManagingEpisode(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Quản lý Tập {managingEpisode.episodeNumber}</h3>
              <button className={styles.closeModalBtn} onClick={() => setManagingEpisode(null)}>✕</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.episodeStatusBox}>
                <div className={styles.statusRow}>
                  <strong>Trạng thái Video (HLS):</strong> 
                  <span className={managingEpisode.hasHls ? styles.textSuccess : styles.textWarning}>
                    {managingEpisode.hasHls ? t('Admin:uploadMovie.episode.hasSource') : t('Admin:uploadMovie.episode.noSourceHls')}
                  </span>
                </div>
                <div className={styles.statusRow}>
                  <strong>Phụ đề (VTT):</strong> 
                  <span className={managingEpisode.hasSubtitle ? styles.textSuccess : styles.textDanger}>
                    {managingEpisode.hasSubtitle ? t('Admin:uploadMovie.episode.hasSource') : t('Admin:uploadMovie.episode.noSourceVtt')}
                  </span>
                </div>
              </div>

              <div className={styles.updateSourceSection}>
                <h4>🔄 Cập nhật Source (Ghi đè)</h4>
                <p className={styles.warningText}>Tính năng này sẽ xóa sạch source cũ và tiến hành băm HLS lại từ đầu với file video mới!</p>
                
                <div className={styles.fileInputGroup}>
                  <label className={styles.formLabel}>Video mới (MP4/MKV):</label>
                  <input 
                    type="file" 
                    className={styles.fileInput}
                    accept="video/mp4,video/x-mkv,video/mkv,video/webm" 
                    onChange={(e) => e.target.files && setManageVideoFile(e.target.files[0])} 
                  />
                  {manageVideoFile && <div className={styles.fileName}>{manageVideoFile.name}</div>}
                </div>
                
                <div className={styles.fileInputGroup}>
                  <label className={styles.formLabel}>Phụ đề mới (VTT) - Tùy chọn:</label>
                  <input 
                    type="file" 
                    className={styles.fileInput}
                    accept=".vtt" 
                    onChange={(e) => e.target.files && setManageSubtitleFile(e.target.files[0])} 
                  />
                  {manageSubtitleFile && <div className={styles.fileName}>{manageSubtitleFile.name}</div>}
                </div>

                <button 
                  className={styles.btnPrimary} 
                  style={{ width: '100%', marginTop: '20px' }}
                  disabled={!manageVideoFile || isUpdatingSource}
                  onClick={handleUpdateSource}
                >
                  {isUpdatingSource ? 'Đang tải lên và xử lý...' : 'Tải lên & Thay thế Source'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        type={confirmModalState.type}
        onConfirm={confirmModalState.onConfirm}
        onCancel={closeConfirmModal}
      />
    </div>
  );
}

export default AdminUploadMovie;
