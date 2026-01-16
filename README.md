# ArtLoop Events

A boutique event company website specializing in curated experiences that connect hosts and performers.

## Overview

ArtLoop Events is a Docusaurus-based website that showcases upcoming events and provides registration portals for both event hosts and performers. The platform facilitates the creation of memorable, high-quality events by connecting talented performers with hosts looking to create unique experiences.

## Features

### Homepage
- **3 Upcoming Events**: Beautiful event cards displayed prominently without scrolling on desktop
- **Event Information**: Each card shows date, time, venue, performer, and ticket price
- **Quick Navigation**: Direct links to event details and registration forms

### Event Details Pages
- **Comprehensive Information**: Full event descriptions, performer bios, and venue details
- **Ticket Purchase**: Interactive modal for selecting and purchasing tickets
- **What's Included**: Clear listing of all event perks and amenities
- **Social Sharing**: Share events on Twitter and Facebook

### Registration Forms

#### Host Registration
- Capture host information and event requirements
- Event type selection (corporate, private, wedding, gala, etc.)
- Budget and guest count preferences
- Custom event vision description
- Automatic email notification to sanket.bakshi@gmail.com

#### Performer Registration
- Artist profile submission
- Performance type and genre specification
- Experience level and location
- Portfolio/website and social media links
- Email submission to sanket.bakshi@gmail.com

## Technology Stack

- **Framework**: Docusaurus (React-based)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Email Integration**: FormSpree (requires setup)

## Quick Start

```bash
# Navigate to the website directory
cd website

# Install dependencies
npm install

# Start development server
npm start
```

The website will be available at `http://localhost:3000`

## Email Configuration

To enable email submissions from the registration forms:

1. Create a free account at [FormSpree.io](https://formspree.io/)
2. Create two forms (one for hosts, one for performers)
3. Update the form IDs in:
   - `website/src/pages/register/host.tsx` (line 39)
   - `website/src/pages/register/performer.tsx` (line 39)

See `website/README.md` for detailed setup instructions.

## Stripe Payment Integration

The event ticket purchasing system is integrated with Stripe for secure payments.

### Setup Instructions

1. **Create a Stripe Account**
   - Go to [Stripe](https://stripe.com/)
   - Sign up or log in to your account
   - Navigate to the Dashboard

2. **Get Your API Keys**
   - In the Stripe Dashboard, go to "Developers" → "API keys"
   - In Test mode (for development):
     - Copy the "Publishable key" (starts with `pk_test_`)
     - Copy the "Secret key" (starts with `sk_test_`)
   - In Live mode (for production):
     - Switch to "Live" mode and copy your live keys

3. **Configure Environment Variables**
   - Create a `.env` file in the `website/` directory:
     ```bash
     REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
     ```
   - Configure Azure Function App settings with your Secret key:
     ```bash
     STRIPE_SECRET_KEY=sk_test_your_secret_key_here
     ```

4. **Test the Integration**
   - Start the development server: `npm start`
   - Navigate to any event page
   - Click "Get Tickets" and complete the payment flow
   - Use Stripe test cards: `4242 4242 4242 4242` (any future date, any CVC)

### Testing with Stripe

Stripe provides test card numbers:
- **Successful Payment**: 4242 4242 4242 4242
- **Declined Payment**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155
- Use any future expiration date and any 3-digit CVC

### Going Live

1. Switch from Test to Live credentials in your environment variables
2. Complete Stripe's business verification process
3. Update both the publishable and secret keys with live versions
4. Rebuild and deploy your application

### Features

- ✅ Secure Stripe payment processing
- ✅ Real-time payment confirmation
- ✅ Order details with customer information
- ✅ Multiple ticket quantity support
- ✅ Success/error handling
- ✅ Payment status tracking
- ✅ Support for multiple payment methods
- ✅ Strong Customer Authentication (SCA) compliant

## Project Structure

```
artloop/
├── website/              # Main Docusaurus site
│   ├── src/
│   │   ├── pages/       # Page components
│   │   │   ├── index.tsx           # Homepage
│   │   │   ├── events/             # Event detail pages
│   │   │   └── register/           # Registration forms
│   │   └── css/         # Global styles
│   ├── static/          # Static assets
│   └── docusaurus.config.ts
└── README.md            # This file
```

## Development

```bash
# Start development server
cd website && npm start

# Build for production
cd website && npm run build

# Serve production build locally
cd website && npm run serve
```

## Deployment

The site can be deployed to:
- **GitHub Pages**: `npm run deploy` (after configuring)
- **Netlify**: Connect repository, build command: `npm run build`, publish directory: `build`
- **Vercel**: Connect repository, build command: `npm run build`, output directory: `build`

## Customization

### Adding New Events
1. Update `upcomingEvents` array in `website/src/pages/index.tsx`
2. Update `eventsData` object in `website/src/pages/events/[id].tsx`
3. Create new file `website/src/pages/events/[new-id].tsx`

### Changing Brand Colors
Edit `website/src/css/custom.css` to modify the color scheme.

### Updating Site Info
Edit `website/docusaurus.config.ts` for site title, navigation, and footer.

## Contact

For inquiries about hosting or performing at ArtLoop Events:
**Email**: sanket.bakshi@gmail.com

## License

Copyright © 2025 ArtLoop Events. All rights reserved.
