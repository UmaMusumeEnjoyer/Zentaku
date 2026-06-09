import React, { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';
import { apiClient } from '@umamusumeenjoyer/shared-logic';
import TicketManagement from './TicketManagement';
import { useTranslation } from 'react-i18next';

interface SystemHealth {
  uptime: number;
  db: {
    status: string;
    pingMs: number;
  };
  animeServer: {
    status: string;
    pingMs: number;
  };
  cpu: {
    loadAvg1m: number;
    cores: number;
  };
  memory: {
    totalGb: string;
    usedGb: string;
    usagePercent: string;
  };
  timestamp: string;
}

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation('AdminDashboard');
  const [activeTab, setActiveTab] = useState<'health' | 'tickets'>('health');
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      const response = await apiClient.get('/admin/health');
      setHealth(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message ? t('error', { message: err.response.data.message }) : t('error', { message: 'Failed to fetch system health' }));
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>{t('systemControlCenter')}</h1>
      
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'health' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('health')}
        >
          {t('systemHealth')}
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'tickets' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          {t('supportTickets')}
        </button>
      </div>

      {activeTab === 'health' && (
        <>
          {error ? (
            <div className={styles.error}>{error}</div>
          ) : !health ? (
            <div className={styles.loading}>{t('loadingHealth')}</div>
          ) : (
            <div className={styles.metricsGrid}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>{t('systemUptime')}</div>
                <div className={styles.cardValue}>{formatUptime(health.uptime)}</div>
                <div className={styles.cardSub}>{t('nodeJsProcess')}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>{t('databaseStatus')}</div>
                <div className={`${styles.cardValue} ${health.db.status === 'up' ? styles.statusUp : styles.statusDown}`}>
                  {health.db.status.toUpperCase()}
                </div>
                <div className={styles.cardSub}>{t('ping', { ms: health.db.pingMs })}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>{t('animeServer')}</div>
                <div className={`${styles.cardValue} ${health.animeServer.status === 'up' ? styles.statusUp : styles.statusDown}`}>
                  {health.animeServer.status.toUpperCase()}
                </div>
                <div className={styles.cardSub}>{t('ping', { ms: health.animeServer.pingMs })}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>{t('cpuLoad')}</div>
                <div className={styles.cardValue}>{health.cpu.loadAvg1m.toFixed(2)}%</div>
                <div className={styles.cardSub}>{t('coresAvailable', { cores: health.cpu.cores })}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>{t('memoryUsage')}</div>
                <div className={styles.cardValue}>{health.memory.usagePercent}%</div>
                <div className={styles.cardSub}>{health.memory.usedGb}GB / {health.memory.totalGb}GB</div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'tickets' && (
        <TicketManagement />
      )}
    </div>
  );
};

export default AdminDashboard;
