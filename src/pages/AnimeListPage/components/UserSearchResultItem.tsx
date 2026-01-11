import React from 'react';
import { useUserSearchResultItem } from '@umamusumeenjoyer/shared-logic';
import type { UserSearchResultItemProps } from '@umamusumeenjoyer/shared-logic';

// Lấy biến môi trường từ Vite
const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;
const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR_URL;

const UserSearchResultItem: React.FC<UserSearchResultItemProps> = ({
  user,
  currentMembers,
  isEditorMode,
  isProcessing,
  onAddUser
}) => {
  // CẬP NHẬT: Truyền thêm DEFAULT_AVATAR và BACKEND_DOMAIN vào hook
  const {
    displayAvatar,
    isOwner,
    buttonState,
    statusText,
  } = useUserSearchResultItem(
    user, 
    currentMembers, 
    isEditorMode, 
    isProcessing, 
    DEFAULT_AVATAR, // Tham số thứ 5: Avatar mặc định
    BACKEND_DOMAIN  // Tham số thứ 6: Domain backend để nối chuỗi URL
  );

  return (
    <div className="user-card-item">
      <div className="user-card-info">
        <img src={displayAvatar} alt={user.username} className="user-card-avatar" />
        <div>
          <p className="user-card-name">
            {user.username}
            {user.email_verified && (
              <span className="material-symbols-outlined" 
                style={{fontSize: '14px', color: '#3db4f2', marginLeft: '4px', verticalAlign: 'middle'}}
                title="Verified Email">
                verified
              </span>
            )}
          </p>
          
          <p className="user-card-handle">
            <span style={{color: '#94a3b8', fontStyle: isOwner ? 'italic' : 'normal'}}>
              {statusText}
            </span>
          </p>
        </div>
      </div>

      <button 
        className={`btn-invite ${buttonState.className}`} 
        onClick={() => onAddUser(user)}
        disabled={buttonState.isDisabled}
        title={isOwner ? "Cannot modify Owner" : ""}
      >
        {isProcessing ? (
          <span className="material-symbols-outlined spin-icon" style={{fontSize: '18px'}}>sync</span>
        ) : (
          <>
            <span className="material-symbols-outlined" style={{fontSize: '18px'}}>
              {buttonState.icon}
            </span>
            {buttonState.text}
          </>
        )}
      </button>
    </div>
  );
};

export default UserSearchResultItem;