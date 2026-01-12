import React from 'react';
import { useTranslation } from 'react-i18next'; // Import hook
import { useRequestList } from '@umamusumeenjoyer/shared-logic';
import type { RequestListProps, ListRequest } from '@umamusumeenjoyer/shared-logic';
import './RequestList.css';

const RequestList: React.FC<RequestListProps> = ({ 
  requests = [], 
  onAccept, 
  onReject, 
  currentMembers = [] 
}) => {
  const { t } = useTranslation(['requestList']); // Khởi tạo hook dịch
  const {
    isExpanded,
    categorizedRequests,
    totalCount,
    toggleExpanded,
    checkShowAccept,
    formatRequestDate,
  } = useRequestList(requests, currentMembers);

  const renderRequestItem = (req: ListRequest) => {
    const shouldShowAccept = checkShowAccept(req);

    return (
      <div key={req.request_id} className="request-item">
        <div className="req-user-row">
          <span className="req-username">@{req.username}</span>
          <span className="req-time">
            {formatRequestDate(req.requested_at)}
          </span>
        </div>
        
        {req.message && <div className="req-msg">"{req.message}"</div>}
        
        <div className="req-actions">
          {shouldShowAccept && (
            <button 
              className="btn-req-action btn-accept"
              onClick={(e) => {
                e.stopPropagation();
                onAccept(req);
              }}
            >
              <span className="material-symbols-outlined" style={{fontSize: '16px'}}>check</span>
              {t('requestList.accept')}
            </button>
          )}
          
          <button 
            className="btn-req-action btn-reject"
            onClick={(e) => {
              e.stopPropagation();
              onReject(req);
            }}
          >
            <span className="material-symbols-outlined" style={{fontSize: '16px'}}>close</span>
            {t('requestList.reject')}
          </button>
        </div>
      </div>
    );
  };

  // Nếu không có request nào thì không render
  if (totalCount === 0) return null;

  return (
    <div className={`request-list-container ${totalCount > 0 ? 'has-pending' : ''}`}>
      {/* Header Summary */}
      <div className="request-summary" onClick={toggleExpanded}>
        <div className="summary-title">
          <span className="material-symbols-outlined" style={{color: '#facc15'}}>notifications_active</span>
          {t('requestList.pendingRequests')}
          <span className="badge-count">{totalCount}</span>
        </div>
        <span className={`material-symbols-outlined toggle-icon ${isExpanded ? 'expanded' : ''}`}>
          expand_more
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="request-content">
          {/* SECTION: JOIN REQUESTS */}
          {categorizedRequests.joinRequests.length > 0 && (
            <div className="req-group">
              <div className="req-section-title">
                <span className="material-symbols-outlined" style={{fontSize: '16px'}}>person_add</span>
                {t('requestList.joinRequests')}
              </div>
              {categorizedRequests.joinRequests.map(renderRequestItem)}
            </div>
          )}

          {/* SECTION: EDIT REQUESTS */}
          {categorizedRequests.editRequests.length > 0 && (
            <div className="req-group">
              <div className="req-section-title">
                <span className="material-symbols-outlined" style={{fontSize: '16px'}}>edit_note</span>
                {t('requestList.editAccessRequests')}
              </div>
              {categorizedRequests.editRequests.map(renderRequestItem)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestList;