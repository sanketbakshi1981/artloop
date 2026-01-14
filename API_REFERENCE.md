# ArtLoop API Reference - Cosmos DB Integration

Quick reference for the Cosmos DB-powered event and registration management APIs.

## 📋 Table of Contents
- [Events API](#events-api)
- [Registrations API](#registrations-api)
- [Data Models](#data-models)
- [Environment Variables](#environment-variables)

---

## 🎭 Events API

### GET /api/events
Get all events with optional filtering.

**Query Parameters:**
- `upcoming=true` - Filter to show only upcoming events
- `status=active|cancelled|completed|draft` - Filter by event status (default: active)

**Example:**
```bash
curl "https://your-app.azurewebsites.net/api/events?upcoming=true"
```

**Response:**
```json
{
  "events": [
    {
      "id": "1",
      "title": "Acoustic Bollywood Night",
      "date": "January 18, 2026",
      "time": "7:00 PM - 10:00 PM",
      "venue": "18 Pemberton Dr, Matawan, NJ",
      "performer": "Vikram Kumar",
      "price": "$35",
      "capacity": "25 guests",
      "status": "active",
      "registrationCount": 12,
      "createdAt": "2026-01-14T10:00:00.000Z",
      "updatedAt": "2026-01-14T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### GET /api/events/{id}
Get a specific event by ID.

**Example:**
```bash
curl "https://your-app.azurewebsites.net/api/events/1"
```

**Response:**
```json
{
  "id": "1",
  "title": "Acoustic Bollywood Night",
  "date": "January 18, 2026",
  ...
}
```

---

### GET /api/events/search?q={searchTerm}
Search events by keyword (searches title, performer, description, venue).

**Query Parameters:**
- `q` or `search` - Search term (required)

**Example:**
```bash
curl "https://your-app.azurewebsites.net/api/events/search?q=bollywood"
```

**Response:**
```json
{
  "searchTerm": "bollywood",
  "events": [...],
  "count": 1
}
```

---

### POST /api/events
Create a new event. **Requires function key authentication.**

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Jazz Night",
  "date": "March 15, 2026",
  "time": "8:00 PM - 11:00 PM",
  "venue": "Blue Note Jazz Club",
  "venueAddress": "456 Music Ave",
  "performer": "Sarah Johnson Trio",
  "performerBio": "Award-winning jazz trio...",
  "description": "An evening of smooth jazz",
  "fullDescription": "Join us for...",
  "image": "/eventimg/jazz-night.jpg",
  "price": "$45",
  "capacity": "50 guests",
  "dresscode": "Smart Casual",
  "includes": ["Welcome drink", "Appetizers"],
  "hostEmail": "host@example.com",
  "isFree": false,
  "inviteOnly": false
}
```

**Example:**
```bash
curl -X POST "https://your-app.azurewebsites.net/api/events?code=YOUR_FUNCTION_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title":"Jazz Night",...}'
```

**Response:**
```json
{
  "message": "Event created successfully",
  "event": {
    "id": "1234567890",
    "title": "Jazz Night",
    "status": "active",
    "registrationCount": 0,
    "createdAt": "2026-01-14T10:00:00.000Z",
    ...
  }
}
```

---

### PUT /api/events/{id}
Update an existing event. **Requires function key authentication.**

**Example:**
```bash
curl -X PUT "https://your-app.azurewebsites.net/api/events/1?code=YOUR_FUNCTION_KEY" \
  -H "Content-Type: application/json" \
  -d '{"capacity":"60 guests","price":"$40"}'
```

**Response:**
```json
{
  "message": "Event updated successfully",
  "event": {...}
}
```

---

### DELETE /api/events/{id}
Cancel an event (soft delete). **Requires function key authentication.**

**Example:**
```bash
curl -X DELETE "https://your-app.azurewebsites.net/api/events/1?code=YOUR_FUNCTION_KEY"
```

**Response:**
```json
{
  "message": "Event cancelled successfully",
  "event": {
    "id": "1",
    "status": "cancelled",
    ...
  }
}
```

---

## 🎫 Registrations API

### POST /api/send-email
Register for an event (sends confirmation email).

**Request Body:**
```json
{
  "eventId": "1",
  "eventTitle": "Acoustic Bollywood Night",
  "attendeeName": "John Doe",
  "attendeeEmail": "john@example.com",
  "ticketQuantity": 2,
  "paymentStatus": "completed"
}
```

**Response:**
- Creates registration in Cosmos DB
- Increments event registration count
- Sends confirmation email with QR code
- Returns registration details

---

### GET /api/registrations/{eventTitle}
Get all registrations for a specific event.

Use the `getRegistrationsByEvent` function from cosmosdb.js:

```javascript
const { getRegistrationsByEvent } = require('./shared/cosmosdb');
const result = await getRegistrationsByEvent('Acoustic Bollywood Night');
```

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "id": "ABC123",
      "registrationCode": "ABC123",
      "eventTitle": "Acoustic Bollywood Night",
      "eventId": "1",
      "attendeeName": "John Doe",
      "attendeeEmail": "john@example.com",
      "ticketQuantity": 2,
      "status": "active",
      "checkInStatus": "pending",
      "createdAt": "2026-01-14T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### PUT /api/registrations/{registrationCode}/checkin
Check in an attendee at the event.

Use the `checkInAttendee` function from cosmosdb.js:

```javascript
const { checkInAttendee } = require('./shared/cosmosdb');
const result = await checkInAttendee('ABC123');
```

---

## 📊 Data Models

### Event Model
```typescript
{
  id: string;                    // Unique ID
  title: string;                 // Event title
  date: string;                  // Date (e.g., "January 18, 2026")
  time: string;                  // Time (e.g., "7:00 PM - 10:00 PM")
  venue: string;                 // Venue name
  venueAddress: string;          // Full address
  performer: string;             // Performer name
  performerBio: string;          // Performer biography
  description: string;           // Short description
  fullDescription: string;       // Detailed description
  image: string;                 // Image URL/path
  price: string;                 // Price (e.g., "$35" or "Free")
  capacity: string;              // Capacity (e.g., "25 guests")
  dresscode: string;             // Dress code
  includes: string[];            // Array of included items
  hostEmail: string;             // Host email
  isFree?: boolean;              // Is the event free?
  inviteOnly?: boolean;          // Is invite-only?
  inviteCode?: string;           // Invite code (if invite-only)
  status: string;                // "active" | "cancelled" | "completed" | "draft"
  registrationCount: number;     // Number of registrations
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

### Registration Model
```typescript
{
  id: string;                    // Same as registrationCode
  registrationCode: string;      // Unique registration code
  eventTitle: string;            // Event title
  eventId?: string;              // Event ID (optional)
  attendeeName: string;          // Attendee name
  attendeeEmail: string;         // Attendee email
  ticketQuantity: number;        // Number of tickets
  paymentStatus: string;         // Payment status
  status: string;                // "active" | "cancelled" | "completed"
  checkInStatus: string;         // "pending" | "checked-in"
  checkInTime: string | null;    // ISO timestamp or null
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

---

## 🔧 Environment Variables

Required environment variables for Cosmos DB integration:

```bash
# Cosmos DB Configuration
COSMOS_DB_ENDPOINT=https://artloop-cosmosdb.documents.azure.com:443/
COSMOS_DB_KEY=your-primary-key-here
COSMOS_DB_DATABASE=artloop-db
COSMOS_DB_CONTAINER=registrations
COSMOS_DB_EVENTS_CONTAINER=events
```

Set these in:
- **Local development:** `api/local.settings.json`
- **Azure production:** Function App → Configuration → Application Settings

---

## 🔒 Authentication

- **Public endpoints** (no auth required):
  - `GET /api/events`
  - `GET /api/events/{id}`
  - `GET /api/events/search`

- **Protected endpoints** (require function key):
  - `POST /api/events`
  - `PUT /api/events/{id}`
  - `DELETE /api/events/{id}`

Add `?code=YOUR_FUNCTION_KEY` to protected endpoint URLs.

Get function keys from: Azure Portal → Function App → Functions → events-manage → Function Keys

---

## 📝 Notes

1. **Auto-increment registration count:** When a registration is created, the event's `registrationCount` is automatically incremented.

2. **Soft delete:** DELETE endpoints set `status: 'cancelled'` rather than permanently deleting records.

3. **Timestamps:** All records include `createdAt` and `updatedAt` timestamps in ISO format.

4. **Error handling:** All endpoints return consistent error responses with appropriate HTTP status codes.

---

For detailed setup instructions, see [COSMOSDB_EVENTS_SETUP.md](./COSMOSDB_EVENTS_SETUP.md)
