# Cosmos DB Setup Guide for ArtLoop

This guide will help you configure Cosmos DB to store event details and registrations for your ArtLoop application.

## Prerequisites

- Azure subscription with Cosmos DB resource created
- Cosmos DB resource name: `artloop-cosmosdb`
- Azure Functions Core Tools installed locally

## Step 1: Get Cosmos DB Connection Information

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to your Cosmos DB resource: `artloop-cosmosdb`
3. Click on **Keys** in the left menu
4. Copy the following values:
   - **URI** (Endpoint)
   - **PRIMARY KEY** (Key)

## Step 2: Configure Local Development

Update your `api/local.settings.json` file with the following configuration:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    
    "COSMOS_DB_ENDPOINT": "https://artloop-cosmosdb.documents.azure.com:443/",
    "COSMOS_DB_KEY": "your-primary-key-here",
    "COSMOS_DB_DATABASE": "artloop-db",
    "COSMOS_DB_CONTAINER": "registrations",
    "COSMOS_DB_EVENTS_CONTAINER": "events",
    
    "STRIPE_SECRET_KEY": "your-stripe-key",
    "MAILGUN_API_KEY": "your-mailgun-key",
    "MAILGUN_DOMAIN": "your-mailgun-domain"
  }
}
```

**Important:** Replace `your-primary-key-here` with the actual PRIMARY KEY from Step 1.

## Step 3: Database Structure

The Cosmos DB setup will automatically create:

### Database: `artloop-db`

### Containers:

1. **events** (for event details)
   - Partition Key: `/id`
   - Fields:
     - `id` - Event ID (unique)
     - `title` - Event title
     - `date` - Event date
     - `time` - Event time
     - `venue` - Venue name
     - `venueAddress` - Full address
     - `performer` - Performer name
     - `performerBio` - Performer biography
     - `description` - Short description
     - `fullDescription` - Detailed description
     - `image` - Image URL
     - `price` - Price (e.g., "$35" or "Free")
     - `capacity` - Capacity (e.g., "25 guests")
     - `dresscode` - Dress code
     - `includes` - Array of included items
     - `hostEmail` - Host email
     - `isFree` - Boolean
     - `inviteOnly` - Boolean
     - `inviteCode` - Invite code (optional)
     - `status` - "active", "cancelled", "completed", "draft"
     - `registrationCount` - Number of registrations
     - `createdAt` - Creation timestamp
     - `updatedAt` - Last update timestamp

2. **registrations** (for event registrations)
   - Partition Key: `/registrationCode`
   - Fields:
     - `id` - Same as registrationCode
     - `registrationCode` - Unique registration code
     - `eventTitle` - Event title
     - `eventId` - Event ID (optional)
     - `attendeeName` - Attendee name
     - `attendeeEmail` - Attendee email
     - `ticketQuantity` - Number of tickets
     - `paymentStatus` - Payment status
     - `status` - "active", "cancelled", "completed"
     - `checkInStatus` - "pending", "checked-in"
     - `checkInTime` - Check-in timestamp
     - `createdAt` - Registration timestamp
     - `updatedAt` - Last update timestamp

## Step 4: Migrate Existing Events to Cosmos DB

Run the migration script to import your existing events:

```bash
cd api
node migrate-events-to-cosmosdb.js
```

This will:
- Create the database and containers if they don't exist
- Import all events from `website/src/data/eventsData.ts`
- Display a summary of successful/failed migrations

## Step 5: Configure Azure Function App Settings

For production deployment, add these application settings to your Azure Function App:

1. Go to Azure Portal → Your Function App
2. Click **Configuration** → **Application settings**
3. Add the following settings:

| Name | Value |
|------|-------|
| `COSMOS_DB_ENDPOINT` | `https://artloop-cosmosdb.documents.azure.com:443/` |
| `COSMOS_DB_KEY` | Your Cosmos DB PRIMARY KEY |
| `COSMOS_DB_DATABASE` | `artloop-db` |
| `COSMOS_DB_CONTAINER` | `registrations` |
| `COSMOS_DB_EVENTS_CONTAINER` | `events` |

4. Click **Save**

## Step 6: Test the API Functions

### Get All Events
```bash
curl https://your-function-app.azurewebsites.net/api/events
```

### Get Specific Event
```bash
curl https://your-function-app.azurewebsites.net/api/events/1
```

### Search Events
```bash
curl "https://your-function-app.azurewebsites.net/api/events/search?q=bollywood"
```

### Get All Registrations for an Event
Use the existing API functions with Cosmos DB backend.

## Step 7: Update Website to Use API

Update your frontend code to fetch events from the API instead of static data:

```typescript
// Example: Update pages/events/[id].tsx
async function fetchEvent(id: number) {
  const response = await fetch(`${API_URL}/api/events/${id}`);
  return await response.json();
}
```

## API Endpoints

### Events (Public - No Auth Required)

- **GET** `/api/events` - Get all active events
  - Query params: `?upcoming=true` (filter upcoming events)
  - Query params: `?status=active|cancelled|completed|draft`

- **GET** `/api/events/{id}` - Get specific event

- **GET** `/api/events/search?q=searchTerm` - Search events

### Events Management (Requires Function Key)

- **POST** `/api/events` - Create new event
- **PUT** `/api/events/{id}` - Update event
- **DELETE** `/api/events/{id}` - Cancel event

### Registrations (Existing)

The registration functions automatically work with Cosmos DB:
- Store registrations in Cosmos DB
- Track check-in status
- Generate registration statistics

## Monitoring and Maintenance

### View Data in Azure Portal

1. Go to Azure Portal → `artloop-cosmosdb`
2. Click **Data Explorer**
3. Navigate to:
   - `artloop-db` → `events` → Items
   - `artloop-db` → `registrations` → Items

### Query Examples

Get all upcoming events:
```sql
SELECT * FROM c 
WHERE c.status = 'active' 
AND c.date >= '2026-01-14' 
ORDER BY c.date ASC
```

Get registrations for specific event:
```sql
SELECT * FROM c 
WHERE c.eventTitle = 'Acoustic Bollywood Night' 
ORDER BY c.createdAt DESC
```

## Cost Optimization

- Cosmos DB offers a free tier with:
  - 1000 RU/s provisioned throughput
  - 25 GB storage
- This should be sufficient for small to medium event platforms
- Monitor usage in Azure Portal → Cost Analysis

## Troubleshooting

### Error: "CosmosDB endpoint and key are required"
- Check that `COSMOS_DB_ENDPOINT` and `COSMOS_DB_KEY` are set in local.settings.json
- Verify the values are correct

### Error: "Event not found"
- Run the migration script to import events
- Check that the event ID exists in Cosmos DB

### Error: "Request rate is large"
- You've exceeded the throughput limit
- Wait a moment and retry, or increase RU/s in Cosmos DB settings

## Next Steps

1. ✅ Configure Cosmos DB connection strings
2. ✅ Run migration script
3. ✅ Test API endpoints locally
4. ✅ Update Azure Function App settings
5. ✅ Deploy to Azure
6. Update frontend to use API endpoints
7. Remove static eventsData.ts (optional, keep as backup)

## Security Best Practices

- Never commit `local.settings.json` to source control
- Use Azure Key Vault for production secrets
- Rotate Cosmos DB keys regularly
- Use Function-level authentication for management endpoints
- Implement rate limiting for public endpoints

---

For questions or issues, refer to:
- [Azure Cosmos DB Documentation](https://docs.microsoft.com/azure/cosmos-db/)
- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions/)
