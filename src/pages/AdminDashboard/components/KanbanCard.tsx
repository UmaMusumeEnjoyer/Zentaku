import React, { useState } from 'react';
import styles from './KanbanCard.module.css';
import type { SupportTicket } from '@umamusumeenjoyer/shared-logic';
import { FaUserCircle, FaComment } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface KanbanCardProps {
  ticket: SupportTicket;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onMessageUser?: (userId: string) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ ticket, onDragStart, onMessageUser }) => {
  const { t } = useTranslation('AdminDashboard');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    onDragStart(e, ticket.id.toString());
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.header}>
        <span className={styles.id}>#{ticket.id.toString().padStart(4, '0')}</span>
        <span className={`${styles.badge} ${styles[ticket.category.toLowerCase()] || styles.other}`}>
          {ticket.category}
        </span>
      </div>
      <h4 className={styles.title}>{ticket.title}</h4>
      <p className={styles.description}>{ticket.description}</p>
      <div className={styles.footer}>
        <div className={styles.user}>
          <FaUserCircle className={styles.userIcon} />
          <span>{ticket.user?.username || t('unknownUser')}</span>
          <button 
            className={styles.messageBtn} 
            onClick={(e) => {
              e.stopPropagation();
              if (onMessageUser) onMessageUser(ticket.userId.toString());
            }}
            title={t('messageUser')}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--primary-color)', marginLeft: '4px', display: 'flex', alignItems: 'center' }}
          >
            <FaComment />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
