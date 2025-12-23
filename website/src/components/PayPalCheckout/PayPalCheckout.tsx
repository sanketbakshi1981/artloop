import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface PayPalCheckoutProps {
  amount: number;
  eventTitle: string;
  ticketQuantity: number;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

export default function PayPalCheckout({
  amount,
  eventTitle,
  ticketQuantity,
  onSuccess,
  onError,
}: PayPalCheckoutProps): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const clientId = (siteConfig.customFields?.paypalClientId as string) || 'test';

  const initialOptions = {
    clientId: clientId,
    currency: 'USD',
    intent: 'capture',
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: `${eventTitle} - ${ticketQuantity} Ticket${ticketQuantity > 1 ? 's' : ''}`,
                amount: {
                  value: amount.toFixed(2),
                  currency_code: 'USD',
                },
              },
            ],
            application_context: {
              shipping_preference: 'NO_SHIPPING',
            },
          });
        }}
        onApprove={async (data, actions) => {
          try {
            const details = await actions.order.capture();
            console.log('Payment successful:', details);
            onSuccess(details);
          } catch (error) {
            console.error('Payment capture error:', error);
            onError(error);
          }
        }}
        onError={(err) => {
          console.error('PayPal error:', err);
          onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
}
