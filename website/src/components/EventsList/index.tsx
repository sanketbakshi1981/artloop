import React from 'react';
import type { Event } from '../../services/eventsService';
import styles from './styles.module.css';

interface EventsListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export default function EventsList({ events, onEdit, onDelete }: EventsListProps): React.JSX.Element {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Event</th>
              <th>Date & Time</th>
              <th>Venue</th>
              <th>Performer</th>
              <th>Price</th>
              <th>Capacity</th>
              <th>Registrations</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className={styles.eventTitle}>
                  <div className={styles.titleCell}>
                    {event.image && (
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className={styles.thumbnail}
                      />
                    )}
                    <div>
                      <strong>{event.title}</strong>
                      {event.inviteOnly && <span className={styles.badge}>Invite Only</span>}
                      {event.isFree && <span className={styles.badgeFree}>Free</span>}
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.dateTime}>
                    <div>{event.date}</div>
                    <small>{event.time}</small>
                  </div>
                </td>
                <td>
                  <div className={styles.venue}>
                    <div>{event.venue}</div>
                    <small>{event.venueAddress}</small>
                  </div>
                </td>
                <td>{event.performer}</td>
                <td className={styles.price}>{event.price}</td>
                <td>{event.capacity}</td>
                <td className={styles.registrations}>
                  <span className={styles.count}>{event.registrationCount || 0}</span>
                </td>
                <td>
                  <span className={`${styles.status} ${styles[event.status || 'active']}`}>
                    {event.status || 'active'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      onClick={() => onEdit(event)}
                      className={styles.editButton}
                      title="Edit event"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => onDelete(event.id!)}
                      className={styles.deleteButton}
                      title="Cancel event"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
