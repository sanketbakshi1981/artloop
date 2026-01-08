# Free Event Registration Flow

## User Registration Process

```
┌─────────────────────────────────────────────────────────────────┐
│                    User visits Free Event Page                   │
│                   (e.g., /events/2 or /events/3)                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              User fills out Registration Form                    │
│              ┌─────────────────────────────────┐                │
│              │ • Full Name                     │                │
│              │ • Email Address                 │                │
│              │ • Phone Number                  │                │
│              │ • Number of Attendees           │                │
│              │ • Invite Code (if required)     │                │
│              └─────────────────────────────────┘                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Form Validation                                │
│              • Check required fields                             │
│              • Validate invite code (if needed)                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│          Frontend: sendRegistrationEmail()                       │
│          (website/src/services/emailService.ts)                  │
│                                                                   │
│          POST /api/send-email                                    │
│          {                                                        │
│            customerName, customerEmail, customerPhone,           │
│            eventTitle, eventDate, eventTime, eventVenue,         │
│            ticketQuantity,                                        │
│            hostEmail: "organizer@example.com",                   │
│            isRegistration: true,                                 │
│            totalAmount: 0,                                        │
│            paymentStatus: "FREE"                                 │
│          }                                                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│         Azure Function: api/send-email/index.js                  │
│                                                                   │
│  1. Validate request data                                        │
│  2. Generate Registration ID                                     │
│  3. Create email templates                                       │
│  4. Configure Mailgun transporter                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
        ┌───────────────────┐ ┌───────────────────────┐
        │  Send Email to    │ │  Send Email to        │
        │  Customer         │ │  Organizer + Admins   │
        │                   │ │                       │
        │  To: customerEmail│ │  To: hostEmail,       │
        │                   │ │      admin1@email.com │
        │  Subject:         │ │      admin2@email.com │
        │  "Registration    │ │                       │
        │   Confirmation"   │ │  Subject:             │
        │                   │ │  "New Registration    │
        │  Contains:        │ │   Alert"              │
        │  • Reg ID         │ │                       │
        │  • Event details  │ │  Contains:            │
        │  • Instructions   │ │  • Customer info      │
        │                   │ │  • Event details      │
        │                   │ │  • Action required    │
        └─────────┬─────────┘ └──────────┬────────────┘
                  │                       │
                  └───────────┬───────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │   Mailgun SMTP Service      │
                │   (smtp.mailgun.org)        │
                └─────────────┬───────────────┘
                              │
                              ▼
                   ┌──────────┴─────────┐
                   │                    │
                   ▼                    ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  User Receives   │  │ Organizer        │
        │  Confirmation    │  │ Receives         │
        │  Email           │  │ Notification     │
        └──────────────────┘  └──────────────────┘
```

## Email Content Examples

### Customer Email

```
┌────────────────────────────────────────────────────┐
│     🎭 ArtLoop - Registration Confirmation        │
│              (Dark Gray Header)                    │
└────────────────────────────────────────────────────┘

                     ✓
          (Large Success Icon)

    Thank you for your registration, John Doe!

    Your registration has been successfully confirmed.
    Here are your registration details:

    ┌────────────────────────────────────────────┐
    │         Registration Summary               │
    │                                            │
    │  Registration ID:  REG-1736358241234       │
    │  Event:           Indian Classical Music   │
    │  Date:            January 28, 2026         │
    │  Time:            6:00 PM - 9:00 PM        │
    │  Venue:           Rooftop Terrace          │
    │  Attendees:       2                        │
    └────────────────────────────────────────────┘

    Contact Information:
    Email: john@example.com
    Phone: (555) 123-4567

    Please bring this confirmation email or show 
    the registration ID at the venue entrance.

    If you have any questions, please contact us 
    at sanket.bakshi@gmail.com

    ────────────────────────────────────────────
    © 2025 ArtLoop. All rights reserved.
    This is an automated email. Please do not reply.
```

### Organizer Email

```
┌────────────────────────────────────────────────────┐
│      🎭 New Registration Notification             │
│              (Dark Header)                         │
└────────────────────────────────────────────────────┘

    ┌────────────────────────────────────────────┐
    │  ℹ️ New event registration received!       │
    │     (Blue Alert Box)                       │
    └────────────────────────────────────────────┘

    ┌────────────────────────────────────────────┐
    │         Registration Details               │
    │                                            │
    │  Registration ID:  REG-1736358241234       │
    │  Customer Name:    John Doe                │
    │  Customer Email:   john@example.com        │
    │  Customer Phone:   (555) 123-4567          │
    │  Event:           Indian Classical Music   │
    │  Event Date:      January 28, 2026         │
    │  Event Time:      6:00 PM - 9:00 PM        │
    │  Venue:           Rooftop Terrace          │
    │  Attendees:       2                        │
    └────────────────────────────────────────────┘

    Action Required: Please review this 
    registration and ensure the customer 
    receives confirmation.
```

## Key Components

### 1. Frontend Components
- **Event Page** ([website/src/pages/events/[id].tsx](website/src/pages/events/[id].tsx))
  - Displays event details
  - Registration form for free events
  - Handles form submission
  - Calls email service

- **Email Service** ([website/src/services/emailService.ts](website/src/services/emailService.ts))
  - `sendRegistrationEmail()` function
  - Communicates with Azure Function
  - Handles API responses

### 2. Backend Components
- **Azure Function** ([api/send-email/index.js](api/send-email/index.js))
  - Receives registration data
  - Validates inputs
  - Generates HTML emails
  - Sends via Mailgun SMTP

### 3. Data Structure
- **Events Data** ([website/src/data/eventsData.ts](website/src/data/eventsData.ts))
  - Contains event information
  - Includes `hostEmail` for each event
  - Flags for `isFree` and `inviteOnly`

## Configuration Requirements

### Required Event Data Fields
```typescript
{
  hostEmail: string;        // Organizer's email
  isFree?: boolean;         // Set to true for free events
  inviteOnly?: boolean;     // Set to true for invite-only
  inviteCode?: string;      // Required if inviteOnly is true
}
```

### Required Azure Function Settings
```
MAILGUN_SMTP_HOST=smtp.mailgun.org
MAILGUN_SMTP_USERNAME=postmaster@your-domain.mailgun.org
MAILGUN_SMTP_PASSWORD=your-smtp-password
FROM_EMAIL=noreply@your-domain.com
```

## Success Indicators

✅ User sees "Processing..." then "Success!" message
✅ User receives confirmation email within seconds
✅ Organizer receives notification email
✅ Admin emails receive notification copies
✅ All emails contain correct event and registration details
✅ Registration ID is generated and included in emails
