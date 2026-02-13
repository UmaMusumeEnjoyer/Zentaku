import React from 'react';
import { useWatchAlong } from './useWatchAlong';
import styles from './WatchAlong.module.css';
import WatchAlongSkeleton from './WatchAlongSkeleton';

const WatchAlongPage: React.FC = () => {
  const { role, data, isLoading, error, actions } = useWatchAlong();

  if (isLoading) {
    return <WatchAlongSkeleton role={role} />;
  }

  if (error || !data) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2>Error: {error || 'No data available'}</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Navbar đã bị xóa theo yêu cầu */}
      
      <div className={styles.contentWrapper}>
        {/* Dynamic Left Sidebar */}
        <aside className={`${styles.leftSidebar} ${role === 'owner' ? styles.owner : styles.viewer}`}>
          <div className={styles.sidebarContent}>
            {role === 'owner' && (
              <div style={{ padding: '16px', fontWeight: 'bold', fontSize: '0.8rem', color: '#adadb8', textTransform: 'uppercase' }}>
                Stream Controls
              </div>
            )}
            
            {data.sidebarItems.map((item) => (
              <div key={item.id} className={styles.sidebarItem} title={item.name}>
                <i className="material-icons" style={{ color: role === 'owner' ? '#a970ff' : '#fff' }}>
                  {item.icon}
                </i>
                {role === 'owner' && (
                  <div className={styles.itemInfo}>
                    <span className={styles.itemLabel}>{item.name}</span>
                    <span className={styles.itemDetail}>{item.detail}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Dev Role Switcher: Moved here since Navbar is gone */}
          <button 
            className={styles.roleSwitchBtn} 
            onClick={actions.toggleRole}
            title={`Switch to ${role === 'viewer' ? 'Owner' : 'Viewer'}`}
          >
            <i className="material-icons">switch_account</i>
            {role === 'owner' && <span style={{ marginLeft: 8 }}>Switch Role</span>}
          </button>
        </aside>

        {/* Main Video Area */}
        <main className={styles.mainArea}>
          <div className={styles.videoPlayer}>
             <img 
               src={data.streamInfo.thumbnailUrl} 
               alt="Stream Preview" 
               style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.8 }} 
             />
             <div className="material-icons" style={{ fontSize: 64, position: 'absolute', color: 'white' }}>play_circle_outline</div>
             
             <div className={styles.videoOverlay}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                   <div>
                      <i className="material-icons">pause</i>
                      <i className="material-icons">volume_up</i>
                   </div>
                   <div>
                      <i className="material-icons">settings</i>
                      <i className="material-icons">fullscreen</i>
                   </div>
                </div>
             </div>
          </div>

          <div className={styles.streamInfo}>
            <div className={styles.infoHeader}>
              <div>
                <h1 className={styles.title}>{data.streamInfo.title}</h1>
                <div className={styles.host}>{data.streamInfo.hostName}</div>
                <div className={styles.tags}>
                  {data.streamInfo.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <div style={{ color: 'red', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                    <span style={{ width: 8, height: 8, background: 'red', borderRadius: '50%' }}></span>
                    LIVE
                 </div>
                 <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <i className="material-icons" style={{ fontSize: 14, verticalAlign: 'middle' }}>person</i>
                    {data.stats.viewers.toLocaleString()}
                 </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar (Chat) */}
        <aside className={styles.rightSidebar}>
          <div className={styles.chatHeader}>
            <span>Stream Chat</span>
          </div>
          
          <div className={styles.chatList}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: 8 }}>
              Welcome to the chat room!
            </div>
            {data.chatMessages.map((msg) => (
              <div key={msg.id} className={styles.message} style={{ opacity: msg.isSystem ? 0.7 : 1 }}>
                <span className={styles.timestamp}>{msg.timestamp}</span>
                <span className={styles.username} style={{ color: msg.color || 'var(--text-primary)' }}>
                  {msg.user}:
                </span>
                <span style={{ fontStyle: msg.isSystem ? 'italic' : 'normal' }}>
                  {msg.content}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.chatInputArea}>
            <textarea 
              className={styles.chatInput} 
              placeholder="Send a message..." 
              rows={1}
            />
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>0/500</span>
               <button className={styles.sendBtn} onClick={() => actions.sendMessage('Test')}>Chat</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WatchAlongPage;