# Stripe Payment Integration Guide

## Overview

This guide will help you migrate from PayPal to Stripe for payment processing in your ArtLoop Events application.

## Prerequisites

1. A Stripe account (create one at [https://stripe.com](https://stripe.com))
2. Azure subscription (for hosting the backend API)
3. Node.js installed locally

## Step 1: Get Your Stripe API Keys

1. **Sign up or log in to Stripe**
   - Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
   - Create an account or sign in

2. **Get Your API Keys**
   - Navigate to "Developers" → "API keys"
   - You'll see two types of keys:
     - **Publishable key** (starts with `pk_test_` for test mode, `pk_live_` for production)
     - **Secret key** (starts with `sk_test_` for test mode, `sk_live_` for production)

3. **Test vs Live Mode**
   - Use **Test mode** keys for development and testing
   - Switch to **Live mode** keys only when ready for production
   - Test mode uses test credit card numbers (e.g., 4242 4242 4242 4242)

## Step 2: Configure Environment Variables

### Frontend Configuration (website/.env)

The `.env` file has already been updated with the Stripe configuration template:

```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

**Update this with your actual Stripe Publishable Key:**

1. Open `/workspaces/artloop/website/.env`
2. Replace `pk_test_YOUR_PUBLISHABLE_KEY_HERE` with your actual Stripe Publishable Key
3. Example:
   ```bash
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890...
   ```

### Backend Configuration (Azure Function)

**IMPORTANT:** The Secret Key should NEVER be committed to your repository or exposed to the client.

1. **Install Stripe SDK** in your API folder:
   ```bash
   cd /workspaces/artloop/api
   npm install stripe
   ```

2. **Configure Azure Function App Settings:**
   
   Go to Azure Portal → Your Function App → Configuration → Application Settings
   
   Add a new application setting:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_test_YOUR_SECRET_KEY_HERE` (replace with your actual secret key)

   Or use Azure CLI:
   ```bash
   az functionapp config appsettings set \
     --name your-function-app-name \
     --resource-group your-resource-group \
     --settings STRIPE_SECRET_KEY="sk_test_YOUR_SECRET_KEY_HERE"
   ```

## Step 3: Update Frontend to Call Backend API

The Stripe checkout component needs to call your backend to create a payment intent. Update the component:

Open `/workspaces/artloop/website/src/components/StripeCheckout/StripeCheckout.tsx` and replace the TODO section (around line 110) with:

```typescript
React.useEffect(() => {
  // Create payment intent by calling your backend
  const createPaymentIntent = async () => {
    try {
      const response = await fetch('https://your-function-app.azurewebsites.net/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInCents / 100, // Convert back to dollars
          eventTitle,
          ticketQuantity,
        }),
      });

      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        throw new Error(data.error || 'Failed to create payment intent');
      }
    } catch (err) {
      console.error('Error creating payment intent:', err);
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  createPaymentIntent();
}, [amountInCents, eventTitle, ticketQuantity]);
```

**Replace** `https://your-function-app.azurewebsites.net` with your actual Azure Function App URL.

## Step 4: Install Dependencies

```bash
cd /workspaces/artloop/website
npm install
```

This will install the Stripe React libraries:
- `@stripe/react-stripe-js`
- `@stripe/stripe-js`

## Step 5: Test the Integration

### Using Stripe Test Cards

Stripe provides test card numbers for testing payments:

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 9995 | Payment declined |
| 4000 0025 0000 3155 | Requires authentication (3D Secure) |

**Test Details:**
- **Expiry:** Any future date (e.g., 12/34)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

### Testing Steps

1. Start your development server:
   ```bash
   cd /workspaces/artloop/website
   npm start
   ```

2. Navigate to an event page
3. Click "Get Tickets"
4. Fill in customer information
5. Click "Proceed to Payment"
6. Enter test card details
7. Complete the payment
8. Verify the confirmation email is sent

### Monitor in Stripe Dashboard

1. Go to [https://dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)
2. View all test payments
3. Check payment details, metadata, and status

## Step 6: Deploy to Production

### Update to Live Keys

1. **Frontend (.env):**
   ```bash
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
   ```

2. **Backend (Azure Function App Settings):**
   ```bash
   az functionapp config appsettings set \
     --name your-function-app-name \
     --resource-group your-resource-group \
     --settings STRIPE_SECRET_KEY="sk_live_YOUR_LIVE_SECRET_KEY"
   ```

3. **Rebuild and Deploy:**
   ```bash
   npm run build
   # Deploy using your Azure Static Web Apps deployment process
   ```

### Important Production Checklist

- [ ] Switched from test keys to live keys
- [ ] Completed Stripe account verification
- [ ] Configured Stripe webhook endpoints (optional but recommended)
- [ ] Set up proper error handling and logging
- [ ] Tested the payment flow end-to-end
- [ ] Configured email notifications for successful payments
- [ ] Set up fraud prevention rules in Stripe Dashboard
- [ ] Review and accept Stripe's terms of service

## Step 7: Configure Webhooks (Optional but Recommended)

Webhooks allow Stripe to notify your backend when events occur (e.g., payment succeeded, failed, refunded).

1. **In Stripe Dashboard:**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - Enter your endpoint URL: `https://your-function-app.azurewebsites.net/api/stripe-webhook`
   - Select events to listen to:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`

2. **Get Webhook Signing Secret:**
   - After creating the webhook, copy the signing secret
   - Add it to Azure Function App settings as `STRIPE_WEBHOOK_SECRET`

3. **Create Webhook Handler Function** (optional):
   Create `/api/stripe-webhook/index.js` to handle webhook events

## Features

✅ Secure payment processing with Stripe  
✅ Support for multiple payment methods (cards, digital wallets)  
✅ Built-in fraud prevention  
✅ 3D Secure authentication support  
✅ Real-time payment confirmation  
✅ Detailed transaction logging  
✅ Automatic currency conversion  
✅ Mobile-optimized checkout experience  

## Stripe Advantages over PayPal

1. **Lower Fees:** 2.9% + $0.30 per transaction (vs PayPal's higher fees)
2. **Better Developer Experience:** Modern APIs and extensive documentation
3. **More Payment Methods:** Cards, Apple Pay, Google Pay, ACH, etc.
4. **Customizable Checkout:** Fully branded payment experience
5. **Advanced Features:** Subscriptions, invoicing, fraud detection
6. **Better Analytics:** Comprehensive dashboard and reporting

## Troubleshooting

### Issue: "Stripe requires a backend to create payment intents"

**Solution:** Make sure you've:
1. Created the Azure Function for `create-payment-intent`
2. Installed the Stripe npm package in the API folder
3. Configured `STRIPE_SECRET_KEY` in Azure Function App settings
4. Updated the frontend component to call your backend API

### Issue: "Invalid API Key"

**Solution:** 
1. Verify you're using the correct key (test vs live)
2. Check for extra spaces or characters in the key
3. Ensure the key starts with `pk_` (publishable) or `sk_` (secret)

### Issue: Payment fails with "card_declined"

**Solution:**
1. In test mode, use Stripe test card numbers
2. In live mode, ask the customer to contact their bank
3. Check if the card supports the currency (USD)

### Issue: "CORS Error"

**Solution:**
1. Ensure Azure Function has CORS configured
2. Add your website domain to allowed origins
3. Check the function.json allows POST and OPTIONS methods

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Azure Functions with Node.js](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node)

## Support

For Stripe-related issues:
- [Stripe Support](https://support.stripe.com/)
- [Stripe Discord](https://stripe.com/discord)

For ArtLoop-specific issues:
- Contact: sanket.bakshi@gmail.com
