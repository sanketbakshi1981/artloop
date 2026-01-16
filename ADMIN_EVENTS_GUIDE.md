# Admin Events Management - Usage Guide

## 🎯 Overview

The admin events page at `/admin/events` allows you to manage all ArtLoop events through a web interface. All changes are saved to Cosmos DB through the API layer.

## 🔐 Authentication

The admin page is protected with Azure Function Key authentication:

1. Navigate to `/admin/events`
2. Enter your **Azure Function Key**
3. Click "Authenticate"

**Get your Function Key:**
- Azure Portal → Function App → `events-manage` → Function Keys
- Copy the default key or create a new one

The key is stored in localStorage, so you won't need to enter it again until you logout.

## 📝 Features

### View All Events
- See all events stored in Cosmos DB
- View registration counts
- See event status (active, cancelled, completed, draft)
- Filter and search capabilities

### Create New Event
1. Click **"+ Create New Event"**
2. Fill in the event details:
   - **Basic Information**: Title, date, time, venue
   - **Performer Information**: Name and bio
   - **Event Details**: Descriptions and image
   - **Pricing & Logistics**: Price, capacity, dress code
   - **What's Included**: Add items included with tickets
   - **Event Settings**: Free event, invite-only options
3. Click **"Create Event"**

### Edit Event
1. Click **"✏️ Edit"** on any event row
2. Modify the fields you want to change
3. Click **"Update Event"**

### Delete (Cancel) Event
1. Click **"🗑️ Delete"** on any event row
2. Confirm the deletion
3. Event status is set to "cancelled" (soft delete)

## 🔄 How It Works

All operations go through the API layer:

```
Frontend (Admin Page) → API Service → Azure Functions → Cosmos DB
```

**No direct database access** - everything uses the RESTful API endpoints:
- `GET /api/events` - Fetch all events
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Cancel event

## 🚀 Quick Start

### 1. Local Development

```bash
# Start the API (in one terminal)
cd api
npm start

# Start the website (in another terminal)
cd website
npm start
```

Then navigate to: `http://localhost:3000/admin/events`

### 2. Production

After deploying your website, navigate to:
`https://artloop.us/admin/events`

Make sure your Function App settings include:
- `COSMOS_DB_ENDPOINT`
- `COSMOS_DB_KEY`
- All other required environment variables

## 📋 Event Fields Reference

### Required Fields
- **Title** - Event name
- **Date** - Event date (e.g., "January 18, 2026")
- **Time** - Event time (e.g., "7:00 PM - 10:00 PM")
- **Venue** - Venue name
- **Venue Address** - Full address
- **Performer** - Performer/artist name
- **Description** - Short description
- **Host Email** - Email for host notifications

### Optional Fields
- **Performer Bio** - Biography of the performer
- **Full Description** - Detailed event description
- **Image** - Image URL or path
- **Price** - Ticket price (default: "$0")
- **Capacity** - Venue capacity (default: "50 guests")
- **Dress Code** - Dress code requirements
- **Includes** - Array of items included
- **Is Free** - Checkbox for free events
- **Invite Only** - Checkbox for invite-only events
- **Invite Code** - Required if invite-only

## 🎨 UI Components

### EventForm Component
- **Location**: `website/src/components/EventForm/`
- **Purpose**: Form for creating/editing events
- **Features**: Validation, multi-section layout, includes manager

### EventsList Component
- **Location**: `website/src/components/EventsList/`
- **Purpose**: Display events in a table
- **Features**: Thumbnails, status badges, quick actions

### EventsService
- **Location**: `website/src/services/eventsService.ts`
- **Purpose**: API communication layer
- **Methods**: getAllEvents, getEventById, createEvent, updateEvent, deleteEvent

## 🔒 Security Notes

1. **Function Key Protection**
   - Create/Update/Delete operations require a function key
   - Public endpoints (GET) don't require authentication
   - Store function key securely

2. **Best Practices**
   - Don't share your function key
   - Rotate keys regularly in Azure Portal
   - Consider implementing user authentication for additional security

3. **Future Enhancements**
   - Add role-based access control
   - Implement audit logs
   - Add two-factor authentication

## 🐛 Troubleshooting

### "Failed to load events"
- Check that API is running
- Verify Cosmos DB connection in `local.settings.json`
- Check browser console for errors

### "Failed to create/update event"
- Verify function key is correct
- Check all required fields are filled
- Ensure API endpoint URLs are correct in `api.config.ts`

### Events not appearing
- Run migration script to import existing events
- Check Cosmos DB Data Explorer for data
- Verify container names match in configuration

## 📱 Mobile Responsiveness

The admin interface is responsive and works on:
- ✅ Desktop (best experience)
- ✅ Tablet (optimized)
- ✅ Mobile (functional, but desktop recommended)

## 🔄 Data Flow

```
1. User fills form
   ↓
2. EventForm validates data
   ↓
3. EventsService calls API
   ↓
4. Azure Function processes request
   ↓
5. Cosmos DB stores/updates data
   ↓
6. Response returns to frontend
   ↓
7. EventsList refreshes
```

## 🎯 Next Steps

After creating events:
1. Events are immediately available via API
2. Update frontend to fetch from API instead of static data
3. Test registration flow with new events
4. Monitor registration counts in admin panel

---

For API documentation, see [API_REFERENCE.md](../../API_REFERENCE.md)
