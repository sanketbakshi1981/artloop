import React, { useState } from 'react';
import { useLocation } from '@docusaurus/router';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import PayPalCheckout from '../../components/PayPalCheckout/PayPalCheckout';
import { sendOrderConfirmationEmail, OrderData } from '../../services/emailService';
import styles from './event.module.css';
import { getEventById } from '../../data/eventsData';

export default function EventDetail(): JSX.Element {
  const location = useLocation();
  const eventId = parseInt(location.pathname.split('/').pop() || '0', 10);
  const event = getEventById(eventId);
  
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [showPayPal, setShowPayPal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  if (!event) {
    return (
      <Layout title="Event Not Found">
        <div className={styles.notFound}>
          <h1>Event Not Found</h1>
          <p>The event you're looking for doesn't exist.</p>
          <Link to="/">Return to Homepage</Link>
        </div>
      </Layout>
    );
  }

  const handleGetTickets = () => {
    setShowTicketModal(true);
    setShowPayPal(false);
    setPaymentStatus('idle');
  };

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerInfo.fullName && customerInfo.email && customerInfo.phone) {
      setShowPayPal(true);
      setPaymentStatus('processing');
    }
  };

  const handlePaymentSuccess = async (details: any) => {
    console.log('Payment completed:', details);
    setPaymentStatus('success');
    
    // Prepare order data for email
    const orderData: OrderData = {
      orderID: details.id,
      customerName: customerInfo.fullName,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      ticketQuantity,
      totalAmount: totalPrice,
      paymentStatus: details.status,
    };
    
    console.log('Order data for confirmation:', orderData);
    
    // Send confirmation emails to customer and admins
    try {
      const emailSent = await sendOrderConfirmationEmail(orderData);
      if (emailSent) {
        console.log('Confirmation emails sent successfully');
      } else {
        console.warn('Failed to send confirmation emails, but payment was successful');
      }
    } catch (error) {
      console.error('Error sending confirmation emails:', error);
      // Don't fail the payment flow if email sending fails
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    setPaymentStatus('error');
  };

  const priceValue = parseFloat(event.price.replace('$', ''));
  const totalPrice = priceValue * ticketQuantity;

  return (
    <Layout title={event.title} description={event.description}>
      <div className={styles.eventDetailPage}>
        <div className={styles.heroImage}>
          <img src={event.image} alt={event.title} />
          <div className={styles.heroOverlay}>
            <div className="container">
              <h1 className={styles.eventTitle}>{event.title}</h1>
              <div className={styles.eventMeta}>
                <span className={styles.metaItem}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {event.date}
                </span>
                <span className={styles.metaItem}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {event.time}
                </span>
                <span className={styles.metaItem}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {event.venue}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles.contentWrapper}>
            <div className={styles.mainContent}>
              <section className={styles.section}>
                <h2>About This Event</h2>
                <p className={styles.description}>{event.fullDescription}</p>
              </section>

              <section className={styles.section}>
                <h2>Performer</h2>
                <h3>{event.performer}</h3>
                <p>{event.performerBio}</p>
              </section>

              <section className={styles.section}>
                <h2>Venue Information</h2>
                <p><strong>{event.venue}</strong></p>
                <p>{event.venueAddress}</p>
              </section>

              <section className={styles.section}>
                <h2>What's Included</h2>
                <ul className={styles.includesList}>
                  {event.includes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className={styles.sidebar}>
              <div className={styles.ticketCard}>
                <div className={styles.priceSection}>
                  <span className={styles.priceLabel}>Ticket Price</span>
                  <span className={styles.priceAmount}>{event.price}</span>
                </div>
                
                <div className={styles.ticketDetails}>
                  <div className={styles.detailRow}>
                    <span>Capacity:</span>
                    <strong>{event.capacity}</strong>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Dress Code:</span>
                    <strong>{event.dresscode}</strong>
                  </div>
                </div>

                <button 
                  className={styles.ticketButton}
                  onClick={handleGetTickets}>
                  Get Tickets
                </button>

                <div className={styles.shareSection}>
                  <p>Share this event:</p>
                  <div className={styles.shareButtons}>
                    <a href={`https://twitter.com/intent/tweet?text=Check out ${event.title}&url=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer">
                      Twitter
                    </a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showTicketModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <button 
                className={styles.closeButton}
                onClick={() => setShowTicketModal(false)}>
                ×
              </button>
              
              {paymentStatus === 'success' ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>✓</div>
                  <h2>Payment Successful!</h2>
                  <p>Thank you for your purchase, {customerInfo.fullName}!</p>
                  <p>A confirmation email has been sent to <strong>{customerInfo.email}</strong></p>
                  <div className={styles.orderSummary}>
                    <h3>Order Details</h3>
                    <p><strong>Event:</strong> {event.title}</p>
                    <p><strong>Date:</strong> {event.date}</p>
                    <p><strong>Time:</strong> {event.time}</p>
                    <p><strong>Venue:</strong> {event.venue}</p>
                    <p><strong>Tickets:</strong> {ticketQuantity}</p>
                    <p><strong>Total Paid:</strong> ${totalPrice.toFixed(2)}</p>
                  </div>
                  <button 
                    className={styles.submitButton}
                    onClick={() => setShowTicketModal(false)}>
                    Close
                  </button>
                </div>
              ) : paymentStatus === 'error' ? (
                <div className={styles.errorMessage}>
                  <h2>Payment Failed</h2>
                  <p>We couldn't process your payment. Please try again.</p>
                  <button 
                    className={styles.submitButton}
                    onClick={() => {
                      setPaymentStatus('idle');
                      setShowPayPal(false);
                    }}>
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <h2>Get Tickets</h2>
                  <div className={styles.modalBody}>
                    <div className={styles.ticketSelection}>
                      <label>Number of Tickets:</label>
                      <div className={styles.quantityControl}>
                        <button 
                          onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                          disabled={ticketQuantity <= 1 || showPayPal}>
                          -
                        </button>
                        <span>{ticketQuantity}</span>
                        <button 
                          onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                          disabled={ticketQuantity >= 10 || showPayPal}>
                          +
                        </button>
                      </div>
                    </div>

                    <div className={styles.totalPrice}>
                      <span>Total:</span>
                      <span className={styles.total}>${totalPrice.toFixed(2)}</span>
                    </div>

                    {!showPayPal ? (
                      <form className={styles.ticketForm} onSubmit={handleProceedToPayment}>
                        <input 
                          type="text" 
                          name="fullName"
                          placeholder="Full Name" 
                          value={customerInfo.fullName}
                          onChange={handleCustomerInfoChange}
                          required 
                        />
                        <input 
                          type="email" 
                          name="email"
                          placeholder="Email Address" 
                          value={customerInfo.email}
                          onChange={handleCustomerInfoChange}
                          required 
                        />
                        <input 
                          type="tel" 
                          name="phone"
                          placeholder="Phone Number" 
                          value={customerInfo.phone}
                          onChange={handleCustomerInfoChange}
                          required 
                        />
                        
                        <button type="submit" className={styles.submitButton}>
                          Proceed to Payment
                        </button>
                      </form>
                    ) : (
                      <div className={styles.paypalContainer}>
                        <p className={styles.paymentInfo}>
                          Complete your payment securely with PayPal
                        </p>
                        <PayPalCheckout
                          amount={totalPrice}
                          eventTitle={event.title}
                          ticketQuantity={ticketQuantity}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                        />
                        <button 
                          className={styles.backButton}
                          onClick={() => {
                            setShowPayPal(false);
                            setPaymentStatus('idle');
                          }}>
                          ← Back to Details
                        </button>
                      </div>
                    )}

                    {!showPayPal && (
                      <p className={styles.ticketNote}>
                        After clicking "Proceed to Payment", you'll be able to pay securely with PayPal.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
