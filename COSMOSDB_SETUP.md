# CosmosDB Setup Guide

This guide explains how to configure Azure Cosmos DB to store registration data for ArtLoop events.

## Overview

CosmosDB is used to store and manage event registration data, including:
- Registration codes and customer information
- Event details and ticket quantities
- Check-in status and timestamps
- Registration statistics and analytics

## Prerequisites

- Azure Cosmos DB instance: `artloop-cosmosdb` (already created)
- Azure Function App with access to CosmosDB

## Database Structure

### Database: `artloop-db`
### Container: `registrations`
- **Partition Key**: `/registrationCode`
- **Document Structure**:

```json
{
  "id": "A3X9T7K2",
  "registrationCode": "A3X9T7K2",
  "orderID": "A3X9T7K2",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "eventTitle": "Jazz Night at Gallery",
  "eventDate": "2026-02-15",
  "eventTime": "7:00 PM",
  "eventVenue": "Downtown Gallery",
  "ticketQuantity": 2,
  "totalAmount": 0,
  "paymentStatus": "FREE",
  "isRegistration": true,
  "hostEmail": "host@example.com",
  "qrCodeVerificationUrl": "https://artloop.azurewebsites.net/verify?code=A3X9T7K2",
  "createdAt": "2026-01-11T12:00:00.000Z",
  "updatedAt": "2026-01-11T12:00:00.000Z",
  "status": "active",
  "checkInStatus": "pending",
  "checkInTime": null
}
```

## Configuration Steps

### 1. Get CosmosDB Connection Details

In Azure Portal:
1. Navigate to your CosmosDB account: `artloop-cosmosdb`
2. Go to **Settings** → **Keys**
3. Copy the following:
   - **URI** (endpoint)
   - **PRIMARY KEY**

### 2. Configure Local Development

Copy and rename the example settings file:
```bash
cd /workspaces/artloop/api
cp local.settings.json.example local.settings.json
```

Edit `local.settings.json` with your CosmosDB credentials:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOS_DB_ENDPOINT": "https://artloop-cosmosdb.documents.azure.com:443/",
    "COSMOS_DB_KEY": "your-actual-primary-key-here",
    "COSMOS_DB_DATABASE": "artloop-db",
    "COSMOS_DB_CONTAINER": "registrations"
  }
}
```

### 3. Configure Azure Function App

In Azure Portal, add these Application Settings to your Function App:

1. Navigate to your Function App
2. Go to **Settings** → **Configuration** → **Application settings**
3. Add the following settings:

| Name | Value |
|------|-------|
| `COSMOS_DB_ENDPOINT` | `https://artloop-cosmosdb.documents.azure.com:443/` |
| `COSMOS_DB_KEY` | Your CosmosDB Primary Key |
| `COSMOS_DB_DATABASE` | `artloop-db` |
| `COSMOS_DB_CONTAINER` | `registrations` |

4. Click **Save**
5. Restart the Function App

### 4. Verify Installation

Test the CosmosDB connection:
```bash
cd /workspaces/artloop/api
npm install
npm start
```

The database and container will be created automatically on first use.

## Features & Usage

### Automatic Storage

Registration data is automatically stored in CosmosDB when:
- A free event registration email is sent
- A registration code is generated

### Available Operations

The CosmosDB helper module (`shared/cosmosdb.js`) provides:

#### Store Registration
```javascript
const { storeRegistration } = require('./shared/cosmosdb');

await storeRegistration({
  registrationCode: 'A3X9T7K2',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  // ... other fields
});
```

#### Get Registration
```javascript
const { getRegistration } = require('./shared/cosmosdb');

const result = await getRegistration('A3X9T7K2');
if (result.success) {
  console.log('Registration:', result.item);
}
```

#### Check-in Attendee
```javascript
const { checkInAttendee } = require('./shared/cosmosdb');

await checkInAttendee('A3X9T7K2');
```

#### Get Event Statistics
```javascript
const { getEventStatistics } = require('./shared/cosmosdb');

const stats = await getEventStatistics('Jazz Night at Gallery');
console.log('Total registrations:', stats.total);
console.log('Checked in:', stats.checkedIn);
console.log('Total attendees:', stats.totalAttendees);
```

#### Query by Event
```javascript
const { getRegistrationsByEvent } = require('./shared/cosmosdb');

const result = await getRegistrationsByEvent('Jazz Night at Gallery');
console.log('Registrations:', result.items);
```

## Data Management

### Partition Key Strategy

The container uses `registrationCode` as the partition key, which provides:
- **Fast lookups** by registration code (O(1) complexity)
- **Efficient verification** at event check-in
- **Good distribution** across partitions

### Indexing

CosmosDB automatically indexes all properties. Common queries:
- Get registration by code: Single document read
- Get registrations by event: Cross-partition query
- Get registrations by email: Cross-partition query

### Querying in Azure Portal

1. Navigate to `artloop-cosmosdb` → Data Explorer
2. Expand `artloop-db` → `registrations`
3. Click "New SQL Query"

Example queries:
```sql
-- Get all registrations for an event
SELECT * FROM c WHERE c.eventTitle = "Jazz Night at Gallery"

-- Get all pending check-ins
SELECT * FROM c WHERE c.checkInStatus = "pending"

-- Get registrations by email
SELECT * FROM c WHERE c.customerEmail = "john@example.com"

-- Get check-in statistics
SELECT 
  c.eventTitle,
  COUNT(1) as total,
  SUM(CASE WHEN c.checkInStatus = "checked-in" THEN 1 ELSE 0 END) as checkedIn
FROM c
GROUP BY c.eventTitle
```

## Cost Optimization

### Request Units (RUs)

- Single document read: 1 RU
- Document creation: ~10 RUs
- Cross-partition query: Variable (depends on results)

### Tips for Cost Management

1. **Use registration code for lookups** when possible (most efficient)
2. **Limit cross-partition queries** - cache event lists when feasible
3. **Set TTL (Time-To-Live)** for old registrations if needed
4. **Monitor RU consumption** in Azure Portal → Metrics

### Free Tier

Azure Cosmos DB offers a free tier with:
- 1000 RU/s throughput
- 25 GB storage
- Sufficient for small to medium event volumes

## Security

### Access Keys

- **Never commit** CosmosDB keys to version control
- Use **Azure Key Vault** for production secrets
- Rotate keys periodically
- Use **Read-only keys** for read-only operations

### Network Security

Consider enabling:
- **Firewall rules** to restrict access by IP
- **Private endpoints** for enhanced security
- **Azure AD authentication** instead of keys

## Troubleshooting

### "Unauthorized" Error
- Verify `COSMOS_DB_KEY` is correct
- Check key hasn't been rotated
- Ensure Function App has correct permissions

### Container Not Found
- Database/container are auto-created on first use
- Check `COSMOS_DB_DATABASE` and `COSMOS_DB_CONTAINER` settings
- Verify endpoint URL is correct

### Slow Queries
- Avoid `SELECT *` in production
- Use specific partition key values when possible
- Consider adding composite indexes for common queries

### Connection Timeout
- Check network connectivity
- Verify endpoint URL format
- Check Azure service health status

## Monitoring

### Azure Portal Metrics

Monitor in Azure Portal → CosmosDB → Metrics:
- **Request Units**: Track RU consumption
- **Storage**: Monitor database size
- **Latency**: Query performance
- **Availability**: Service uptime

### Application Insights

Enable Application Insights in your Function App to track:
- CosmosDB operation success/failure rates
- Query execution times
- Error patterns

## Next Steps

1. ✅ CosmosDB is now configured
2. 🔄 Consider creating additional Azure Functions for:
   - Check-in API endpoint
   - Registration lookup/verification
   - Event statistics dashboard
3. 📊 Set up monitoring and alerts
4. 🔒 Implement Azure Key Vault for secrets management

## Support

For issues or questions:
- Check Azure Cosmos DB documentation: https://docs.microsoft.com/azure/cosmos-db/
- Review Application Insights logs
- Contact: sanket.bakshi@gmail.com
