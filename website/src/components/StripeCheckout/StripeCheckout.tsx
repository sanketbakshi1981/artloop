import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './StripeCheckout.module.css';

interface StripeCheckoutProps {
  amount: number;
  eventTitle: string;
  ticketQuantity: number;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

// Payment Form Component
function CheckoutForm({ 
  amount, 
  eventTitle, 
  ticketQuantity, 
  onSuccess, 
  onError 
}: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message || 'An unexpected error occurred.');
        onError(error);
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment successful:', paymentIntent);
        onSuccess({
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100, // Convert from cents
          created: paymentIntent.created,
        });
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setMessage('Payment failed. Please try again.');
      onError(err);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.checkoutForm}>
      <div className={styles.paymentDetails}>
        <h4>Payment Details</h4>
        <p className={styles.orderSummary}>
          {eventTitle} - {ticketQuantity} Ticket{ticketQuantity > 1 ? 's' : ''}
        </p>
        <p className={styles.totalAmount}>Total: ${amount.toFixed(2)}</p>
      </div>
      
      <div className={styles.paymentElement}>
        <PaymentElement />
      </div>
      
      {message && <div className={styles.errorMessage}>{message}</div>}
      
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className={styles.submitButton}
      >
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}

// Main Component
export default function StripeCheckout({
  amount,
  eventTitle,
  ticketQuantity,
  onSuccess,
  onError,
}: StripeCheckoutProps): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const publishableKey = (siteConfig.customFields?.stripePublishableKey as string) || '';

  // Initialize Stripe with publishable key
  const stripePromise = loadStripe(publishableKey);

  // Calculate amount in cents for Stripe
  const amountInCents = Math.round(amount * 100);

  // Stripe expects a client secret from your backend
  // For now, we'll create a payment intent on the client side
  // In production, you should create this on your backend
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // TODO: Replace this with a call to your backend to create a PaymentIntent
    // For now, this is a placeholder that needs backend implementation
    
    // Example backend call:
    // fetch('/api/create-payment-intent', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     amount: amountInCents,
    //     eventTitle,
    //     ticketQuantity,
    //   }),
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     setClientSecret(data.clientSecret);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     console.error('Error creating payment intent:', err);
    //     onError(err);
    //     setLoading(false);
    //   });

    // TEMPORARY: For development/testing purposes
    // You MUST implement a backend endpoint to create payment intents
    console.warn('⚠️ Stripe requires a backend to create payment intents. Please implement /api/create-payment-intent endpoint.');
    setLoading(false);
  }, [amountInCents, eventTitle, ticketQuantity]);

  const options = {
    clientSecret: clientSecret || undefined,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#635bff',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading payment form...</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className={styles.setupRequired}>
        <h4>⚠️ Setup Required</h4>
        <p>Stripe payment processing requires backend configuration.</p>
        <p>Please implement a backend endpoint to create payment intents.</p>
        <div className={styles.instructions}>
          <strong>Next Steps:</strong>
          <ol>
            <li>Create an API endpoint (e.g., <code>/api/create-payment-intent</code>)</li>
            <li>Use your Stripe Secret Key to create a PaymentIntent</li>
            <li>Return the client secret to the frontend</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stripeContainer}>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm
          amount={amount}
          eventTitle={eventTitle}
          ticketQuantity={ticketQuantity}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </div>
  );
}
