import React, { useState } from 'react';
import styles from './KanbanBoard.module.css';
import type { SupportTicket } from '@umamusumeenjoyer/shared-logic';
import { TicketStatus } from '@umamusumeenjoyer/shared-logic';
import KanbanCard from './KanbanCard';
import { useTranslation } from 'react-i18next';

interface KanbanBoardProps {
  tickets: SupportTicket[];
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => void;
}

const COLUMNS = [
  { id: TicketStatus.PENDING, titleKey: 'statusPending', className: styles.pending },
  { id: TicketStatus.IN_PROGRESS, titleKey: 'statusInProgress', className: styles.in_progress },
  { id: TicketStatus.RESOLVED, titleKey: 'statusResolved', className: styles.resolved },
  { id: TicketStatus.CLOSED, titleKey: 'statusClosed', className: styles.closed },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tickets, onStatusChange }) => {
  const { t } = useTranslation('AdminDashboard');
  const [dragOverColumn, setDragOverColumn] = useState<TicketStatus | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('ticketId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TicketStatus) => {
    e.preventDefault();
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: TicketStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const ticketId = e.dataTransfer.getData('ticketId');
    if (ticketId) {
      const ticket = tickets.find((t) => t.id.toString() === ticketId);
      if (ticket && ticket.status !== targetStatus) {
        onStatusChange(ticketId, targetStatus);
      }
    }
  };

  return (
    <div className={styles.board}>
      {COLUMNS.map((col) => {
        const columnTickets = tickets.filter((t) => t.status === col.id);
        
        return (
          <div 
            key={col.id} 
            className={`${styles.column} ${dragOverColumn === col.id ? styles.dragOver : ''}`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className={styles.columnHeader}>
              <h3 className={styles.columnTitle}>
                <span className={`${styles.statusDot} ${col.className}`}></span>
                {t(col.titleKey)}
              </h3>
              <span className={styles.count}>{columnTickets.length}</span>
            </div>
            <div className={styles.columnBody}>
              {columnTickets.map((ticket) => (
                <KanbanCard 
                  key={ticket.id.toString()} 
                  ticket={ticket} 
                  onDragStart={handleDragStart} 
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
