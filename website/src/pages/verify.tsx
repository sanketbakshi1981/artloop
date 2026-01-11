import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import Layout from '@theme/Layout';
import styles from './verify.module.css';

interface RegistrationDetails {
  registrationCode: string;
  customerEmail: string;
  customerName?: string;
  ticketQuantity: number;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  eventVenue?: string;
}

export default function VerifyRegistration(): JSX.Element {
  const location = useLocation();
  const [registrationData, setRegistrationData] = useState<RegistrationDetails | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse query parameters
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const email = searchParams.get('email');
    const quantity = searchParams.get('quantity');
    const name = searchParams.get('name');
    const event = searchParams.get('event');
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const venue = searchParams.get('venue');

    if (!code || !email || !quantity) {
      setError('Invalid or incomplete registration data in QR code.');
      setLoading(false);
      return;
    }

    // Set registration data
    setRegistrationData({
      registrationCode: code,
      customerEmail: decodeURIComponent(email),
      customerName: name ? decodeURIComponent(name) : undefined,
      ticketQuantity: parseInt(quantity, 10),
      eventTitle: event ? decodeURIComponent(event) : undefined,
      eventDate: date ? decodeURIComponent(date) : undefined,
      eventTime: time ? decodeURIComponent(time) : undefined,
      eventVenue: venue ? decodeURIComponent(venue) : undefined,
    });
    setLoading(false);
  }, [location]);

  return (
    <Layout title="Verify Registration" description="Verify your event registration">
      <div className={styles.verifyContainer}>
        <div className={styles.verifyCard}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Verifying registration...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <div className={styles.errorIcon}>⚠️</div>
              <h2>Verification Failed</h2>
              <p>{error}</p>
            </div>
          ) : registrationData ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <h1>Registration Verified!</h1>
              
              <div className={styles.detailsCard}>
                <h3>Registration Details</h3>
                
                <div className={styles.detailRow}>
                  <span className={styles.label}>Registration Code:</span>
                  <span className={styles.value}>{registrationData.registrationCode}</span>
                </div>
                
                {registrationData.customerName && (
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Name:</span>
                    <span className={styles.value}>{registrationData.customerName}</span>
                  </div>
                )}
                
                <div className={styles.detailRow}>
                  <span className={styles.label}>Email:</span>
                  <span className={styles.value}>{registrationData.customerEmail}</span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.label}>Number of Attendees:</span>
                  <span className={styles.value}>{registrationData.ticketQuantity}</span>
                </div>
                
                {registrationData.eventTitle && (
                  <>
                    <hr className={styles.divider} />
                    <h4>Event Information</h4>
                    
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Event:</span>
                      <span className={styles.value}>{registrationData.eventTitle}</span>
                    </div>
                    
                    {registrationData.eventDate && (
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Date:</span>
                        <span className={styles.value}>{registrationData.eventDate}</span>
                      </div>
                    )}
                    
                    {registrationData.eventTime && (
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Time:</span>
                        <span className={styles.value}>{registrationData.eventTime}</span>
                      </div>
                    )}
                    
                    {registrationData.eventVenue && (
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Venue:</span>
                        <span className={styles.value}>{registrationData.eventVenue}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className={styles.instructions}>
                <p>✓ This registration is valid</p>
                <p>Please allow entry for {registrationData.ticketQuantity} attendee{registrationData.ticketQuantity > 1 ? 's' : ''}</p>
              </div>
            </div>
          ) : (
            <div className={styles.error}>
              <div className={styles.errorIcon}>⚠️</div>
              <h2>No Registration Data</h2>
              <p>Please scan a valid QR code.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
