import React from 'react';
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
          <h3>Liked by</h3>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="modal-body">
          {isEmpty ? (
            <p className="empty-text">No likes yet.</p>
          ) : (
            <ul className="likers-list">
              {likersData.map((user) => (
                <li key={user.id} className="liker-item">
                  <span className="material-symbols-outlined user-icon">person</span>
                  <span className="liker-username">{user.username}</span>
                  {user.email_verified && (
                    <span className="material-symbols-outlined verified-icon" title="Verified">verified</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          
          <div className="modal-footer-info">
            Showing {displayCount} of {totalLikes} likes
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikersModal;