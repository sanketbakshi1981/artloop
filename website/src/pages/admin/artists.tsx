import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import type { Artist } from '../../services/artistsService';
import { artistsService } from '../../services/artistsService';
import ArtistForm from '../../components/ArtistForm/index';
import ArtistsList from '../../components/ArtistsList/index';
import styles from './events.module.css'; // Reuse events admin styles

export default function AdminArtists(): React.JSX.Element {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [functionKey, setFunctionKey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Load artists
  const loadArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await artistsService.getAllArtists({ status: 'active' });
      setArtists(data);
    } catch (err) {
      setError(err.message || 'Failed to load artists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtists();
  }, []);

  // Handle authentication
  const handleAuth = () => {
    if (functionKey.trim()) {
      artistsService.setFunctionKey(functionKey.trim());
      setIsAuthenticated(true);
      localStorage.setItem('adminFunctionKey', functionKey.trim());
    }
  };

  // Auto-authenticate if key is in localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('adminFunctionKey');
    if (savedKey) {
      setFunctionKey(savedKey);
      artistsService.setFunctionKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setFunctionKey('');
    localStorage.removeItem('adminFunctionKey');
  };

  // Handle create/update artist
  const handleSaveArtist = async (artistData: Artist) => {
    try {
      setError(null);
      if (editingArtist?.id) {
        await artistsService.updateArtist(editingArtist.id, artistData);
      } else {
        await artistsService.createArtist(artistData);
      }
      await loadArtists();
      setShowForm(false);
      setEditingArtist(null);
    } catch (err) {
      setError(err.message || 'Failed to save artist');
      throw err;
    }
  };

  // Handle edit
  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this artist?')) return;

    try {
      setError(null);
      await artistsService.deleteArtist(id);
      await loadArtists();
    } catch (err) {
      setError(err.message || 'Failed to delete artist');
    }
  };

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <Layout title="Admin - Artists Management" description="Manage ArtLoop artists">
        <div className={styles.container}>
          <div className={styles.authContainer}>
            <h1>🔐 Admin Authentication</h1>
            <p>Enter your Azure Function Key to manage artists</p>
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
              Get your function key from: Azure Portal → Function App → artists-manage → Function Keys
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin - Artists Management" description="Manage ArtLoop artists">
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link to="/admin">← Back to Dashboard</Link>
        </div>
        <div className={styles.header}>
          <div>
            <h1>🎨 Artists Management</h1>
            <p>Manage all ArtLoop artists</p>
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
              setEditingArtist(null);
              setShowForm(!showForm);
            }}
            className={styles.primaryButton}
          >
            {showForm ? '✕ Cancel' : '+ Create New Artist'}
          </button>
          <button onClick={loadArtists} className={styles.secondaryButton}>
            🔄 Refresh
          </button>
        </div>

        {showForm && (
          <div className={styles.formSection}>
            <h2>{editingArtist ? 'Edit Artist' : 'Create New Artist'}</h2>
            <ArtistForm
              initialData={editingArtist}
              onSave={handleSaveArtist}
              onCancel={() => {
                setShowForm(false);
                setEditingArtist(null);
              }}
            />
          </div>
        )}

        <div className={styles.listSection}>
          <h2>All Artists ({artists.length})</h2>
          {loading ? (
            <div className={styles.loading}>Loading artists...</div>
          ) : artists.length === 0 ? (
            <div className={styles.empty}>
              No artists found. Create your first artist!
            </div>
          ) : (
            <ArtistsList
              artists={artists}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
