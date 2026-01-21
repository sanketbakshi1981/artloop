import React from 'react';
import { useLocation } from '@docusaurus/router';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './artists.module.css';
import { getArtistById, getEventIdsForArtist, getRatingStars, Artist } from '../../data/artistsData';
import { getEventById, Event } from '../../data/eventsData';

// Star Rating Component for Detail Page
function StarRating({ rating, size = 18 }: { rating: number; size?: number }) {
  const { full, half, empty } = getRatingStars(rating);
  
  return (
    <>
      {/* Full stars */}
      {[...Array(full)].map((_, i) => (
        <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      {/* Half star */}
      {half && (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
          <defs>
            <linearGradient id="halfGradDetail">
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>
          <polygon fill="url(#halfGradDetail)" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )}
      {/* Empty stars */}
      {[...Array(empty)].map((_, i) => (
        <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="#e2e8f0">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </>
  );
}

// Event Card for Artist Page
function ArtistEventCard({ event }: { event: Event }) {
  return (
    <Link to={`/events/${event.id}`} className={styles.eventCard}>
      <img 
        src={event.image} 
        alt={event.title}
        className={styles.eventImageSmall}
      />
      <div className={styles.eventInfo}>
        <h4 className={styles.eventTitle}>{event.title}</h4>
        <div className={styles.eventMeta}>
          <span className={styles.eventMetaItem}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {event.date}
          </span>
          <span className={styles.eventMetaItem}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {event.venue}
          </span>
          <span className={styles.eventMetaItem}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            {event.price}
          </span>
        </div>
      </div>
    </Link>
  );
}

// Social Icon Component
function SocialIcon({ type }: { type: 'instagram' | 'youtube' | 'spotify' | 'website' }) {
  switch (type) {
    case 'instagram':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    case 'youtube':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
        </svg>
      );
    case 'spotify':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"></circle>
          <path d="M8 15c3-1 6-.8 8 .5M7 12c4-1.2 8-.8 10 1M6 9c5-1.5 10-1 13 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
        </svg>
      );
    case 'website':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      );
  }
}

export default function ArtistDetail(): React.JSX.Element {
  const location = useLocation();
  const artistId = parseInt(location.pathname.split('/').pop() || '0', 10);
  const artist = getArtistById(artistId);
  
  // If artist not found
  if (!artist) {
    return (
      <Layout title="Artist Not Found">
        <div className={styles.notFound}>
          <h1>Artist Not Found</h1>
          <p>The artist you're looking for doesn't exist.</p>
          <Link to="/artists" className={styles.viewProfileButton}>
            Browse All Artists
          </Link>
        </div>
      </Layout>
    );
  }

  // Get events for this artist
  const eventIds = getEventIdsForArtist(artist.id);
  const artistEvents = eventIds.map(id => getEventById(id)).filter((e): e is Event => e !== undefined);

  return (
    <Layout
      title={`${artist.name} | Art Loop Artist`}
      description={artist.bio}>
      <div className={styles.artistDetailPage}>
        {/* Hero Section */}
        <section className={styles.artistHero}>
          <div className="container">
            <Link to="/artists" className={styles.backLink}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Artists
            </Link>
            <div className={styles.heroContent}>
              <div className={styles.heroImageWrapper}>
                <img 
                  src={artist.profileImage} 
                  alt={artist.name}
                  className={styles.heroProfileImage}
                />
              </div>
              <div className={styles.heroInfo}>
                <h1 className={styles.heroArtistName}>{artist.name}</h1>
                <div className={styles.heroTalentTags}>
                  {artist.talents.map((talent, index) => (
                    <span key={index} className={styles.heroTalentTag}>{talent}</span>
                  ))}
                </div>
                <div className={styles.heroRating}>
                  <div className={styles.heroStars}>
                    <StarRating rating={artist.rating} size={20} />
                  </div>
                  <span className={styles.heroReviewCount}>
                    {artist.rating.toFixed(1)} ({artist.totalReviews} reviews)
                  </span>
                </div>
                <div className={styles.heroLocation}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {artist.location}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="container">
          <div className={styles.contentWrapper}>
            {/* Main Content */}
            <main className={styles.mainContent}>
              {/* About Section */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitleDetail}>About</h2>
                <p className={styles.bioText}>{artist.fullBio}</p>
              </section>

              {/* Events Section */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitleDetail}>Upcoming Events</h2>
                {artistEvents.length > 0 ? (
                  <div className={styles.eventsGrid}>
                    {artistEvents.map((event) => (
                      <ArtistEventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noEvents}>
                    <p>No upcoming events scheduled. Check back soon!</p>
                  </div>
                )}
              </section>
            </main>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.bookingCard}>
                <h3 className={styles.bookingTitle}>Book {artist.name}</h3>
                <div className={styles.bookingDetails}>
                  <div className={styles.bookingRow}>
                    <span className={styles.bookingLabel}>Price Range</span>
                    <span className={styles.bookingValue}>{artist.priceRange}</span>
                  </div>
                  <div className={styles.bookingRow}>
                    <span className={styles.bookingLabel}>Availability</span>
                    <span className={styles.bookingValue}>{artist.availability}</span>
                  </div>
                  <div className={styles.bookingRow}>
                    <span className={styles.bookingLabel}>Rating</span>
                    <span className={styles.bookingValue}>⭐ {artist.rating.toFixed(1)}</span>
                  </div>
                  <div className={styles.bookingRow}>
                    <span className={styles.bookingLabel}>Reviews</span>
                    <span className={styles.bookingValue}>{artist.totalReviews}</span>
                  </div>
                </div>
                <button className={styles.bookingButton}>
                  Contact for Booking
                </button>

                {/* Social Links */}
                {artist.socialLinks && Object.keys(artist.socialLinks).length > 0 && (
                  <div className={styles.socialSection}>
                    <p className={styles.socialTitle}>Connect with {artist.name.split(' ')[0]}</p>
                    <div className={styles.socialLinks}>
                      {artist.socialLinks.instagram && (
                        <a 
                          href={artist.socialLinks.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.socialLink}
                          title="Instagram"
                        >
                          <SocialIcon type="instagram" />
                        </a>
                      )}
                      {artist.socialLinks.youtube && (
                        <a 
                          href={artist.socialLinks.youtube} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.socialLink}
                          title="YouTube"
                        >
                          <SocialIcon type="youtube" />
                        </a>
                      )}
                      {artist.socialLinks.spotify && (
                        <a 
                          href={artist.socialLinks.spotify} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.socialLink}
                          title="Spotify"
                        >
                          <SocialIcon type="spotify" />
                        </a>
                      )}
                      {artist.socialLinks.website && (
                        <a 
                          href={artist.socialLinks.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.socialLink}
                          title="Website"
                        >
                          <SocialIcon type="website" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
