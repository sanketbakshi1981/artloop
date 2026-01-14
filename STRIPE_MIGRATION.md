# Stripe Migration Quick Reference

## What Changed

### Files Modified
1. ✅ `/website/src/components/StripeCheckout/StripeCheckout.tsx` - New Stripe payment component
2. ✅ `/website/src/components/StripeCheckout/StripeCheckout.module.css` - Stripe component styles
3. ✅ `/website/src/pages/events/[id].tsx` - Updated to use Stripe instead of PayPal
4. ✅ `/website/src/pages/events/event.module.css` - Updated CSS class names
5. ✅ `/website/package.json` - Replaced PayPal packages with Stripe packages
6. ✅ `/website/.env` - Updated environment variables for Stripe
7. ✅ `/website/docusaurus.config.ts` - Updated custom fields for Stripe
8. ✅ `/api/create-payment-intent/index.js` - New Azure Function for Stripe
9. ✅ `/api/create-payment-intent/function.json` - Function configuration
10. ✅ `/api/package.json` - Added Stripe SDK

### Files to Delete (Optional Cleanup)
- `/website/src/components/PayPalCheckout/PayPalCheckout.tsx` - No longer needed

## Configuration Required

### 1. Frontend Environment Variable
**File:** `/workspaces/artloop/website/.env`

```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

👉 **Action:** Replace `pk_test_YOUR_KEY_HERE` with your Stripe Publishable Key

### 2. Backend Environment Variable
**Location:** Azure Function App → Configuration → Application Settings

```bash
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

👉 **Action:** Add this setting in Azure Portal or via Azure CLI

### 3. Update Frontend API Call
**File:** `/workspaces/artloop/website/src/components/StripeCheckout/StripeCheckout.tsx`  
**Line:** ~110

Replace the TODO section with your Azure Function URL:

```typescript
const response = await fetch('https://YOUR-FUNCTION-APP.azurewebsites.net/api/create-payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: amountInCents / 100,
    eventTitle,
    ticketQuantity,
  }),
});
```

👉 **Action:** Replace `YOUR-FUNCTION-APP` with your actual Azure Function App name

## Installation Steps

### 1. Install Frontend Dependencies
```bash
cd /workspaces/artloop/website
npm install
```

### 2. Install Backend Dependencies
```bash
cd /workspaces/artloop/api
npm install
```

## Testing

### Test Card Numbers
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 9995
- **3D Secure:** 4000 0025 0000 3155

**Details for all cards:**
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Test Locally
```bash
cd /workspaces/artloop/website
npm start
```

Navigate to an event → Get Tickets → Proceed to Payment → Use test card

## Going Live

### Switch to Live Keys

1. **Frontend (.env):**
   ```bash
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
   ```

2. **Backend (Azure):**
   ```bash
   STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
   ```

3. **Rebuild & Deploy:**
   ```bash
   npm run build
   # Deploy to Azure
   ```

## Key Differences: PayPal vs Stripe

| Feature | PayPal | Stripe |
|---------|--------|--------|
| **Integration** | Client-side only | Requires backend API |
| **Payment Flow** | Redirect to PayPal | Inline checkout form |
| **Fees** | 3.49% + $0.49 | 2.9% + $0.30 |
| **Setup** | Simple (client ID only) | More complex (needs backend) |
| **Payment Methods** | PayPal + cards | Cards, wallets, ACH, etc. |
| **Customization** | Limited | Highly customizable |
| **Analytics** | Basic | Advanced dashboard |

## Common Issues & Solutions

### ⚠️ "Stripe requires a backend"
**Cause:** Frontend can't connect to payment intent API  
**Fix:** Create and deploy the `create-payment-intent` Azure Function

### ⚠️ "Invalid API Key"
**Cause:** Wrong or missing Stripe keys  
**Fix:** Verify keys in Stripe Dashboard → Developers → API keys

### ⚠️ CORS Error
**Cause:** Azure Function not allowing requests from your domain  
**Fix:** Configure CORS in Azure Function App settings

### ⚠️ Payment fails in test mode
**Cause:** Using real card instead of test card  
**Fix:** Use Stripe test card numbers (4242 4242 4242 4242)

## Get Your Stripe Keys

1. **Sign up:** [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. **Get keys:** Dashboard → Developers → API keys
3. **Copy keys:**
   - Publishable key → `REACT_APP_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY` (Azure only!)

## Need Help?

📖 **Full Guide:** See `/workspaces/artloop/STRIPE_SETUP.md`  
🔗 **Stripe Docs:** [https://stripe.com/docs](https://stripe.com/docs)  
💬 **Support:** sanket.bakshi@gmail.com
