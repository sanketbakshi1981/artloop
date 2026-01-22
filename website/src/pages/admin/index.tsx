import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { eventsService } from '../../services/eventsService';
import { artistsService } from '../../services/artistsService';
import styles from './index.module.css';

export default function AdminDashboard(): React.JSX.Element {
  const [functionKey, setFunctionKey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({ events: 0, artists: 0 });
  const [loading, setLoading] = useState(true);

  // Handle authentication
  const handleAuth = () => {
    if (functionKey.trim()) {
      eventsService.setFunctionKey(functionKey.trim());
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
      eventsService.setFunctionKey(savedKey);
      artistsService.setFunctionKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  // Load stats when authenticated
  useEffect(() => {
    const loadStats = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const [eventsData, artistsData] = await Promise.all([
          eventsService.getAllEvents({ status: 'active' }),
          artistsService.getAllArtists({ status: 'active' })
        ]);
        setStats({
          events: eventsData.length,
          artists: artistsData.length
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [isAuthenticated]);

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setFunctionKey('');
    localStorage.removeItem('adminFunctionKey');
  };

  // Handle key press for auth form
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAuth();
    }
  };

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <Layout title="Admin Dashboard" description="ArtLoop Admin Dashboard">
        <div className={styles.authContainer}>
          <h1>🔐 Admin Dashboard</h1>
          <p>Enter your admin function key to access the dashboard.</p>
          <div className={styles.authForm}>
            <input
              type="password"
              placeholder="Function Key"
              value={functionKey}
              onChange={(e) => setFunctionKey(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.authInput}
            />
            <button onClick={handleAuth} className={styles.authButton}>
              Login
            </button>
          </div>
          <p className={styles.hint}>
            Contact the system administrator if you don't have access.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard" description="ArtLoop Admin Dashboard">
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>🎨 Admin Dashboard</h1>
            <p>Welcome to the ArtLoop administration panel</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>
                {loading ? '...' : stats.events}
              </span>
              <span className={styles.statLabel}>Active Events</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🎭</div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>
                {loading ? '...' : stats.artists}
              </span>
              <span className={styles.statLabel}>Active Artists</span>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <h2 className={styles.sectionTitle}>Management</h2>
        <div className={styles.cardsGrid}>
          <Link to="/admin/events" className={styles.card}>
            <div className={styles.cardIcon}>📅</div>
            <div className={styles.cardContent}>
              <h3>Manage Events</h3>
              <p>Create, edit, and manage art events. Set up schedules, venues, and ticket pricing.</p>
            </div>
            <div className={styles.cardArrow}>→</div>
          </Link>

          <Link to="/admin/artists" className={styles.card}>
            <div className={styles.cardIcon}>🎭</div>
            <div className={styles.cardContent}>
              <h3>Manage Artists</h3>
              <p>Add and manage artist profiles. Update bios, portfolios, and contact information.</p>
            </div>
            <div className={styles.cardArrow}>→</div>
          </Link>
        </div>

        {/* Quick Links */}
        <h2 className={styles.sectionTitle}>Quick Links</h2>
        <div className={styles.quickLinks}>
          <Link to="/events" className={styles.quickLink}>
            View Public Events Page
          </Link>
          <Link to="/artists" className={styles.quickLink}>
            View Public Artists Page
          </Link>
          <Link to="/" className={styles.quickLink}>
            Go to Homepage
          </Link>
        </div>
      </div>
    </Layout>
  );
}
