import React from 'react';
import { useUserItem } from '@umamusumeenjoyer/shared-logic';
import type { UserItemProps } from '@umamusumeenjoyer/shared-logic';

const UserItem: React.FC<UserItemProps> = ({ 
  user, 
  roleIcon, 
  iconTitle, 
  onRemove, 
  canRemove, 
  isCurrentUser 
}) => {
  const { displayAvatar } = useUserItem(
    user.username, 
    user.avatar || user.avatar_url
  );

  return (
    <div className={`sidebar-user-item ${isCurrentUser ? 'current-user' : ''}`}>
      <div className="user-info">
        <img src={displayAvatar} alt={user.username} className="user-avatar" />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <p className="user-name">{user.username}</p>
            {isCurrentUser && <span className="you-badge">You</span>}
          </div>
          <p className="user-handle">@{user.username}</p> 
        </div>
      </div>
      
      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
        {roleIcon && (
          <span className="material-symbols-outlined role-icon" title={iconTitle}>
            {roleIcon}
          </span>
        )}
        
        {canRemove && onRemove && (
          <button 
            className="remove-member-btn"
            onClick={() => onRemove(user.username)}
            title="Remove member"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserItem;