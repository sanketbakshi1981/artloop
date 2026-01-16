import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import type { Event } from '../../services/eventsService';
import { eventsService } from '../../services/eventsService';
import EventForm from '../../components/EventForm/index';
import EventsList from '../../components/EventsList/index';
import styles from './events.module.css';

export default function AdminEvents(): React.JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [functionKey, setFunctionKey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Load events
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getAllEvents({ status: 'active' });
      setEvents(data);
    } catch (err) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Handle authentication
  const handleAuth = () => {
    if (functionKey.trim()) {
      eventsService.setFunctionKey(functionKey.trim());
      setIsAuthenticated(true);
      localStorage.setItem('adminFunctionKey', functionKey.trim());
    }
  };

  // Auto-authenticate if key is in localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('adminFunctionKey');
    if (savedKey) {
      setFunctionKey(savedKey);
      eventsService.setFunctionKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setFunctionKey('');
    localStorage.removeItem('adminFunctionKey');
  };

  // Handle create/update event
  const handleSaveEvent = async (eventData: Event) => {
    try {
      setError(null);
      if (editingEvent?.id) {
        await eventsService.updateEvent(editingEvent.id, eventData);
      } else {
        await eventsService.createEvent(eventData);
      }
      await loadEvents();
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      setError(err.message || 'Failed to save event');
      throw err;
    }
  };

  // Handle edit
  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this event?')) return;

    try {
      setError(null);
      await eventsService.deleteEvent(id);
      await loadEvents();
    } catch (err) {
      setError(err.message || 'Failed to delete event');
    }
  };

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <Layout title="Admin - Events Management" description="Manage ArtLoop events">
        <div className={styles.container}>
          <div className={styles.authContainer}>
            <h1>🔐 Admin Authentication</h1>
            <p>Enter your Azure Function Key to manage events</p>
            <div className={styles.authForm}>
              <input
                type="password"
                placeholder="Function Key"
                value={functionKey}
                onChange={(e) => setFunctionKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                className={styles.authInput}
              />
              <button onClick={handleAuth} className={styles.authButton}>
                Authenticate
              </button>
            </div>
            <p className={styles.hint}>
              Get your function key from: Azure Portal → Function App → events-manage → Function Keys
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin - Events Management" description="Manage ArtLoop events">
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>🎭 Events Management</h1>
            <p>Manage all ArtLoop events - stored in Cosmos DB</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className={styles.actions}>
          <button
            onClick={() => {
              setEditingEvent(null);
              setShowForm(!showForm);
            }}
            className={styles.primaryButton}
          >
            {showForm ? '✕ Cancel' : '+ Create New Event'}
          </button>
          <button onClick={loadEvents} className={styles.secondaryButton}>
            🔄 Refresh
          </button>
        </div>

        {showForm && (
          <div className={styles.formSection}>
            <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
            <EventForm
              initialData={editingEvent}
              onSave={handleSaveEvent}
              onCancel={() => {
                setShowForm(false);
                setEditingEvent(null);
              }}
            />
          </div>
        )}

        <div className={styles.listSection}>
          <h2>All Events ({events.length})</h2>
          {loading ? (
            <div className={styles.loading}>Loading events...</div>
          ) : events.length === 0 ? (
            <div className={styles.empty}>
              No events found. Create your first event!
            </div>
          ) : (
            <EventsList
              events={events}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
