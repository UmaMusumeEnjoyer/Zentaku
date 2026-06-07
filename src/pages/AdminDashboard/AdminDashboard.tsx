import React, { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';
import { apiClient } from '@umamusumeenjoyer/shared-logic';

interface SystemHealth {
  uptime: number;
  db: {
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
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      const response = await apiClient.get('/admin/health');
      setHealth(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch system health');
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

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!health) {
    return <div className={styles.loading}>Loading system health...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>System Control Center</h1>
      <div className={styles.metricsGrid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>System Uptime</div>
          <div className={styles.cardValue}>{formatUptime(health.uptime)}</div>
          <div className={styles.cardSub}>Node.js Process</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Database Status</div>
          <div className={`${styles.cardValue} ${health.db.status === 'up' ? styles.statusUp : styles.statusDown}`}>
            {health.db.status.toUpperCase()}
          </div>
          <div className={styles.cardSub}>Ping: {health.db.pingMs}ms</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>CPU Load</div>
          <div className={styles.cardValue}>{health.cpu.loadAvg1m.toFixed(2)}</div>
          <div className={styles.cardSub}>{health.cpu.cores} Cores Available</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Memory Usage</div>
          <div className={styles.cardValue}>{health.memory.usagePercent}%</div>
          <div className={styles.cardSub}>{health.memory.usedGb}GB / {health.memory.totalGb}GB</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
