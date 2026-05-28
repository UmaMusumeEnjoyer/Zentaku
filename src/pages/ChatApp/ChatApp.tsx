import React, { useState, useEffect, useRef } from 'react';
import { useChatMessenger } from './useChatApp';
import styles from './ChatApp.module.css';
import ChatMessengerSkeleton from './ChatAppSkeleton';
import { socketService } from '@umamusumeenjoyer/shared-logic';

const ChatMessenger: React.FC = () => {
  const { chatRooms, privateRooms, activeRoom, loading, error, setActiveRoomId, sendMessage, typingUsers } = useChatMessenger();
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'dm' | 'community'>('dm');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeRoom?.messages]);

  if (loading) return <ChatMessengerSkeleton />;
  if (error) return <div style={{ color: 'var(--text-primary)' }}>Đã xảy ra lỗi tải dữ liệu.</div>;

  const handleSend = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
      if (activeRoom) {
        socketService.emit('typing.stopped', { channelId: activeRoom.id });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (activeRoom) {
      if (e.target.value.trim() !== '') {
        socketService.emit('typing.started', { channelId: activeRoom.id });
      } else {
        socketService.emit('typing.stopped', { channelId: activeRoom.id });
      }
    }
  };

  const currentList = activeTab === 'dm' ? privateRooms : chatRooms;
  const onlineMembers = activeRoom?.members?.filter(m => m.status === 'online') || [];
  const offlineMembers = activeRoom?.members?.filter(m => m.status === 'offline') || [];

  return (
    <div className={styles.layout}>
      {/* Left Sidebar: Room List */}
      <aside className={styles.sidebarLeft}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarHeaderTitle}>Chats</h1>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              onClick={() => setActiveTab('dm')}
              style={{ flex: 1, padding: '5px', background: activeTab === 'dm' ? 'var(--primary-color)' : 'transparent', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}
            >
              Direct
            </button>
            <button 
              onClick={() => setActiveTab('community')}
              style={{ flex: 1, padding: '5px', background: activeTab === 'community' ? 'var(--primary-color)' : 'transparent', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}
            >
              Groups
            </button>
          </div>
        </div>
        <div className={styles.chatList}>
          {currentList?.map(room => (
            <div 
              key={room.id} 
              className={`${styles.chatItem} ${activeRoom?.id === room.id ? styles.chatItemActive : ''}`}
              onClick={() => setActiveRoomId(room.id)}
            >
              <div className={styles.avatarContainer}>
                <img src={room.avatar || 'https://i.pravatar.cc/150'} alt="avatar" className={styles.avatar} />
                <span className={`${styles.statusIndicator} ${styles.statusOnline}`}></span>
              </div>
              <div className={styles.chatItemInfo}>
                <h3 className={styles.chatItemName}>{room.name}</h3>
                <p className={styles.chatItemLastMsg}>{room.messages[room.messages.length - 1]?.content || 'Chưa có tin nhắn'}</p>
              </div>
            </div>
          ))}
          {currentList?.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Không có cuộc trò chuyện nào.
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={styles.mainChat}>
        {activeRoom ? (
          <>
            <header className={styles.chatHeader}>
              <h2 className={styles.chatHeaderTitle}>{activeRoom.name}</h2>
              {activeRoom.description && (
                <p className={styles.chatHeaderDesc}>{activeRoom.description}</p>
              )}
            </header>

            <div className={styles.messageArea}>
              {activeRoom.messages.map(msg => (
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
              {typingUsers.length > 0 && (
                <div className={styles.messageRow} style={{ opacity: 0.7 }}>
                  <div className={styles.messageContent}>
                    <div className={styles.messageText}><i>Ai đó đang gõ...</i></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputArea}>
              <div className={styles.inputWrapper}>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder={`Gửi tin nhắn tới ${activeRoom.name}`}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleSend}
                />
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            Chọn một đoạn chat để bắt đầu nhắn tin
          </div>
        )}
      </main>

      {/* Right Sidebar: Members */}
      {activeTab === 'community' && activeRoom && (
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
      )}
    </div>
  );
};

export default ChatMessenger;