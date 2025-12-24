import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// Sample upcoming events data
const upcomingEvents = [
  {
    id: 1,
    title: 'Acoustic Bollywood Night',
    date: 'January 17, 2026',
    time: '7:00 PM - 10:00 PM',
    venue: '18 Pemberton Dr NJ',
    performer: 'Vikram Kumar',
    description: 'A fun evening of your favorite bollywood tunes performed live on acoustic guitar',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
    price: '$85',
  },
  {
    id: 2,
    title: 'Acoustic Sunset Session',
    date: 'January 28, 2026',
    time: '6:00 PM - 9:00 PM',
    venue: 'Rooftop Terrace',
    performer: 'Alex Rivera',
    description: 'Soulful acoustic melodies as the sun sets over the city',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    price: '$65',
  },
  {
    id: 3,
    title: 'Classical Gala Night',
    date: 'February 10, 2026',
    time: '8:00 PM - 11:00 PM',
    venue: 'Symphony Center',
    performer: 'Metropolitan Chamber Orchestra',
    description: 'A sophisticated evening of classical masterpieces',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80',
    price: '$95',
  },
];

function EventCard({ event }) {
  return (
    <div className={styles.eventCard}>
      <div className={styles.eventImage}>
        <img src={event.image} alt={event.title} />
        <div className={styles.eventPrice}>{event.price}</div>
      </div>
      <div className={styles.eventContent}>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        <div className={styles.eventDetails}>
          <div className={styles.eventDate}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{event.date}</span>
          </div>
          <div className={styles.eventTime}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{event.time}</span>
          </div>
          <div className={styles.eventVenue}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{event.venue}</span>
          </div>
        </div>
        <p className={styles.eventDescription}>{event.description}</p>
        <div className={styles.eventPerformer}>
          <strong>Performer:</strong> {event.performer}
        </div>
        <Link
          className={styles.eventButton}
          to={`/events/${event.id}`}>
          View Details & Get Tickets
        </Link>
      </div>
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Curated events connecting hosts and performers">
      <HomepageHeader />
      <main>
        <section className={styles.eventsSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Upcoming Events</h2>
            <div className={styles.eventsGrid}>
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.registrationSection}>
          <div className="container">
            <h2 className={styles.registrationTitle}>Where Art Meets Opportunity</h2>
            <p className={styles.registrationSubtitle}>
              Transform spaces into stages, moments into memories, and passion into performance
            </p>
            <div className={styles.registrationButtons}>
              <div className={styles.registrationCard}>
                <div className={styles.registrationIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <h3>Invite Experiences</h3>
                <p>Open your space to the magic of live performance. Create intimate concerts, acoustic sessions, or full-scale productions that transform your venue into a cultural destination</p>
                <Link
                  className={styles.registrationCardButton}
                  to="/register/host">
                  Become a Host
                </Link>
              </div>
              <div className={styles.registrationCard}>
                <div className={styles.registrationIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                </div>
                <h3>Share Your Artistry</h3>
                <p>From jazz to classical, rock to spoken word—your talent deserves an audience. Connect with venues hungry for authentic live performance and turn your art into unforgettable experiences</p>
                <Link
                  className={styles.registrationCardButton}
                  to="/register/performer">
                  Become a Performer
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
