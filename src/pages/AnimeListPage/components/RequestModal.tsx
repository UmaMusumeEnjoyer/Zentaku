import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRequestModal } from '@umamusumeenjoyer/shared-logic';
import type { RequestModalProps } from '@umamusumeenjoyer/shared-logic';

// Import CSS Module
import styles from './RequestModal.module.css';

const RequestModal: React.FC<RequestModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  placeholder, 
  isLoading 
}) => {
  const { t } = useTranslation(['requestModal']);
  const {
    message,
    handleMessageChange,
    handleSubmit,
  } = useRequestModal(isOpen, isLoading);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    // Sử dụng class overlay từ module hoặc global tuỳ cấu hình dự án, ở đây map vào module cho an toàn
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.requestModal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <p className={styles.inputLabel}>{t('requestModal.messageLabel')}</p>
          <textarea 
            className={styles.requestMessageInput}
            rows={4}
            placeholder={placeholder || t('requestModal.defaultPlaceholder')}
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className={styles.modalFooter}>
          {/* Giả sử class 'btn' là global style chung cho shape nút, chỉ override màu bằng styles.btnSecondary */}
          <button 
            className={`btn ${styles.btnSecondary}`} 
            onClick={onClose} 
            disabled={isLoading}
          >
            {t('requestModal.cancel')}
          </button>
          <button 
            className={`btn ${styles.btnPrimary}`} 
            onClick={() => handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? t('requestModal.sending') : t('requestModal.sendRequest')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;