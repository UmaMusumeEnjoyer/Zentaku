import React, { useEffect, useState } from 'react';
import styles from './TicketManagement.module.css';
import { supportService, TicketStatus } from '@umamusumeenjoyer/shared-logic';
import type { SupportTicket } from '@umamusumeenjoyer/shared-logic';
import { toast } from 'react-toastify';

const TicketManagement: React.FC = () => {
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
      toast.error('Failed to load tickets');
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
      toast.success('Ticket status updated');
      fetchTickets();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading tickets...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Support Tickets</h2>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          <option value={TicketStatus.PENDING}>Pending</option>
          <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
          <option value={TicketStatus.RESOLVED}>Resolved</option>
          <option value={TicketStatus.CLOSED}>Closed</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Category</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.empty}>No tickets found</td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>#{ticket.id.toString().padStart(4, '0')}</td>
                  <td>{ticket.user?.username || 'Unknown'}</td>
                  <td><span className={styles.badge}>{ticket.category}</span></td>
                  <td>{ticket.title}</td>
                  <td className={styles.description}>{ticket.description}</td>
                  <td>
                    <span className={`${styles.badge} ${styles['status-' + ticket.status]}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={ticket.status} 
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value as TicketStatus)}
                      className={styles.actionSelect}
                    >
                      <option value={TicketStatus.PENDING}>Pending</option>
                      <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TicketStatus.RESOLVED}>Resolve</option>
                      <option value={TicketStatus.CLOSED}>Close</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketManagement;
