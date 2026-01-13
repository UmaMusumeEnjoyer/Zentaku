import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRequestList } from '@umamusumeenjoyer/shared-logic';
import type { RequestListProps, ListRequest } from '@umamusumeenjoyer/shared-logic';

// Import CSS Module
import styles from './RequestList.module.css';

const RequestList: React.FC<RequestListProps> = ({ 
  requests = [], 
  onAccept, 
  onReject, 
  currentMembers = [] 
}) => {
  const { t } = useTranslation(['requestList']);
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
      <div key={req.request_id} className={styles.requestItem}>
        <div className={styles.reqUserRow}>
          <span className={styles.reqUsername}>@{req.username}</span>
          <span className={styles.reqTime}>
            {formatRequestDate(req.requested_at)}
          </span>
        </div>
        
        {req.message && <div className={styles.reqMsg}>"{req.message}"</div>}
        
        <div className={styles.reqActions}>
          {shouldShowAccept && (
            <button 
              className={`${styles.btnReqAction} ${styles.btnAccept}`}
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
            className={`${styles.btnReqAction} ${styles.btnReject}`}
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

  if (totalCount === 0) return null;

  return (
    <div className={`${styles.requestListContainer} ${totalCount > 0 ? styles.hasPending : ''}`}>
      {/* Header Summary */}
      <div className={styles.requestSummary} onClick={toggleExpanded}>
        <div className={styles.summaryTitle}>
          <span className="material-symbols-outlined" style={{color: '#facc15'}}>notifications_active</span>
          {t('requestList.pendingRequests')}
          <span className={styles.badgeCount}>{totalCount}</span>
        </div>
        <span className={`material-symbols-outlined ${styles.toggleIcon} ${isExpanded ? styles.expanded : ''}`}>
          expand_more
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={styles.requestContent}>
          {/* SECTION: JOIN REQUESTS */}
          {categorizedRequests.joinRequests.length > 0 && (
            <div className={styles.reqGroup}>
              <div className={styles.reqSectionTitle}>
                <span className="material-symbols-outlined" style={{fontSize: '16px'}}>person_add</span>
                {t('requestList.joinRequests')}
              </div>
              {categorizedRequests.joinRequests.map(renderRequestItem)}
            </div>
          )}

          {/* SECTION: EDIT REQUESTS */}
          {categorizedRequests.editRequests.length > 0 && (
            <div className={styles.reqGroup}>
              <div className={styles.reqSectionTitle}>
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