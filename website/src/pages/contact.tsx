import React from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Contact(): JSX.Element {
  return (
    <Layout
      title="Contact Us"
      description="Get in touch with the ArtLoop team">
      <main>
        <div className={styles.container} style={{ padding: '2rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>Contact Us</h1>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
              Have questions or need assistance? We're here to help! Reach out to us through 
              any of the following channels.
            </p>

            <div style={{ marginTop: '3rem' }}>
              <h2>Email</h2>
              <p style={{ fontSize: '1.1rem' }}>
                For general inquiries: <a href="mailto:sanket.bakshi@gmail.com">sanket.bakshi@gmail.com</a>
              </p>
              <p style={{ fontSize: '1.1rem' }}>
                For support: <a href="mailto:support@artloop.com">support@artloop.com</a>
              </p>
              <p style={{ fontSize: '1.1rem' }}>
                For partnerships: <a href="mailto:partnerships@artloop.com">partnerships@artloop.com</a>
              </p>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <h2>Business Hours</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                Saturday - Sunday: Closed
              </p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <h2>Office Location</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                ArtLoop Headquarters<br />
                123 Creative Street<br />
                Arts District<br />
                City, State 12345<br />
                United States
              </p>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <h2>Follow Us</h2>
              <p style={{ fontSize: '1.1rem' }}>
                Stay connected with ArtLoop on social media for the latest updates, 
                featured performers, and community highlights.
              </p>
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '1.1rem' }}>
                  <strong>Facebook:</strong> @ArtLoopOfficial<br />
                  <strong>Instagram:</strong> @artloop<br />
                  <strong>Twitter:</strong> @artloop<br />
                  <strong>LinkedIn:</strong> ArtLoop
                </p>
              </div>
            </div>

            <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <h3>Quick Tips</h3>
              <ul style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                <li>For faster support, please include your account email or booking reference number</li>
                <li>Check our FAQ section on the home page for common questions</li>
                <li>For urgent booking issues, please include "URGENT" in your subject line</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
