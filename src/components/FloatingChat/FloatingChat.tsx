import React, { useEffect, useRef, useState } from 'react';
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

  const [isHidden, setIsHidden] = useState<boolean>(() => {
    return localStorage.getItem('floatingChat_hidden') === 'true';
  });

  const handleHide = () => {
    setIsHidden(true);
    localStorage.setItem('floatingChat_hidden', 'true');
    closeNotificationPanel();
    if (openWindow) closeChatWindow();
  };

  const handleShow = () => {
    setIsHidden(false);
    localStorage.setItem('floatingChat_hidden', 'false');
  };

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

  if (isHidden) {
    return (
      <div className={styles.floatingChatContainer}>
        <button 
          className={styles.miniChevron} 
          onClick={handleShow}
          title="Show Chat"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
      </div>
    );
  }

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
        onHide={handleHide}
      />
    </div>
  );
};

export default FloatingChat;
