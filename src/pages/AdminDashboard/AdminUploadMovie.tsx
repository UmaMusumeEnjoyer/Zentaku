import React, { useState, useRef, useCallback, useEffect } from 'react';
import { adminService } from '@umamusumeenjoyer/shared-logic';
import type { FilmServerEpisode } from '@umamusumeenjoyer/shared-logic';
import styles from './AdminUploadMovie.module.css';

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

const STEPS: { key: Step; label: string }[] = [
  { key: 'search', label: 'Chọn Anime' },
  { key: 'episode', label: 'Chọn Tập' },
  { key: 'upload', label: 'Upload File' },
];

// ==================== Helper ====================
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

// ==================== Component ====================
const AdminUploadMovie: React.FC = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState<Step>('search');
  const [searchMode, setSearchMode] = useState<'server' | 'new'>('server');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<any>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Server anime state
  const [serverAnimes, setServerAnimes] = useState<AnimeResult[]>([]);
  const [isFetchingServer, setIsFetchingServer] = useState(false);

  // Selected anime
  const [selectedAnime, setSelectedAnime] = useState<AnimeResult | null>(null);

  // Episode state
  const [episodeNumber, setEpisodeNumber] = useState<number>(1);
  const [existingEpisodes, setExistingEpisodes] = useState<FilmServerEpisode[]>([]);

  // File state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
  const [videoDragOver, setVideoDragOver] = useState(false);
  const [subtitleDragOver, setSubtitleDragOver] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);

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

  // ==================== File Handling ====================
  const handleVideoSelect = (file: File) => {
    const allowedExts = ['.mp4', '.mkv', '.webm'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExts.includes(ext)) {
      alert(`Invalid video format: ${ext}. Allowed: mp4, mkv, webm`);
      return;
    }
    setVideoFile(file);

    // Create preview URL
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
  };

  const handleSubtitleSelect = (file: File) => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (ext !== '.vtt') {
      alert(`Invalid subtitle format: ${ext}. Only .vtt is supported.`);
      return;
    }
    setSubtitleFile(file);
  };

  const handleDrop = (
    e: React.DragEvent,
    type: 'video' | 'subtitle'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setVideoDragOver(false);
    setSubtitleDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (type === 'video') handleVideoSelect(files[0]);
      else handleSubtitleSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // ==================== Upload Logic ====================
  const handleUpload = async () => {
    if (!selectedAnime || !episodeNumber) return;
    if (!videoFile && !subtitleFile) {
      alert('Please select at least a video or subtitle file.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await adminService.uploadEpisode({
        animeId: selectedAnime.id,
        episodeNumber,
        videoFile: videoFile || undefined,
        subtitleFile: subtitleFile || undefined,
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          }
        },
      });

      setUploadResult(result);
    } catch (err: any) {
      alert(`Upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep('search');
    setSelectedAnime(null);
    setEpisodeNumber(1);
    setVideoFile(null);
    setSubtitleFile(null);
    setUploadProgress(0);
    setUploadResult(null);
    setSearchQuery('');
    setSearchResults([]);
    setExistingEpisodes([]);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl(null);
  };

  // Fetch existing movies from FilmServer
  useEffect(() => {
    if (searchMode === 'server' && serverAnimes.length === 0) {
      const fetchServerMovies = async () => {
        setIsFetchingServer(true);
        try {
          const moviesObj = await adminService.getMovies();
          const animeIds = Object.keys(moviesObj).map(Number).filter(id => !isNaN(id));
          
          if (animeIds.length > 0) {
            // Fetch basic info for all these ids in parallel (limit to 20 for performance)
            const idsToFetch = animeIds.slice(0, 20);
            const infos = await Promise.all(
              idsToFetch.map(id => adminService.getAnimeBasicInfo(id).catch(() => null))
            );
            
            const validAnimes: AnimeResult[] = infos
              .filter(info => info && info.id)
              .map(info => info);
            
            setServerAnimes(validAnimes);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl]);

  // ==================== Step Helpers ====================
  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);

  const getStepClass = (idx: number) => {
    if (idx < stepIndex) return `${styles.stepItem} ${styles.completed}`;
    if (idx === stepIndex) return `${styles.stepItem} ${styles.active}`;
    return styles.stepItem;
  };

  // ==================== Render: Success State ====================
  if (uploadResult) {
    return (
      <div className={styles.uploadContainer}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>🎉</div>
          <div className={styles.successTitle}>Upload Thành Công!</div>
          <div className={styles.successSub}>
            Anime ID: {uploadResult.animeId} — Episode: {uploadResult.episodeNumber}
          </div>
          {uploadResult.conversionStatus === 'processing' && (
            <div className={styles.conversionNote}>
              ⏳ Video đang được chuyển đổi sang HLS. Quá trình này có thể mất vài phút.
            </div>
          )}
          <div className={styles.buttonGroup}>
            <button className={styles.btnPrimary} onClick={resetForm}>
              Upload Tập Khác
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              Anime Trên Server
            </div>
            <div 
              className={`${styles.searchModeTab} ${searchMode === 'new' ? styles.active : ''}`}
              onClick={() => setSearchMode('new')}
            >
              Tìm Anime Mới
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
                  placeholder="Tìm kiếm anime theo tên..."
                  value={searchQuery}
                  onChange={onSearchChange}
                  autoFocus
                />
              </div>

              {isSearching && (
                <div className={styles.searchLoading}>Đang tìm kiếm...</div>
              )}

              {!isSearching && searchResults.length === 0 && searchQuery.length >= 2 && (
                <div className={styles.noResults}>
                  Không tìm thấy kết quả cho "{searchQuery}"
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
                <div className={styles.searchLoading}>Đang tải danh sách anime từ server...</div>
              ) : serverAnimes.length === 0 ? (
                <div className={styles.noResults}>
                  Chưa có anime nào được lưu trên FilmServer.
                </div>
              ) : (
                <div className={styles.searchResults}>
                  {serverAnimes.map((anime) => (
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
              Thay đổi
            </button>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="episode-number-input">
              Số Tập (Episode Number)
            </label>
            <input
              id="episode-number-input"
              type="number"
              className={styles.episodeInput}
              min={1}
              max={9999}
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(parseInt(e.target.value, 10) || 1)}
            />
          </div>

          {/* Existing episodes from FilmServer */}
          {existingEpisodes.length > 0 && (
            <div className={styles.existingEpisodes}>
              <div className={styles.existingTitle}>
                Tập đã có trên FilmServer ({existingEpisodes.length})
              </div>
              <div className={styles.episodeGrid}>
                {existingEpisodes.map((ep) => (
                  <span
                    key={ep.episodeNumber}
                    className={`${styles.episodeTag} ${
                      ep.hasHls ? styles.episodeTagReady : styles.episodeTagProcessing
                    }`}
                  >
                    Ep {ep.episodeNumber} {ep.hasHls ? '✓' : '⏳'}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button
              className={styles.btnSecondary}
              onClick={() => setCurrentStep('search')}
            >
              Quay Lại
            </button>
            <button
              className={styles.btnPrimary}
              onClick={() => setCurrentStep('upload')}
              disabled={!episodeNumber || episodeNumber < 1}
            >
              Tiếp Tục
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
                AniList ID: {selectedAnime.id} — Episode: {String(episodeNumber).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Video Drop Zone */}
          <div
            className={`${styles.dropZone} ${videoDragOver ? styles.dragOver : ''}`}
            onDragOver={(e) => { handleDragOver(e); setVideoDragOver(true); }}
            onDragLeave={() => setVideoDragOver(false)}
            onDrop={(e) => handleDrop(e, 'video')}
            onClick={() => videoInputRef.current?.click()}
          >
            <div className={styles.dropZoneIcon}>🎬</div>
            <div className={styles.dropZoneTitle}>
              {videoFile ? 'Đổi file video' : 'Kéo thả file video vào đây'}
            </div>
            <div className={styles.dropZoneHint}>
              Chấp nhận: .mp4, .mkv, .webm (tối đa 5GB)
            </div>
            <input
              ref={videoInputRef}
              type="file"
              accept=".mp4,.mkv,.webm"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) handleVideoSelect(e.target.files[0]);
              }}
            />
          </div>

          {videoFile && (
            <div className={styles.filePreview}>
              <span className={styles.fileIcon}>🎞️</span>
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>{videoFile.name}</div>
                <div className={styles.fileSize}>{formatFileSize(videoFile.size)}</div>
              </div>
              <button
                className={styles.removeFileBtn}
                onClick={() => {
                  setVideoFile(null);
                  if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
                  setVideoPreviewUrl(null);
                }}
              >
                ✕ Xóa
              </button>
            </div>
          )}

          {/* Video Preview */}
          {videoPreviewUrl && (
            <div className={styles.videoPreview}>
              <video src={videoPreviewUrl} controls preload="metadata" />
            </div>
          )}

          {/* Subtitle Drop Zone */}
          <div
            className={`${styles.dropZone} ${subtitleDragOver ? styles.dragOver : ''}`}
            onDragOver={(e) => { handleDragOver(e); setSubtitleDragOver(true); }}
            onDragLeave={() => setSubtitleDragOver(false)}
            onDrop={(e) => handleDrop(e, 'subtitle')}
            onClick={() => subtitleInputRef.current?.click()}
            style={{ marginTop: '16px' }}
          >
            <div className={styles.dropZoneIcon}>📝</div>
            <div className={styles.dropZoneTitle}>
              {subtitleFile ? 'Đổi file phụ đề' : 'Kéo thả file phụ đề vào đây'}
            </div>
            <div className={styles.dropZoneHint}>
              Chấp nhận: .vtt
            </div>
            <input
              ref={subtitleInputRef}
              type="file"
              accept=".vtt"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) handleSubtitleSelect(e.target.files[0]);
              }}
            />
          </div>

          {subtitleFile && (
            <div className={styles.filePreview}>
              <span className={styles.fileIcon}>📄</span>
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>{subtitleFile.name}</div>
                <div className={styles.fileSize}>{formatFileSize(subtitleFile.size)}</div>
              </div>
              <button
                className={styles.removeFileBtn}
                onClick={() => setSubtitleFile(null)}
              >
                ✕ Xóa
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {isUploading && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className={styles.progressText}>
                Đang upload... {uploadProgress}%
              </div>
            </div>
          )}

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
              disabled={isUploading || (!videoFile && !subtitleFile)}
              id="upload-submit-btn"
            >
              {isUploading ? 'Đang Upload...' : '🚀 Bắt Đầu Upload'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUploadMovie;
