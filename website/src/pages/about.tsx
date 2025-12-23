import React from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function About(): JSX.Element {
  return (
    <Layout
      title="About Us"
      description="Learn more about ArtLoop - Where Art Comes Alive">
      <main>
        <div className={styles.container} style={{ padding: '2rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>About ArtLoop</h1>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
              ArtLoop is a platform that connects talented performers with hosts who want to bring 
              live entertainment to their events. We believe that art should be accessible to everyone, 
              and that every event deserves to be special.
            </p>
            
            <h2>Our Mission</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Our mission is to create a vibrant community where artists can showcase their talents 
              and hosts can discover the perfect entertainment for their events. Whether it's a 
              corporate gathering, private party, or community event, ArtLoop makes it easy to 
              find and book exceptional performers.
            </p>

            <h2>How It Works</h2>
            <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <h3>For Hosts</h3>
              <p>
                Browse our diverse selection of talented performers, view their profiles and 
                past performances, and easily book them for your events. Our platform makes 
                event planning seamless and stress-free.
              </p>

              <h3>For Performers</h3>
              <p>
                Create your profile, showcase your talent, and connect with hosts looking for 
                entertainment. Build your reputation through reviews and expand your performance 
                opportunities.
              </p>
            </div>

            <h2>Why Choose ArtLoop?</h2>
            <ul style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <li>Curated selection of talented performers across various genres</li>
              <li>Easy booking and communication system</li>
              <li>Secure payment processing</li>
              <li>Review and rating system for quality assurance</li>
              <li>Dedicated support team to help you every step of the way</li>
            </ul>
          </div>
        </div>
      </main>
    </Layout>
  );
}
