import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './artists.module.css';
import { getAllArtists, getAllTalents, getArtistsByTalent, Artist, getRatingStars } from '../../data/artistsData';

// Star Rating Component
function StarRating({ rating, showValue = true }: { rating: number; showValue?: boolean }) {
  const { full, half, empty } = getRatingStars(rating);
  
  return (
    <div className={styles.starRating}>
      {/* Full stars */}
      {[...Array(full)].map((_, i) => (
        <svg key={`full-${i}`} className={styles.starFull} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      {/* Half star */}
      {half && (
        <svg className={styles.starHalf} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>
          <polygon fill="url(#halfGrad)" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )}
      {/* Empty stars */}
      {[...Array(empty)].map((_, i) => (
        <svg key={`empty-${i}`} className={styles.starEmpty} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      {showValue && <span style={{ marginLeft: '0.5rem', fontWeight: 600, color: '#1a202c' }}>{rating.toFixed(1)}</span>}
    </div>
  );
}

// Artist Card Component
function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link to={`/artists/${artist.id}`} className={styles.artistCard}>
      <div className={styles.artistImageWrapper}>
        <img 
          src={artist.profileImage} 
          alt={artist.name}
          className={styles.artistImage}
        />
        {artist.featured && (
          <span className={styles.featuredBadge}>Featured</span>
        )}
        <div className={styles.ratingBadge}>
          <svg className={styles.starIcon} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {artist.rating.toFixed(1)}
        </div>
      </div>
      <div className={styles.artistContent}>
        <h3 className={styles.artistName}>{artist.name}</h3>
        <div className={styles.talentTags}>
          {artist.talents.slice(0, 3).map((talent, index) => (
            <span key={index} className={styles.talentTag}>{talent}</span>
          ))}
        </div>
        <p className={styles.artistBio}>{artist.bio}</p>
        <div className={styles.artistMeta}>
          <div className={styles.metaItem}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{artist.location}</span>
          </div>
          <div className={styles.metaItem}>
            <StarRating rating={artist.rating} showValue={false} />
            <span className={styles.reviewCount}>({artist.totalReviews} reviews)</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ArtistsPage(): React.JSX.Element {
  const allArtists = getAllArtists();
  const allTalents = getAllTalents();
  const [selectedTalent, setSelectedTalent] = useState<string>('All');
  
  // Filter artists based on selected talent
  const filteredArtists = selectedTalent === 'All' 
    ? allArtists 
    : getArtistsByTalent(selectedTalent);
  
  return (
    <Layout
      title="Discover Artists"
      description="Discover talented artists for your next event - musicians, performers, yoga instructors, and more">
      <div className={styles.artistsPage}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className="container">
            <h1 className={styles.heroTitle}>Discover Artists</h1>
            <p className={styles.heroSubtitle}>
              Find the perfect talent for your next event. From musicians to meditation guides, 
              explore our curated community of exceptional performers.
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className={styles.filterSection}>
          <div className="container">
            <div className={styles.filterContainer}>
              <span className={styles.filterLabel}>Filter by talent:</span>
              <button 
                className={`${styles.filterButton} ${selectedTalent === 'All' ? styles.filterButtonActive : ''}`}
                onClick={() => setSelectedTalent('All')}
              >
                All
              </button>
              {allTalents.slice(0, 8).map((talent) => (
                <button 
                  key={talent}
                  className={`${styles.filterButton} ${selectedTalent === talent ? styles.filterButtonActive : ''}`}
                  onClick={() => setSelectedTalent(talent)}
                >
                  {talent}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Artists Grid */}
        <section className={styles.artistsSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>
              {selectedTalent === 'All' ? 'All Artists' : `${selectedTalent} Artists`}
            </h2>
            
            {filteredArtists.length > 0 ? (
              <div className={styles.artistsGrid}>
                {filteredArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <h3>No artists found</h3>
                <p>Try selecting a different talent category.</p>
              </div>
            )}
          </div>
        </section>

        {/* Register as Performer CTA Section */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Are You a Performer?</h2>
              <p className={styles.ctaDescription}>
                Join our growing community of talented artists. Showcase your skills, 
                connect with hosts, and find opportunities for intimate performances.
              </p>
              <Link to="/register/performer" className={styles.ctaButton}>
                Register as Performer
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
