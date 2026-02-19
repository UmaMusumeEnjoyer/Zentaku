import React from 'react';
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton'; // Path giả định
import styles from './ChatApp.module.css';

const dummyChats = Array.from({ length: 6 });
const dummyMessages = Array.from({ length: 4 });
const dummyMembers = Array.from({ length: 5 });

const ChatMessengerSkeleton: React.FC = () => {
  return (
    <div className={styles.layout}>
      {/* Skeleton Left Sidebar */}
      <aside className={styles.sidebarLeft}>
        <div className={styles.sidebarHeader}>
          <Skeleton width="80px" height="24px" borderRadius="4px" />
        </div>
        <div className={styles.chatList}>
          {dummyChats.map((_, i) => (
            <div key={i} className={styles.chatItem}>
              <div className={styles.avatarContainer}>
                <Skeleton width="40px" height="40px" borderRadius="50%" />
              </div>
              <div className={styles.chatItemInfo}>
                <Skeleton width="60%" height="14px" borderRadius="4px" style={{ marginBottom: '6px' }} />
                <Skeleton width="90%" height="12px" borderRadius="4px" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Skeleton Main Chat */}
      <main className={styles.mainChat}>
        <header className={styles.chatHeader}>
          <Skeleton width="150px" height="20px" borderRadius="4px" />
          <div className={styles.chatHeaderDesc}>
             <Skeleton width="200px" height="12px" borderRadius="4px" />
          </div>
        </header>

        <div className={styles.messageArea}>
          {dummyMessages.map((_, i) => (
            <div key={i} className={styles.messageRow}>
              <div className={styles.avatarContainer}>
                <Skeleton width="40px" height="40px" borderRadius="50%" />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageMeta}>
                  <Skeleton width="100px" height="14px" borderRadius="4px" />
                  <Skeleton width="60px" height="10px" borderRadius="4px" />
                </div>
                <div className={styles.messageText}>
                  <Skeleton width="80%" height="14px" borderRadius="4px" style={{ marginBottom: '4px' }} />
                  <Skeleton width={i % 2 === 0 ? "50%" : "95%"} height="14px" borderRadius="4px" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
             <Skeleton width="100%" height="24px" borderRadius="4px" />
          </div>
        </div>
      </main>

      {/* Skeleton Right Sidebar */}
      <aside className={styles.sidebarRight}>
        <div>
          <h3 className={styles.memberCategory}>
            <Skeleton width="80px" height="12px" borderRadius="4px" />
          </h3>
          <div className={styles.chatList}>
            {dummyMembers.map((_, i) => (
              <div key={i} className={styles.chatItem}>
                <div className={styles.avatarContainer}>
                  <Skeleton width="32px" height="32px" borderRadius="50%" />
                </div>
                <div className={styles.chatItemInfo}>
                  <Skeleton width="70%" height="14px" borderRadius="4px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ChatMessengerSkeleton;