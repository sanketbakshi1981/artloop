# Local Development Guide

## Running the Full Stack Locally

To test the complete application including email registration locally, you need to run both:
1. **Frontend** (Docusaurus website)
2. **Backend** (Azure Functions API)

## Quick Setup

### Step 1: Configure Azure Functions

1. **Create local settings file:**
   ```bash
   cd api
   cp local.settings.json.example local.settings.json
   ```

2. **Edit `api/local.settings.json` with your Mailgun credentials:**
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "",
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "MAILGUN_SMTP_HOST": "smtp.mailgun.org",
       "MAILGUN_SMTP_USERNAME": "postmaster@yourdomain.mailgun.org",
       "MAILGUN_SMTP_PASSWORD": "your-actual-password",
       "FROM_EMAIL": "noreply@yourdomain.com"
     }
   }
   ```

3. **Install dependencies:**
   ```bash
   cd api
   npm install
   ```

### Step 2: Install Azure Functions Core Tools

**Option A: Using npm (recommended for this dev container):**
```bash
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

**Option B: Using package manager (if npm fails):**
- **Windows**: Download from [Microsoft](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- **macOS**: `brew tap azure/functions && brew install azure-functions-core-tools@4`
- **Linux**: See [installation guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=linux)

### Step 3: Run Both Services

**Terminal 1 - Start Azure Functions:**
```bash
cd api
func start
```

This starts the API at `http://localhost:7071`

**Terminal 2 - Start Frontend:**
```bash
cd website
npm start
```

This starts the website at `http://localhost:3000`

### Step 4: Configure Frontend to Use Local API

**Option A: Use environment variable (temporary for testing):**

In `website/.env.local` (create this file):
```bash
# Point to local Azure Functions
REACT_APP_API_ENDPOINT=http://localhost:7071/api/send-email
```

**Option B: Use browser console (quick testing):**

Open DevTools (F12) and run:
```javascript
window.REACT_APP_API_ENDPOINT = 'http://localhost:7071/api/send-email';
```

Then refresh and try registration.

### Step 5: Test Registration

1. Go to `http://localhost:3000/events/2` or `/events/3`
2. Click "Register Now"
3. Fill out the form
4. Submit

**Check Azure Functions Terminal for logs:**
```
[2026-01-08T18:00:00.123Z] Executing 'Functions.send-email'
[2026-01-08T18:00:00.456Z] Send email function processed a request.
[2026-01-08T18:00:01.789Z] Customer email sent to: user@example.com
[2026-01-08T18:00:02.012Z] Host and admin emails sent to: ...
[2026-01-08T18:00:02.345Z] Executed 'Functions.send-email' (Succeeded)
```

## Alternative: Test Against Production API

If you don't want to run Azure Functions locally, you can test against the deployed API:

```bash
cd website
# In .env.local or browser console
window.REACT_APP_API_ENDPOINT = 'https://your-site.azurestaticapps.net/api/send-email'
```

Or simply deploy and test on the live site at `https://artloop.us`

## Troubleshooting

### "404 Not Found" on `/api/send-email`

**Cause:** Azure Functions not running locally

**Solution:** 
- Make sure you ran `func start` in the `api` directory
- Verify you see: `Functions: send-email: [POST] http://localhost:7071/api/send-email`

### "func: command not found"

**Cause:** Azure Functions Core Tools not installed

**Solution:**
```bash
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

### CORS Error

**Cause:** Browser blocking cross-origin requests

**Solution:** Azure Functions Core Tools automatically handles CORS for localhost

### Email Not Sending

**Cause:** Invalid Mailgun credentials or missing `local.settings.json`

**Solution:**
1. Check `api/local.settings.json` exists and has correct credentials
2. Test credentials with: `cd api && node test-email.js`

## Project Structure

```
artloop/
├── api/                          # Azure Functions (Backend)
│   ├── send-email/              # Email function
│   │   ├── function.json        # Function configuration
│   │   └── index.js            # Email logic
│   ├── host.json               # Functions host config
│   ├── local.settings.json     # Local environment variables (gitignored)
│   └── package.json            # API dependencies
│
└── website/                      # Docusaurus (Frontend)
    ├── src/
    │   ├── pages/events/        # Event pages
    │   └── services/            # API services
    ├── .env                     # Public env vars (committed)
    └── .env.local              # Local overrides (gitignored)
```

## Production vs Development

| Environment | API Endpoint | How It Works |
|------------|--------------|--------------|
| **Production** | `/api/send-email` | Azure Static Web Apps auto-routes to Function App |
| **Development** | `http://localhost:7071/api/send-email` | Need to run Functions locally |

## Quick Commands Reference

```bash
# Full local development (run in separate terminals)
cd api && func start
cd website && npm start

# Test email configuration
cd api && node test-email.js

# Build for production
cd website && npm run build

# Deploy (handled by GitHub Actions)
git push origin main
```

## Tips

1. **Use two terminals** - one for API, one for frontend
2. **Check both consoles** - browser DevTools AND Azure Functions terminal
3. **Test email config first** - run `node test-email.js` before testing full flow
4. **Production is easier** - deploy to Azure and test there if local setup is problematic
