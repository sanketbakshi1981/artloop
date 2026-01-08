# Troubleshooting Registration Errors

## Quick Error Checking Guide

When a registration fails, here's how to find the underlying error:

### 1. Browser Console (Frontend Errors)

**How to Access:**
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+J` (Windows/Linux) or `Cmd+Option+J` (Mac)
- **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows/Linux) or `Cmd+Option+K` (Mac)
- **Safari**: Enable Developer menu first (Preferences > Advanced > Show Develop menu), then press `Cmd+Option+C`

**What to Look For:**

The improved error handling now shows detailed messages with emoji markers:

```
🔄 Sending registration email to: /api/send-email
📧 Registration data: {customerName: "John Doe", ...}
📡 Response status: 500 Internal Server Error
❌ Registration email service error: {error: "Missing required fields", details: {...}}
❌ Registration failed: Missing required fields
Error details: {...}
```

**Common Frontend Errors:**

1. **Network Errors:**
   ```
   ❌ Failed to send registration email: TypeError: Failed to fetch
   ```
   - **Cause**: Cannot reach the API endpoint
   - **Solutions**: 
     - Check internet connection
     - Verify API endpoint is accessible
     - Check if Azure Function is running

2. **CORS Errors:**
   ```
   Access to fetch at '/api/send-email' has been blocked by CORS policy
   ```
   - **Cause**: Cross-origin request blocked
   - **Solutions**:
     - Ensure API is on same domain (Azure Static Web Apps handles this automatically)
     - Check Azure Static Web Apps configuration

3. **HTTP Error Responses:**
   ```
   ❌ Registration email service error: HTTP 500: Internal Server Error
   ```
   - **Cause**: API returned an error status
   - **Solutions**: Check Azure Function logs (see below)

### 2. Azure Function Logs (Backend Errors)

**Method A: Using Azure Portal (Web Browser)**

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Function App: `artloop-email-function`
3. In the left menu, click **"Monitor"** > **"Logs"**
4. Or click **"Functions"** > **"send-email"** > **"Monitor"** tab

**Example Log Output:**
```
2026-01-08T18:00:00.123Z [Information] Send email function processed a request.
2026-01-08T18:00:00.456Z [Error] Error sending email: {
  "message": "Invalid login: 535 5.7.8 Error: authentication failed",
  "code": "EAUTH"
}
2026-01-08T18:00:00.789Z [Error] Failed to send emails
```

**Method B: Using Azure CLI**

```bash
# Install Azure CLI if not already installed
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login to Azure
az login

# Stream logs in real-time
az functionapp logs tail \
  --name artloop-email-function \
  --resource-group your-resource-group-name

# View recent logs
az monitor activity-log list \
  --resource-group your-resource-group-name \
  --start-time 2026-01-08T00:00:00Z \
  --end-time 2026-01-08T23:59:59Z
```

**Method C: Using VS Code Azure Extension**

1. Install the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
2. Sign in to Azure
3. Navigate to your Function App in the Azure pane
4. Right-click on the function > **"Start Streaming Logs"**

**Method D: Using Application Insights (Recommended)**

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Application Insights** resource linked to your Function App
3. Click **"Logs"** in the left menu
4. Run query:

```kql
traces
| where timestamp > ago(1h)
| where message contains "send-email"
| order by timestamp desc
| take 50
```

Or for errors specifically:

```kql
exceptions
| where timestamp > ago(1h)
| where operation_Name contains "send-email"
| order by timestamp desc
```

### 3. Network Tab (HTTP Request/Response)

**How to Access:**
1. Open browser DevTools (`F12`)
2. Click on the **"Network"** tab
3. Try to register again
4. Look for the request to `/api/send-email`
5. Click on it to see:
   - Request Headers
   - Request Payload (your registration data)
   - Response Status
   - Response Body (error details)

**Example Failed Request:**
```
Status: 500 Internal Server Error

Request Payload:
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  ...
  "isRegistration": true
}

Response:
{
  "success": false,
  "error": "Failed to send emails",
  "details": "Invalid login: SMTP authentication failed"
}
```

## Common Error Scenarios

### Error 1: "Failed to send registration email: TypeError: Failed to fetch"

**Symptoms:**
- Alert popup shows network error
- Console shows "Failed to fetch"

**Causes & Solutions:**

1. **API endpoint not accessible**
   - Check if you're using the correct URL
   - Default should be `/api/send-email`
   - For Azure Static Web Apps, this is automatically routed to your Function App

2. **Function App is stopped/not deployed**
   - Verify deployment succeeded in GitHub Actions
   - Check Azure Portal that Function App is running

3. **Network connectivity issues**
   - Check internet connection
   - Try accessing the site again

### Error 2: "HTTP 500: Internal Server Error"

**Symptoms:**
- Registration fails
- Console shows 500 error
- Alert mentions server error

**Most Common Causes:**

1. **Missing Environment Variables**
   ```
   Error: Cannot read property 'MAILGUN_SMTP_USERNAME' of undefined
   ```
   - **Solution**: Check Azure Function App Configuration
   - Go to Azure Portal > Function App > Configuration
   - Verify these settings exist:
     - `MAILGUN_SMTP_HOST`
     - `MAILGUN_SMTP_USERNAME`
     - `MAILGUN_SMTP_PASSWORD`
     - `FROM_EMAIL`

2. **Invalid Mailgun Credentials**
   ```
   Error: Invalid login: 535 5.7.8 Error: authentication failed
   ```
   - **Solution**: Verify Mailgun credentials
   - Login to [Mailgun Dashboard](https://app.mailgun.com)
   - Check Domain Settings > SMTP credentials
   - Update Azure Function App configuration

3. **Missing hostEmail in Event Data**
   ```
   Error: Cannot send email - hostEmail is undefined
   ```
   - **Solution**: Add `hostEmail` field to event in `eventsData.ts`
   ```typescript
   {
     id: X,
     title: "Event Name",
     // ... other fields
     hostEmail: "organizer@example.com"  // Add this
   }
   ```

### Error 3: Emails Not Received (No Error Shown)

**Symptoms:**
- Registration appears successful
- No error messages
- Emails never arrive

**Causes & Solutions:**

1. **Emails in Spam/Junk Folder**
   - Check spam/junk folders for both user and organizer
   - Add noreply@yourdomain.com to contacts

2. **Mailgun Domain Not Verified**
   - Login to Mailgun Dashboard
   - Check if domain status is "Active"
   - Verify DNS records (SPF, DKIM, CNAME)

3. **Mailgun Account Issues**
   - Check Mailgun account is not suspended
   - Verify you haven't exceeded sending limits
   - Check Mailgun Logs in dashboard

4. **Incorrect Email Addresses**
   - Verify email addresses in event data
   - Check for typos in `hostEmail`

### Error 4: "Registration email service error: Missing required fields"

**Symptoms:**
- Alert shows "Missing required fields"
- Registration fails immediately

**Causes & Solutions:**

1. **Form validation failed**
   - Ensure all required fields are filled:
     - Full Name
     - Email Address
     - Phone Number

2. **Event data incomplete**
   - Check event object has all required fields:
     ```typescript
     {
       title, date, time, venue, hostEmail
     }
     ```

## Testing Locally

### Test the Azure Function Locally

1. **Install Azure Functions Core Tools:**
   ```bash
   npm install -g azure-functions-core-tools@4
   ```

2. **Create local.settings.json:**
   ```bash
   cd api
   cp local.settings.json.example local.settings.json
   ```

3. **Add your credentials:**
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "MAILGUN_SMTP_HOST": "smtp.mailgun.org",
       "MAILGUN_SMTP_USERNAME": "postmaster@your-domain.mailgun.org",
       "MAILGUN_SMTP_PASSWORD": "your-password",
       "FROM_EMAIL": "noreply@your-domain.com"
     }
   }
   ```

4. **Start the function locally:**
   ```bash
   cd api
   npm install
   func start
   ```

5. **Test with curl:**
   ```bash
   curl -X POST http://localhost:7071/api/send-email \
     -H "Content-Type: application/json" \
     -d '{
       "customerName": "Test User",
       "customerEmail": "test@example.com",
       "customerPhone": "555-1234",
       "eventTitle": "Test Event",
       "eventDate": "Jan 15, 2026",
       "eventTime": "7:00 PM",
       "eventVenue": "Test Venue",
       "ticketQuantity": 1,
       "hostEmail": "host@example.com",
       "isRegistration": true,
       "totalAmount": 0,
       "paymentStatus": "FREE"
     }'
   ```

### Test Email Script

```bash
cd api
node test-email.js
```

This will send a test email and show any errors.

## Quick Diagnostic Checklist

When registration fails, check these in order:

- [ ] **Browser Console** - Open and check for error messages (F12)
- [ ] **Network Tab** - Check the API request/response
- [ ] **Azure Function Logs** - Check backend errors in Azure Portal
- [ ] **Environment Variables** - Verify all Mailgun credentials are set
- [ ] **Mailgun Dashboard** - Check domain status and sending logs
- [ ] **Event Data** - Verify `hostEmail` exists for the event
- [ ] **Email Addresses** - Check for typos in recipient emails
- [ ] **Spam Folder** - Check if emails are being filtered

## Getting Help

If you're still stuck after checking the above:

1. **Collect the following information:**
   - Browser console error messages (full text)
   - Azure Function logs (from Application Insights or Monitor)
   - Network tab response body
   - Event ID you're trying to register for
   - Time of the failed attempt

2. **Contact Support:**
   - Email: sanket.bakshi@gmail.com
   - Include all collected information above

## Improved Error Messages

After applying the code changes, you'll now see:

### In Browser Console:
```
🔄 Sending registration email to: /api/send-email
📧 Registration data: {...}
📡 Response status: 500 Internal Server Error
❌ Registration email service error: {...}
```

### In Alert Popup:
```
Registration failed: [Specific error message]
Check the browser console for details (F12).
```

This makes it much easier to identify and fix issues!
