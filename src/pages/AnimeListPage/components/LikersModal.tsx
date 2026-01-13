import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLikersModal } from '@umamusumeenjoyer/shared-logic';
import type { LikersModalProps } from '@umamusumeenjoyer/shared-logic';

// Import CSS Module
import styles from './LikersModal.module.css';

const LikersModal: React.FC<LikersModalProps> = ({ 
  isOpen, 
  onClose, 
  likersData, 
  totalLikes 
}) => {
  const { t } = useTranslation(['likersModal']);
  const { isEmpty, displayCount } = useLikersModal(likersData, totalLikes);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Kiểm tra class từ module
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      {/* Giữ lại class 'modal-content' dạng string phòng trường hợp dùng global style, 
          nhưng style chính được lấy từ styles.likersModal */}
      <div 
        className={`modal-content ${styles.likersModal}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>{t('likersModal.title')}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {isEmpty ? (
            <p className={styles.emptyText}>{t('likersModal.noLikes')}</p>
          ) : (
            <ul className={styles.likersList}>
              {likersData.map((user) => (
                <li key={user.id} className={styles.likerItem}>
                  <span className={`material-symbols-outlined ${styles.userIcon}`}>person</span>
                  <span className={styles.likerUsername}>{user.username}</span>
                  {user.email_verified && (
                    <span 
                      className={`material-symbols-outlined ${styles.verifiedIcon}`} 
                      title={t('likersModal.verified')}
                    >
                      verified
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          
          <div className={styles.modalFooterInfo}>
            {t('likersModal.showingInfo', { displayCount, totalLikes })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikersModal;