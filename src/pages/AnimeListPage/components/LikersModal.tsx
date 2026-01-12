import React from 'react';
import { useTranslation } from 'react-i18next'; // Import hook
import { useLikersModal } from '@umamusumeenjoyer/shared-logic';
import type { LikersModalProps } from '@umamusumeenjoyer/shared-logic';
import './LikersModal.css';

const LikersModal: React.FC<LikersModalProps> = ({ 
  isOpen, 
  onClose, 
  likersData, 
  totalShowing, 
  totalLikes 
}) => {
  const { t } = useTranslation(['likersModal']); // Khởi tạo hook dịch
  const { isEmpty, displayCount } = useLikersModal(likersData, totalLikes);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content likers-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t('likersModal.title')}</h3>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="modal-body">
          {isEmpty ? (
            <p className="empty-text">{t('likersModal.noLikes')}</p>
          ) : (
            <ul className="likers-list">
              {likersData.map((user) => (
                <li key={user.id} className="liker-item">
                  <span className="material-symbols-outlined user-icon">person</span>
                  <span className="liker-username">{user.username}</span>
                  {user.email_verified && (
                    <span 
                      className="material-symbols-outlined verified-icon" 
                      title={t('likersModal.verified')}
                    >
                      verified
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          
          <div className="modal-footer-info">
            {/* Sử dụng interpolation để truyền biến vào chuỗi dịch */}
            {t('likersModal.showingInfo', { displayCount, totalLikes })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikersModal;