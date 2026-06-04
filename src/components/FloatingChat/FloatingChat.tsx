import React, { useEffect, useRef } from 'react';
import styles from './FloatingChat.module.css';
import { useFloatingChat } from './useFloatingChat';
import FloatingChatIcon from './FloatingChatIcon';
import NotificationPanel from './NotificationPanel';
import FloatingChatWindow from './FloatingChatWindow';

const FloatingChat: React.FC = () => {
  const {
    rooms,
    unreadCounts,
    totalUnread,
    openWindow,
    isNotificationPanelOpen,
    typingUsers,
    isPulse,
    activeRoom,
    currentUser,
    isAuthenticated,
    toggleNotificationPanel,
    closeNotificationPanel,
    openChatWindow,
    closeChatWindow,
    toggleMinimize,
    sendMessage,
    emitTyping,
  } = useFloatingChat();

  const containerRef = useRef<HTMLDivElement>(null);

  // Close notification panel when clicking outside
  useEffect(() => {
    if (!isNotificationPanelOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeNotificationPanel();
      }
    };

    // Delay to avoid immediately closing when clicking the icon
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationPanelOpen, closeNotificationPanel]);

  // Don't render anything if not authenticated
  if (!isAuthenticated) return null;

  return (
    <div className={styles.floatingChatContainer} ref={containerRef}>
      {/* Chat Window */}
      {openWindow && activeRoom && (
        <FloatingChatWindow
          room={activeRoom}
          currentUser={currentUser}
          isMinimized={openWindow.isMinimized}
          typingUsers={typingUsers}
          onClose={closeChatWindow}
          onMinimize={toggleMinimize}
          onSendMessage={sendMessage}
          onTyping={emitTyping}
        />
      )}

      {/* Notification Panel */}
      {isNotificationPanelOpen && (
        <NotificationPanel
          rooms={rooms}
          unreadCounts={unreadCounts}
          onRoomClick={openChatWindow}
          onClose={closeNotificationPanel}
        />
      )}

      {/* Floating Icon */}
      <FloatingChatIcon
        totalUnread={totalUnread}
        isPulse={isPulse}
        isActive={isNotificationPanelOpen}
        onClick={toggleNotificationPanel}
      />
    </div>
  );
};

export default FloatingChat;
