import React from 'react';
import { useTranslation } from 'react-i18next'; // Import hook
import { useRequestModal } from '@umamusumeenjoyer/shared-logic';
import type { RequestModalProps } from '@umamusumeenjoyer/shared-logic';
import './RequestModal.css';

const RequestModal: React.FC<RequestModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  placeholder, 
  isLoading 
}) => {
  const { t } = useTranslation(['requestModal']); // Khởi tạo hook dịch
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
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content request-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          {/* Title được truyền từ props, nên cha component sẽ chịu trách nhiệm dịch title này */}
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="modal-body">
          <p className="input-label">{t('requestModal.messageLabel')}</p>
          <textarea 
            className="request-message-input"
            rows={4}
            // Nếu không có placeholder truyền vào, dùng translation mặc định
            placeholder={placeholder || t('requestModal.defaultPlaceholder')}
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onClose} 
            disabled={isLoading}
          >
            {t('requestModal.cancel')}
          </button>
          <button 
            className="btn btn-primary" 
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