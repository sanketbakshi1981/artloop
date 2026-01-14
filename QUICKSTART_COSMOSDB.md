# 🚀 Quick Start: Cosmos DB for Events & Registrations

## Step 1: Get Your Cosmos DB Credentials

1. Go to [Azure Portal](https://portal.azure.com)
2. Open your Cosmos DB resource: **artloop-cosmosdb**
3. Click **Keys** in the left sidebar
4. Copy:
   - URI (endpoint)
   - PRIMARY KEY

## Step 2: Run the Setup Script

```bash
./setup-cosmos-db.sh
```

This interactive script will:
- ✅ Prompt you for Cosmos DB credentials
- ✅ Create `api/local.settings.json` with your configuration
- ✅ Install npm dependencies if needed
- ✅ Optionally run the migration script

**Or configure manually:**
```bash
cd api
cp local.settings.json.example local.settings.json
# Edit local.settings.json with your credentials
```

## Step 3: Migrate Existing Events

```bash
cd api
node migrate-events-to-cosmosdb.js
```

This will import all events from your static data into Cosmos DB.

## Step 4: Start the API

```bash
cd api
npm start
```

## Step 5: Test the API

```bash
# Get all events
curl http://localhost:7071/api/events

# Get a specific event
curl http://localhost:7071/api/events/1

# Search events
curl "http://localhost:7071/api/events/search?q=bollywood"
```

## ✅ You're Done!

Your events and registrations are now stored in Cosmos DB!

### What's Working:
- ✅ Events stored in Cosmos DB (`events` container)
- ✅ Registrations stored in Cosmos DB (`registrations` container)
- ✅ Registration count auto-increments on new registrations
- ✅ Full CRUD operations on events
- ✅ Search and filter capabilities
- ✅ Check-in tracking for attendees

### Next Steps:
1. **Update frontend** to fetch from API instead of static data
2. **Deploy to Azure** and configure Function App settings
3. **Test production** endpoints

### Need Help?
- 📖 [Setup Guide](COSMOSDB_EVENTS_SETUP.md) - Complete setup instructions
- 📚 [API Reference](API_REFERENCE.md) - All endpoints and examples
- 📝 [Integration Summary](COSMOSDB_INTEGRATION_SUMMARY.md) - Overview of everything

### Troubleshooting:
- **Connection error**: Check credentials in `local.settings.json`
- **Migration fails**: Ensure Cosmos DB endpoint and key are correct
- **API not starting**: Run `npm install` in the `api` directory

---

**Important:** Never commit `api/local.settings.json` to Git! It's already in `.gitignore`.
