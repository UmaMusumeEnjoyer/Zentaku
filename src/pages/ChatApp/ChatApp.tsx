import React, { useState } from 'react';
import { useChatMessenger } from './useChatApp'; // Path giả định theo yêu cầu
import styles from './ChatApp.module.css';
import ChatMessengerSkeleton from './ChatAppSkeleton';

const ChatMessenger: React.FC = () => {
  const { chatRooms, activeRoom, loading, error, setActiveRoomId, sendMessage } = useChatMessenger();
  const [inputValue, setInputValue] = useState('');

  if (loading) return <ChatMessengerSkeleton />;
  if (error || !chatRooms) return <div style={{ color: 'var(--text-primary)' }}>Đã xảy ra lỗi tải dữ liệu.</div>;

  const handleSend = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const onlineMembers = activeRoom?.members.filter(m => m.status === 'online') || [];
  const offlineMembers = activeRoom?.members.filter(m => m.status === 'offline') || [];

  return (
    <div className={styles.layout}>
      {/* Left Sidebar: Room List */}
      <aside className={styles.sidebarLeft}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarHeaderTitle}>Chats</h1>
        </div>
        <div className={styles.chatList}>
          {chatRooms.map(room => (
            <div 
              key={room.id} 
              className={`${styles.chatItem} ${activeRoom?.id === room.id ? styles.chatItemActive : ''}`}
              onClick={() => setActiveRoomId(room.id)}
            >
              <div className={styles.avatarContainer}>
                <img src={room.members[room.members.length - 1].avatar} alt="avatar" className={styles.avatar} />
                <span className={`${styles.statusIndicator} ${styles.statusOnline}`}></span>
              </div>
              <div className={styles.chatItemInfo}>
                <h3 className={styles.chatItemName}>{room.name}</h3>
                <p className={styles.chatItemLastMsg}>{room.messages[room.messages.length - 1]?.content}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={styles.mainChat}>
        <header className={styles.chatHeader}>
          <h2 className={styles.chatHeaderTitle}>{activeRoom?.name}</h2>
          {activeRoom?.description && (
            <p className={styles.chatHeaderDesc}>{activeRoom.description}</p>
          )}
        </header>

        <div className={styles.messageArea}>
          {activeRoom?.messages.map(msg => (
            <div key={msg.id} className={styles.messageRow}>
              <div className={styles.avatarContainer}>
                <img src={msg.sender.avatar} alt="avatar" className={styles.avatar} />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageMeta}>
                  <span className={styles.messageSender}>{msg.sender.name}</span>
                  <span className={styles.messageTime}>{msg.timestamp}</span>
                </div>
                <div className={styles.messageText}>{msg.content}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <input 
              type="text" 
              className={styles.inputField}
              placeholder={`Gửi tin nhắn tới ${activeRoom?.name}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleSend}
            />
          </div>
        </div>
      </main>

      {/* Right Sidebar: Members */}
      <aside className={styles.sidebarRight}>
        <div>
          <h3 className={styles.memberCategory}>Online — {onlineMembers.length}</h3>
          <div className={styles.chatList}>
            {onlineMembers.map(member => (
              <div key={member.id} className={styles.chatItem}>
                <div className={styles.avatarContainer}>
                  <img src={member.avatar} alt="avatar" className={styles.avatar} />
                  <span className={`${styles.statusIndicator} ${styles.statusOnline}`}></span>
                </div>
                <div className={styles.chatItemInfo}>
                  <span className={styles.chatItemName}>{member.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {offlineMembers.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h3 className={styles.memberCategory}>Offline — {offlineMembers.length}</h3>
            <div className={styles.chatList}>
              {offlineMembers.map(member => (
                <div key={member.id} className={styles.chatItem} style={{ opacity: 0.5 }}>
                  <div className={styles.avatarContainer}>
                    <img src={member.avatar} alt="avatar" className={styles.avatar} style={{ filter: 'grayscale(1)' }} />
                    <span className={`${styles.statusIndicator} ${styles.statusOffline}`}></span>
                  </div>
                  <div className={styles.chatItemInfo}>
                    <span className={styles.chatItemName}>{member.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default ChatMessenger;