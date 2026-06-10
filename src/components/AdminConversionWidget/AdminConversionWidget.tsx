import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { adminService } from '@umamusumeenjoyer/shared-logic';
import { ChevronDown, ChevronUp, Loader2, UploadCloud } from 'lucide-react';
import styles from './AdminConversionWidget.module.css';
import { useTranslation } from 'react-i18next';

interface ConversionTask {
  startedAt: string;
  animeId: string | number;
  episodeNumber: string;
  pid: number;
  progress?: number;
  eta?: number;
}

interface UploadTask {
  animeId: string | number;
  episodeNumber: string | number;
  progress: number;
}

const AdminConversionWidget: React.FC = () => {
  const { t } = useTranslation(['Admin']);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeUploads, setActiveUploads] = useState<Record<string, UploadTask>>({});

  useEffect(() => {
    const handleProgress = (e: any) => {
      const { animeId, episodeNumber, progress } = e.detail;
      const key = `${animeId}_${episodeNumber}`;
      setActiveUploads(prev => ({
        ...prev,
        [key]: { animeId, episodeNumber, progress }
      }));
    };

    const handleComplete = (e: any) => {
      const { animeId, episodeNumber } = e.detail;
      const key = `${animeId}_${episodeNumber}`;
      setActiveUploads(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    };

    window.addEventListener('global-upload-progress', handleProgress);
    window.addEventListener('global-upload-complete', handleComplete);

    return () => {
      window.removeEventListener('global-upload-progress', handleProgress);
      window.removeEventListener('global-upload-complete', handleComplete);
    };
  }, []);

  const [completedConversions, setCompletedConversions] = useState<Set<string>>(new Set());

  // Poll every 1.5 seconds (reduced from 3s)
  const { data } = useSWR(
    '/admin/movies/conversion-status',
    async () => {
      const result = await adminService.getConversionStatus();
      // apiClient đã tự động bóc tách envelope { success, data } của Zentaku_BE
      // nên biến result lúc này chính là object Record chứa các task
      return (result || {}) as Record<string, ConversionTask & { status?: string }>;
    },
    { 
      refreshInterval: 1500,
      onSuccess: (newData) => {
        if (!newData) return;
        const newCompleted = new Set(completedConversions);
        Object.values(newData).forEach(task => {
          const isDone = task.progress! >= 100 || task.status === 'completed';
          const key = `${task.animeId}_${task.episodeNumber}`;
          
          if (isDone && !completedConversions.has(key)) {
            // Dispatch event to notify upload screen
            window.dispatchEvent(new CustomEvent('global-conversion-complete', {
              detail: { animeId: task.animeId, episodeNumber: task.episodeNumber }
            }));
            newCompleted.add(key);
          }
        });
        if (newCompleted.size !== completedConversions.size) {
          setCompletedConversions(newCompleted);
        }
      }
    }
  );

  // Lọc bỏ những task đã hoàn thành để ẩn ngay khỏi Widget
  const activeConversions = data 
    ? Object.values(data).filter(task => (task.progress || 0) < 100 && task.status !== 'completed')
    : [];
  const uploadsList = Object.values(activeUploads);
  
  const totalTasks = activeConversions.length + uploadsList.length;

  const formatEta = (seconds?: number) => {
    if (seconds === undefined || seconds < 0) return t('Admin:conversionWidget.calculating');
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Loader2 size={16} className={styles.spinner} style={{ animationDuration: totalTasks > 0 ? '1s' : '0s' }} />
          {t('Admin:conversionWidget.processing')} ({totalTasks})
        </div>
        <button 
          className={styles.minimizeBtn} 
          onClick={() => setIsMinimized(!isMinimized)}
          title={isMinimized ? t('Admin:conversionWidget.expand') : t('Admin:conversionWidget.collapse')}
        >
          {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {!isMinimized && (
        <div className={styles.content}>
          {totalTasks === 0 ? (
            <div className={styles.emptyState}>
              {t('Admin:conversionWidget.noTasks')}
            </div>
          ) : (
            <>
              {/* Uploads Section */}
              {uploadsList.map((task, idx) => (
            <div key={`up_${idx}`} className={styles.item}>
              <div className={styles.itemHeader}>
                <div className={styles.animeInfo}>
                  <UploadCloud size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }}/>
                  {t('Admin:conversionWidget.uploadTitle')} {task.animeId} - {t('Admin:conversionWidget.episode')} {task.episodeNumber}
                </div>
                <div className={styles.percentage}>{task.progress}%</div>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${task.progress}%`, background: '#10b981' }} 
                />
              </div>
            </div>
          ))}

          {/* Conversions Section */}
          {activeConversions.map((task, idx) => {
            const prog = task.progress || 0;
            return (
              <div key={`conv_${idx}`} className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.animeInfo}>
                    {t('Admin:conversionWidget.hlsTitle')} {task.animeId} - {t('Admin:conversionWidget.episode')} {task.episodeNumber}
                  </div>
                  <div className={styles.percentage}>{prog.toFixed(1)}%</div>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${prog}%` }} 
                  />
                </div>
                <div className={styles.eta}>
                  {t('Admin:conversionWidget.eta')}: {formatEta(task.eta)}
                </div>
              </div>
            );
          })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminConversionWidget;
