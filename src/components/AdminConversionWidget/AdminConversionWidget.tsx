import React, { useState } from 'react';
import useSWR from 'swr';
import { adminService } from '@umamusumeenjoyer/shared-logic';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import styles from './AdminConversionWidget.module.css';

interface ConversionTask {
  startedAt: string;
  animeId: string | number;
  episodeNumber: string;
  pid: number;
  progress?: number;
  eta?: number;
}

const AdminConversionWidget: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  // Poll every 3 seconds
  const { data, error } = useSWR(
    '/admin/movies/conversion-status',
    async () => {
      const result = await adminService.getConversionStatus();
      return result?.activeConversions as Record<string, ConversionTask> || {};
    },
    { refreshInterval: 3000 }
  );

  const activeTasks = data ? Object.values(data) : [];

  // If no tasks and not loading/error, we can hide it completely
  // But let's show it if there's at least one task or if it recently finished
  if (activeTasks.length === 0) {
    return null;
  }

  const formatEta = (seconds?: number) => {
    if (seconds === undefined || seconds < 0) return 'Đang tính...';
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Loader2 size={16} className={styles.spinner} />
          Đang Xử Lý HLS ({activeTasks.length})
        </div>
        <button 
          className={styles.minimizeBtn} 
          onClick={() => setIsMinimized(!isMinimized)}
          title={isMinimized ? "Mở rộng" : "Thu gọn"}
        >
          {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {!isMinimized && (
        <div className={styles.content}>
          {activeTasks.map((task, idx) => {
            const prog = task.progress || 0;
            return (
              <div key={idx} className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.animeInfo}>
                    Phim {task.animeId} - Tập {task.episodeNumber}
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
                  ETA: {formatEta(task.eta)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminConversionWidget;
