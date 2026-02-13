import React from 'react';
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton';
import styles from './WatchAlong.module.css';
import  type{ UserRole } from './watchAlong.types';

interface Props {
  role: UserRole;
}

const WatchAlongSkeleton: React.FC<Props> = ({ role }) => {
  const sidebarItems = Array(5).fill(0);
  const chatItems = Array(10).fill(0);

  return (
    <div className={styles.container}>
      {/* Đã xóa Navbar Skeleton */}

      <div className={styles.contentWrapper}>
        <aside className={`${styles.leftSidebar} ${role === 'owner' ? styles.owner : styles.viewer}`}>
          <div className={styles.sidebarContent}>
             {role === 'owner' && (
                <div style={{ padding: '16px' }}>
                <Skeleton width={120} height={16} />
                </div>
             )}

             {sidebarItems.map((_, index) => (
                role === 'owner' ? (
                   <div key={index} className={styles.sidebarItem} style={{ background: 'transparent' }}>
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Skeleton width={24} height={24} borderRadius={4} />
                          <div style={{ marginLeft: 12, flex: 1 }}>
                              <Skeleton width="60%" height={14} style={{ marginBottom: 4 }} />
                              <Skeleton width="40%" height={10} />
                          </div>
                      </div>
                   </div>
                ) : (
                   <div key={index} className={styles.sidebarItem} style={{ marginBottom: 12 }}>
                      <Skeleton width={24} height={24} borderRadius={4} />
                   </div>
                )
             ))}
          </div>
          
          {/* Skeleton cho nút Switch Role */}
          <div style={{ padding: '0 10px' }}>
              <Skeleton width="100%" height={40} borderRadius={8} />
          </div>
        </aside>

        <main className={styles.mainArea}>
          <div className={styles.videoPlayer} style={{ background: 'var(--bg-subtle)' }}>
             <Skeleton width="100%" height="100%" borderRadius={0} />
          </div>

          <div className={styles.streamInfo}>
            <div className={styles.infoHeader}>
              <div style={{ width: '60%' }}>
                <Skeleton width="80%" height={28} style={{ marginBottom: 8 }} />
                <Skeleton width="30%" height={20} style={{ marginBottom: 12 }} />
                <div className={styles.tags}>
                  <Skeleton width={60} height={20} borderRadius={12} />
                  <Skeleton width={60} height={20} borderRadius={12} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                 <Skeleton width={50} height={20} />
                 <Skeleton width={40} height={16} />
              </div>
            </div>
          </div>
        </main>

        <aside className={styles.rightSidebar}>
           <div className={styles.chatHeader}>
              <Skeleton width={100} height={16} />
           </div>
           
           <div className={styles.chatList}>
              {chatItems.map((_, index) => (
                 <div key={index} style={{ marginBottom: 12, display: 'flex', alignItems: 'flex-start' }}>
                    <Skeleton width={30} height={12} style={{ marginRight: 6 }} />
                    <div style={{ flex: 1 }}>
                        <Skeleton width="30%" height={14} style={{ display: 'inline-block', marginRight: 4 }} />
                        <Skeleton width="60%" height={14} style={{ display: 'inline-block' }} />
                    </div>
                 </div>
              ))}
           </div>

           <div className={styles.chatInputArea}>
              <Skeleton width="100%" height={40} borderRadius={4} />
           </div>
        </aside>
      </div>
    </div>
  );
};

export default WatchAlongSkeleton;