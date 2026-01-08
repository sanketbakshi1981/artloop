# Free Event Registration Email System

## Overview
The ArtLoop platform automatically sends confirmation emails to both the registered user and the event organizer when someone registers for a free event.

## How It Works

### 1. User Registration Flow
When a user registers for a free event:

1. User fills out the registration form with:
   - Full Name
   - Email Address
   - Phone Number
   - Number of attendees
   - Invite code (if required)

2. Upon form submission, the system:
   - Validates the input
   - Sends a registration request to the Azure Function
   - Triggers email notifications

### 2. Email Recipients

**For Free Events:**
- ✅ **Registered User** - Receives confirmation email
- ✅ **Event Organizer** - Receives notification email (using the `hostEmail` from event data)
- ✅ **Platform Admins** - Receive notification copies

**For Paid Events:**
- ✅ **Customer** - Receives order confirmation after successful payment
- ✅ **Platform Admins** - Receive order notifications

### 3. Email Templates

#### Customer/Registered User Email
Includes:
- Registration/Order ID
- Event details (title, date, time, venue)
- Ticket/attendee quantity
- Contact information
- Instructions to bring confirmation to venue

#### Organizer/Admin Email
Includes:
- New registration notification
- Customer details (name, email, phone)
- Event information
- Number of attendees
- Registration ID

## Technical Implementation

### Frontend (React/TypeScript)

**File:** `website/src/pages/events/[id].tsx`

```typescript
const handleFreeRegistration = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const registrationData: RegistrationData = {
    customerName: customerInfo.fullName,
    customerEmail: customerInfo.email,
    customerPhone: customerInfo.phone,
    eventTitle: event.title,
    eventDate: event.date,
    eventTime: event.time,
    eventVenue: event.venue,
    ticketQuantity,
    hostEmail: event.hostEmail, // Important: Host email from event data
  };
  
  const emailSent = await sendRegistrationEmail(registrationData);
  // Handle success/error states
};
```

**File:** `website/src/services/emailService.ts`

The service automatically:
- Sets `isRegistration: true` flag
- Sets `totalAmount: 0` for free events
- Sets `paymentStatus: 'FREE'`
- Calls the Azure Function at `/api/send-email`

### Backend (Azure Functions)

**File:** `api/send-email/index.js`

The Azure Function:
1. Receives registration data with `hostEmail` parameter
2. Creates HTML email templates for customer and organizer
3. Uses Mailgun SMTP to send emails:
   - Customer email → `customerEmail`
   - Organizer email → `hostEmail` + admin emails

```javascript
// Determines recipients based on event type
const adminEmails = ['sanket.bakshi@gmail.com', 'k.vikramk@gmail.com'];
const recipients = isFreeEvent && hostEmail 
  ? [hostEmail, ...adminEmails]  // Free event: Send to host + admins
  : adminEmails;                  // Paid event: Send to admins only
```

### Event Data Structure

**File:** `website/src/data/eventsData.ts`

Each event must include:
```typescript
{
  id: number;
  title: string;
  // ... other fields
  hostEmail: string;        // Required for organizer notifications
  isFree?: boolean;         // Optional flag for free events
  inviteOnly?: boolean;     // Optional flag for invite-only events
  inviteCode?: string;      // Required if inviteOnly is true
}
```

## Configuration

### Environment Variables

**Azure Function App Settings:**
```bash
MAILGUN_SMTP_HOST=smtp.mailgun.org
MAILGUN_SMTP_USERNAME=postmaster@yourdomain.mailgun.org
MAILGUN_SMTP_PASSWORD=your_smtp_password
FROM_EMAIL=noreply@yourdomain.com
```

**Frontend (Optional):**
```bash
# If using a different API endpoint
REACT_APP_API_ENDPOINT=https://your-api-url/api/send-email
```

Default: Uses `/api/send-email` (Azure Static Web Apps default)

## Testing

### Local Testing

1. **Test the Azure Function locally:**
```bash
cd api
npm install
func start
```

2. **Test email configuration:**
```bash
cd api
node test-email.js
```

3. **Test registration flow:**
   - Run the website locally: `cd website && npm start`
   - Navigate to a free event page
   - Fill out the registration form
   - Submit and check email inboxes

### Production Testing

1. Visit a free event page: `https://artloop.us/events/2` (or any free event)
2. Complete the registration form
3. Submit the form
4. Verify emails are received by:
   - The email address you provided
   - The event organizer email

## Email Examples

### Free Event Registration Confirmation (to User)
```
Subject: Registration Confirmation - [Event Title]

✓ Thank you for your registration!

Registration ID: REG-1234567890
Event: Indian Classical Music Evening
Date: January 28, 2026
Time: 6:00 PM - 9:00 PM
Venue: Rooftop Terrace
Attendees: 2

Please bring this confirmation email to the venue entrance.
```

### New Registration Alert (to Organizer)
```
Subject: New Registration Alert - [Event Title] - [Customer Name]

🔔 New event registration received!

Registration ID: REG-1234567890
Customer Name: John Doe
Customer Email: john@example.com
Customer Phone: (555) 123-4567

Event: Indian Classical Music Evening
Date: January 28, 2026
Attendees: 2

Action Required: Please review this registration and ensure 
the customer receives confirmation.
```

## Troubleshooting

### Emails Not Sending

1. **Check Azure Function Logs:**
   ```bash
   # View recent logs
   az functionapp logs tail --name artloop-email-function --resource-group your-rg
   ```

2. **Verify Mailgun Configuration:**
   - SMTP credentials are correct
   - Domain is verified in Mailgun
   - FROM_EMAIL uses verified domain

3. **Check Event Data:**
   - `hostEmail` field exists for the event
   - `hostEmail` contains valid email address

4. **Check Frontend Console:**
   - Look for errors in browser console
   - Verify API endpoint is correct

### Common Issues

**Issue:** "Failed to send registration emails"
- **Solution:** Check Azure Function logs for detailed error messages

**Issue:** Organizer not receiving emails
- **Solution:** Verify `hostEmail` is set correctly in `eventsData.ts`

**Issue:** Emails going to spam
- **Solution:** Configure SPF/DKIM records in Mailgun for your domain

## Adding New Events

When creating new events with email notifications:

1. Add event to `website/src/data/eventsData.ts`
2. Include the `hostEmail` field:
   ```typescript
   {
     id: 4,
     title: 'New Event',
     // ... other fields
     hostEmail: 'organizer@example.com',
     isFree: true  // if it's a free event
   }
   ```

3. Test the registration flow
4. Verify both user and organizer receive emails

## Monitoring

### Email Delivery Monitoring

1. **Mailgun Dashboard:**
   - View sent emails
   - Check delivery rates
   - Monitor bounces/complaints

2. **Azure Application Insights:**
   - Track email function invocations
   - Monitor success/failure rates
   - Set up alerts for failures

## Support

For issues or questions:
- Email: sanket.bakshi@gmail.com
- Check logs in Azure Portal
- Review Mailgun delivery logs
