# Cosmos DB Integration - Summary

## ✅ What's Been Created

Your ArtLoop application now has full Cosmos DB integration for managing events and registrations!

### 📁 New Files Created

1. **API Functions:**
   - `api/events-get/index.js` - Get all events or specific event by ID
   - `api/events-get/function.json` - Configuration for events-get function
   - `api/events-manage/index.js` - Create, update, and delete events
   - `api/events-manage/function.json` - Configuration for events-manage function
   - `api/events-search/index.js` - Search events by keyword
   - `api/events-search/function.json` - Configuration for events-search function

2. **Shared Module (Updated):**
   - `api/shared/cosmosdb.js` - Enhanced with event management functions

3. **Migration & Setup:**
   - `api/migrate-events-to-cosmosdb.js` - Script to import existing events
   - `setup-cosmos-db.sh` - Interactive setup script

4. **Documentation:**
   - `COSMOSDB_EVENTS_SETUP.md` - Complete setup guide
   - `API_REFERENCE.md` - API endpoint documentation

5. **Configuration:**
   - `api/local.settings.json.example` - Updated with events container config

---

## 🗄️ Database Structure

### Cosmos DB: `artloop-cosmosdb`
#### Database: `artloop-db`

**Container 1: `events`**
- Partition Key: `/id`
- Stores event details (title, date, venue, performer, etc.)
- Tracks registration count
- Supports search and filtering

**Container 2: `registrations`**
- Partition Key: `/registrationCode`
- Stores registration details
- Links to events via eventId
- Tracks check-in status

---

## 🔌 API Endpoints

### Public Endpoints (No Auth)
```bash
GET  /api/events              # Get all events
GET  /api/events/{id}         # Get specific event
GET  /api/events/search?q=... # Search events
```

### Protected Endpoints (Function Key Required)
```bash
POST   /api/events          # Create new event
PUT    /api/events/{id}     # Update event
DELETE /api/events/{id}     # Cancel event
```

### Registration Endpoints
```bash
POST /api/send-email        # Register for event (sends confirmation)
```

---

## 🚀 Quick Start

### 1. Configure Connection

**Option A: Use the setup script (recommended)**
```bash
./setup-cosmos-db.sh
```

**Option B: Manual configuration**
1. Copy `api/local.settings.json.example` to `api/local.settings.json`
2. Update with your Cosmos DB credentials from Azure Portal
3. Required settings:
   - `COSMOS_DB_ENDPOINT`
   - `COSMOS_DB_KEY`
   - `COSMOS_DB_DATABASE`
   - `COSMOS_DB_CONTAINER`
   - `COSMOS_DB_EVENTS_CONTAINER`

### 2. Migrate Existing Events
```bash
cd api
node migrate-events-to-cosmosdb.js
```

### 3. Test Locally
```bash
cd api
npm start
```

Then test:
```bash
curl http://localhost:7071/api/events
curl "http://localhost:7071/api/events/search?q=bollywood"
```

### 4. Deploy to Azure

After deploying your Function App, add these Application Settings:
- `COSMOS_DB_ENDPOINT`
- `COSMOS_DB_KEY`
- `COSMOS_DB_DATABASE`
- `COSMOS_DB_CONTAINER`
- `COSMOS_DB_EVENTS_CONTAINER`

---

## 🔧 Key Features

✅ **Events Management**
- Create, read, update, delete events
- Search by keyword
- Filter by status (active, cancelled, completed)
- Track registration counts

✅ **Registrations**
- Store all registrations in Cosmos DB
- Auto-increment event registration count
- Track check-in status
- Generate statistics

✅ **Automatic Features**
- Database and containers created automatically
- Registration count updated when someone registers
- Soft delete (cancelled status instead of hard delete)
- Timestamps (createdAt, updatedAt) on all records

---

## 📊 Functions Overview

### Cosmos DB Helper Functions

**Event Management:**
- `storeEvent(eventData)` - Create new event
- `getEvent(eventId)` - Get event by ID
- `getAllEvents(filters)` - Get all events with optional filters
- `searchEvents(searchTerm)` - Search events by keyword
- `updateEvent(eventId, updates)` - Update event
- `deleteEvent(eventId)` - Cancel event (soft delete)
- `incrementEventRegistrationCount(eventId)` - Increment registration count

**Registration Management:**
- `storeRegistration(registrationData)` - Create new registration
- `getRegistration(registrationCode)` - Get registration by code
- `updateRegistration(registrationCode, updates)` - Update registration
- `checkInAttendee(registrationCode)` - Check in attendee
- `getRegistrationsByEvent(eventTitle)` - Get all registrations for an event
- `getEventStatistics(eventTitle)` - Get event statistics

---

## 📚 Documentation

- **Setup Guide:** [COSMOSDB_EVENTS_SETUP.md](COSMOSDB_EVENTS_SETUP.md)
- **API Reference:** [API_REFERENCE.md](API_REFERENCE.md)
- **Original Cosmos Setup:** [COSMOSDB_SETUP.md](COSMOSDB_SETUP.md)

---

## ⚠️ Important Notes

1. **Security:**
   - Never commit `local.settings.json` to source control
   - Use function-level auth for management endpoints
   - Store secrets in Azure Key Vault for production

2. **Cost:**
   - Cosmos DB free tier: 1000 RU/s, 25 GB storage
   - Should be sufficient for small to medium platforms
   - Monitor usage in Azure Portal

3. **Data Migration:**
   - Run migration script after initial setup
   - Keep static eventsData.ts as backup initially
   - Update frontend to use API endpoints instead of static data

4. **Testing:**
   - Test all endpoints locally before deploying
   - Verify Cosmos DB data in Azure Portal Data Explorer
   - Check registration count increments correctly

---

## 🎯 Next Steps

1. ✅ **Configure Cosmos DB** - Run `./setup-cosmos-db.sh`
2. ✅ **Migrate Events** - Import existing events to database
3. ⏳ **Update Frontend** - Modify website to fetch from API
4. ⏳ **Deploy to Azure** - Deploy functions and configure settings
5. ⏳ **Test Production** - Verify everything works in production

---

## 💡 Usage Examples

### Frontend Integration Example

```typescript
// Update your frontend to fetch from API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7071';

// Get all events
export async function getAllEvents(): Promise<Event[]> {
  const response = await fetch(`${API_URL}/api/events?upcoming=true`);
  const data = await response.json();
  return data.events;
}

// Get specific event
export async function getEventById(id: number): Promise<Event | null> {
  const response = await fetch(`${API_URL}/api/events/${id}`);
  if (!response.ok) return null;
  return await response.json();
}

// Search events
export async function searchEvents(query: string): Promise<Event[]> {
  const response = await fetch(`${API_URL}/api/events/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data.events;
}
```

---

**Need help?** Check the documentation or review the API examples in [API_REFERENCE.md](API_REFERENCE.md)
