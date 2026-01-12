import React from 'react';
import { useTranslation } from 'react-i18next'; // Import hook
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
  const { t } = useTranslation(['userSearchModal']); // Khởi tạo hook dịch
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
    DEFAULT_AVATAR, 
    BACKEND_DOMAIN
  );

const getStatusDisplay = () => {
    if (isOwner) return `${t('userSearchResultItem.currently')}: ${t('userSearchResultItem.status.owner')}`;
    if (!statusText) return `${t('userSearchResultItem.assign')}: ${isEditorMode ? t('userSearchResultItem.status.editor') : t('userSearchResultItem.status.viewer')}`;
    
    // Map statusText từ hook
    const roleKey = statusText.toLowerCase(); 
    const roleLabel = t(`userSearchResultItem.status.${roleKey}`, { defaultValue: statusText });
    return `${t('userSearchResultItem.currently')}: ${roleLabel}`;
  };

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
                title={t('userSearchResultItem.verifiedEmail')}>
                verified
              </span>
            )}
          </p>
          
          <p className="user-card-handle">
            <span style={{color: '#94a3b8', fontStyle: isOwner ? 'italic' : 'normal'}}>
              {/* statusText đến từ logic hook, nếu cần dịch statusText, 
                  bạn cần xử lý trong hook hoặc map giá trị ở đây */}
              {getStatusDisplay()}
            </span>
          </p>
        </div>
      </div>

      <button 
        className={`btn-invite ${buttonState.className}`} 
        onClick={() => onAddUser(user)}
        disabled={buttonState.isDisabled}
        title={isOwner ? t('userSearchResultItem.cannotModifyOwner') : ""}
      >
        {isProcessing ? (
          <span className="material-symbols-outlined spin-icon" style={{fontSize: '18px'}}>sync</span>
        ) : (
          <>
            <span className="material-symbols-outlined" style={{fontSize: '18px'}}>
              {buttonState.icon}
            </span>
            {t(`userSearchResultItem.actions.${buttonState.text}`)}
          </>
        )}
      </button>
    </div>
  );
};

export default UserSearchResultItem;