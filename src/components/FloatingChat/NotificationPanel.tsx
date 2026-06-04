import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './FloatingChat.module.css';
import type { FloatingRoom } from './useFloatingChat';

interface NotificationPanelProps {
  rooms: FloatingRoom[];
  unreadCounts: Map<string, number>;
  onRoomClick: (roomId: string) => void;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  rooms,
  unreadCounts,
  onRoomClick,
  onClose,
}) => {
  const { t } = useTranslation(['ChatApp']);
  const navigate = useNavigate();

  const handleOpenFullChat = () => {
    onClose();
    navigate('/chat');
  };

  // Sort: rooms with unread first, then by last message time
  const sortedRooms = [...rooms].sort((a, b) => {
    const unreadA = unreadCounts.get(a.id) || 0;
    const unreadB = unreadCounts.get(b.id) || 0;
    if (unreadA > 0 && unreadB === 0) return -1;
    if (unreadA === 0 && unreadB > 0) return 1;
    return (b.lastMessageRawTime || 0) - (a.lastMessageRawTime || 0);
  });

  return (
    <div className={styles.notificationPanel} id="floating-chat-notification-panel">
      {/* Header */}
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>{t('ChatApp:floatingChat.newMessages')}</h3>
        <button
          className={styles.panelCloseBtn}
          onClick={onClose}
          aria-label="Close panel"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
        </button>
      </div>

      {/* Room list */}
      <div className={styles.roomList}>
        {sortedRooms.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={`material-symbols-outlined ${styles.emptyStateIcon}`}>
              chat_bubble_outline
            </span>
            {t('ChatApp:floatingChat.noNewMessages')}
          </div>
        ) : (
          sortedRooms.map(room => {
            const unread = unreadCounts.get(room.id) || 0;
            const hasUnread = unread > 0;

            return (
              <div
                key={room.id}
                className={`${styles.roomItem} ${hasUnread ? styles.roomItemUnread : ''}`}
                onClick={() => onRoomClick(room.id)}
              >
                <img
                  src={room.avatar}
                  alt={room.name}
                  className={styles.roomAvatar}
                />
                <div className={styles.roomInfo}>
                  <div className={`${styles.roomName} ${hasUnread ? styles.roomNameUnread : ''}`}>
                    {room.name}
                  </div>
                  <div className={styles.roomLastMsg}>
                    {room.lastMessage || t('ChatApp:noMessagesYet')}
                  </div>
                </div>
                <div className={styles.roomMeta}>
                  {room.lastMessageTime && (
                    <span className={styles.roomTime}>{room.lastMessageTime}</span>
                  )}
                  {hasUnread && <span className={styles.roomUnreadDot} />}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className={styles.panelFooter}>
        <button
          className={styles.openFullChatLink}
          onClick={handleOpenFullChat}
        >
          {t('ChatApp:floatingChat.openFullChat')} →
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
