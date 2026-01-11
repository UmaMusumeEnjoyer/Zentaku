import React from 'react';
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
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="modal-body">
          <p className="input-label">Message (Optional):</p>
          <textarea 
            className="request-message-input"
            rows={4}
            placeholder={placeholder || "Why do you want to join/edit this list?"}
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
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;