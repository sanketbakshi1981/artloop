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

## PayPal Payment Integration

The event ticket purchasing system is integrated with PayPal for secure payments.

### Setup Instructions

1. **Create a PayPal Developer Account**
   - Go to [PayPal Developer](https://developer.paypal.com/)
   - Sign in or create an account
   - Navigate to "Dashboard" → "Apps & Credentials"

2. **Get Your Client ID**
   - In Sandbox mode (for testing):
     - Copy the "Client ID" from your Sandbox app
   - In Live mode (for production):
     - Switch to "Live" tab and copy your live "Client ID"

3. **Configure Environment Variable**
   - Create a `.env` file in the `website/` directory:
     ```bash
     REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id_here
     ```
   - For testing, use your Sandbox Client ID
   - For production, use your Live Client ID

4. **Test the Integration**
   - Start the development server: `npm start`
   - Navigate to any event page
   - Click "Get Tickets" and complete the payment flow
   - Use [PayPal Sandbox test accounts](https://developer.paypal.com/tools/sandbox/accounts/) for testing

### Testing with Sandbox

PayPal provides test buyer accounts for testing:
- **Email**: sb-buyer@personal.example.com (check your sandbox accounts)
- **Password**: Provided in PayPal Developer Dashboard

### Going Live

1. Switch from Sandbox to Live credentials in your `.env` file
2. Complete PayPal's business verification process
3. Update `REACT_APP_PAYPAL_CLIENT_ID` with your live Client ID
4. Rebuild and deploy your application

### Features

- ✅ Secure PayPal payment processing
- ✅ Real-time payment confirmation
- ✅ Order details with customer information
- ✅ Multiple ticket quantity support
- ✅ Success/error handling
- ✅ Payment status tracking

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
