import React, { useEffect, useState } from 'react';
import styles from './TicketManagement.module.css';
import { supportService, TicketStatus, chatService } from '@umamusumeenjoyer/shared-logic';
import type { SupportTicket } from '@umamusumeenjoyer/shared-logic';
import { toast } from 'react-toastify';
import KanbanBoard from './components/KanbanBoard';
import { FaTable, FaColumns, FaComment } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type ViewMode = 'table' | 'kanban';

const TicketManagement: React.FC = () => {
  const { t } = useTranslation('AdminDashboard');
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await supportService.getAdminTickets({ status: filterStatus });
      if (res.data && res.data.data) {
        setTickets(res.data.data);
      }
    } catch (error) {
      toast.error(t('failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  const handleStatusChange = async (id: string, newStatus: TicketStatus) => {
    try {
      await supportService.updateTicketStatus(id, { status: newStatus });
      toast.success(t('statusUpdated'));
      fetchTickets();
    } catch (error) {
      toast.error(t('failedToUpdate'));
    }
  };

  const handleMessageUser = async (userId: string) => {
    try {
      const res = await chatService.createOrGetPrivateChannel(userId);
      const channelId = res.data?.data?.id || res.data?.id;
      if (channelId) {
        navigate(`/chat?channelId=${channelId}`);
      } else {
        throw new Error('No channel ID returned');
      }
    } catch (error) {
      toast.error(t('failedToCreateChat'));
    }
  };

  if (loading) {
    return <div className={styles.loading}>{t('loadingTickets')}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{t('supportTickets')}</h2>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">{t('allStatuses')}</option>
          <option value={TicketStatus.PENDING}>{t('statusPending')}</option>
          <option value={TicketStatus.IN_PROGRESS}>{t('statusInProgress')}</option>
          <option value={TicketStatus.RESOLVED}>{t('statusResolved')}</option>
          <option value={TicketStatus.CLOSED}>{t('statusClosed')}</option>
        </select>
      </div>

      <div className={styles.controls}>
        <div className={styles.viewToggle}>
          <button 
            className={`${styles.toggleBtn} ${viewMode === 'table' ? styles.active : ''}`}
            onClick={() => setViewMode('table')}
            title={t('tableView')}
          >
            <FaTable />
          </button>
          <button 
            className={`${styles.toggleBtn} ${viewMode === 'kanban' ? styles.active : ''}`}
            onClick={() => setViewMode('kanban')}
            title={t('kanbanView')}
          >
            <FaColumns />
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('tableId')}</th>
              <th>{t('tableUser')}</th>
              <th>{t('tableCategory')}</th>
              <th>{t('tableTitle')}</th>
              <th>{t('tableDescription')}</th>
              <th>{t('tableStatus')}</th>
              <th>{t('tableActions')}</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.empty}>{t('noTicketsFound')}</td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>#{ticket.id.toString().padStart(4, '0')}</td>
                  <td>{ticket.user?.username || t('unknownUser')}</td>
                  <td><span className={styles.badge}>{ticket.category}</span></td>
                  <td>{ticket.title}</td>
                  <td className={styles.description}>{ticket.description}</td>
                  <td>
                    <span className={`${styles.badge} ${styles['status-' + ticket.status]}`}>
                      {t(
                        ticket.status === TicketStatus.PENDING ? 'statusPending' :
                        ticket.status === TicketStatus.IN_PROGRESS ? 'statusInProgress' :
                        ticket.status === TicketStatus.RESOLVED ? 'statusResolved' : 'statusClosed'
                      )}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <select 
                        value={ticket.status} 
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value as TicketStatus)}
                        className={styles.actionSelect}
                      >
                        <option value={TicketStatus.PENDING}>{t('statusPending')}</option>
                        <option value={TicketStatus.IN_PROGRESS}>{t('statusInProgress')}</option>
                        <option value={TicketStatus.RESOLVED}>{t('actionResolve')}</option>
                        <option value={TicketStatus.CLOSED}>{t('actionClose')}</option>
                      </select>
                      <button 
                        className={styles.messageBtn} 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMessageUser(ticket.userId.toString());
                        }}
                        title={t('messageUser')}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--primary-color)', fontSize: '1.2rem' }}
                      >
                        <FaComment />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      ) : (
        <KanbanBoard tickets={tickets} onStatusChange={handleStatusChange} onMessageUser={handleMessageUser} />
      )}
    </div>
  );
};

export default TicketManagement;
