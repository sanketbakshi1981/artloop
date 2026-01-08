# Configuring Mailgun for Azure Functions

## Quick Fix: Add Environment Variables to Azure

The 500 error is caused by missing Mailgun SMTP credentials in your Azure Function App configuration.

## Step-by-Step Configuration

### Option 1: Using Azure Portal (Recommended)

1. **Go to Azure Portal**: https://portal.azure.com

2. **Find Your Azure Static Web App**:
   - Search for "artloop" in the search bar
   - Click on your Static Web App (likely named something with "gray-water")

3. **Navigate to Function App Settings**:
   - In the left menu, click **"Configuration"** or **"Environment variables"**
   - OR: If your API is in a separate Function App named `artloop-email-function`, go to that instead

4. **Add Application Settings** (Environment Variables):
   
   Click **"+ New application setting"** for each of these:

   | Name | Value | Where to Find |
   |------|-------|---------------|
   | `MAILGUN_SMTP_HOST` | `smtp.mailgun.org` | Standard Mailgun SMTP |
   | `MAILGUN_SMTP_USERNAME` | `postmaster@your-domain.mailgun.org` | Mailgun Dashboard → Domain Settings → SMTP credentials |
   | `MAILGUN_SMTP_PASSWORD` | `your-smtp-password` | Mailgun Dashboard → Domain Settings → SMTP credentials |
   | `FROM_EMAIL` | `noreply@your-domain.com` | Must be from your verified Mailgun domain |

5. **Save Changes**:
   - Click **"Save"** at the top
   - Click **"Continue"** to confirm the restart

6. **Wait 1-2 minutes** for the Function App to restart

### Option 2: Using Azure CLI

If you have Azure CLI installed and logged in:

```bash
# Login to Azure
az login

# Set variables (replace with your actual values)
RESOURCE_GROUP="your-resource-group-name"
FUNCTION_APP="artloop-email-function"  # or your Static Web App name

# Add the settings
az functionapp config appsettings set \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --settings \
    "MAILGUN_SMTP_HOST=smtp.mailgun.org" \
    "MAILGUN_SMTP_USERNAME=postmaster@yourdomain.mailgun.org" \
    "MAILGUN_SMTP_PASSWORD=your-smtp-password" \
    "FROM_EMAIL=noreply@yourdomain.com"
```

## Getting Your Mailgun Credentials

### If You Already Have a Mailgun Account:

1. Go to https://app.mailgun.com
2. Click on **"Sending"** → **"Domains"**
3. Select your domain
4. Click **"Domain Settings"** → **"SMTP credentials"**
5. You'll see:
   - **Login**: `postmaster@yourdomain.mailgun.org`
   - **Password**: Click "Reset password" if you don't have it
   - **SMTP Hostname**: `smtp.mailgun.org`

### If You Don't Have Mailgun Set Up Yet:

1. **Sign up for Mailgun**: https://signup.mailgun.com/new/signup
   - Free tier: 5,000 emails/month for 3 months
   - No credit card required for sandbox

2. **Add and Verify Your Domain**:
   - Go to **Sending** → **Domains** → **Add New Domain**
   - Add your domain (e.g., `mg.artloop.us` or `mail.artloop.us`)
   - Follow DNS setup instructions (add MX, TXT, CNAME records)
   - Wait for verification (usually 5-15 minutes)

3. **Get SMTP Credentials**:
   - Once verified, go to **Domain Settings** → **SMTP credentials**
   - Copy the credentials

4. **Important**: Use a subdomain like `mg.yourdomain.com` for Mailgun to avoid affecting your main domain's email

## Alternative: Use Sandbox Domain (Quick Testing)

For quick testing, you can use Mailgun's sandbox domain:

1. Go to Mailgun Dashboard
2. Find your **Sandbox Domain** (looks like `sandboxXXXXX.mailgun.org`)
3. Add **Authorized Recipients**:
   - Click on your sandbox domain
   - Go to **"Sending"** → **"Authorized Recipients"**
   - Add your email address and the organizer's email
   - Verify both email addresses
4. Use sandbox credentials:
   - `MAILGUN_SMTP_USERNAME`: `postmaster@sandboxXXXXX.mailgun.org`
   - From the SMTP credentials section

**Note**: Sandbox can only send to authorized recipients (max 5).

## Verify Configuration

After adding the environment variables:

1. **Wait 1-2 minutes** for the Function App to restart

2. **Test the registration**:
   - Go to https://artloop.us/events/2 or /events/3
   - Try registering
   - Check browser console for success message

3. **Check Azure Function Logs**:
   - Azure Portal → Function App → Monitor → Logs
   - Or: Function App → Functions → send-email → Monitor
   - Look for error messages or success logs

## Common Issues

### Issue: "Invalid login: 535 Authentication failed"

**Cause**: Wrong SMTP credentials

**Solution**: 
- Double-check username and password from Mailgun
- Make sure you're using the SMTP password, not API key
- Try resetting the SMTP password in Mailgun

### Issue: "Mailbox does not exist"

**Cause**: Using sandbox domain without authorized recipients

**Solution**: 
- Add recipient email as authorized in sandbox
- Or: Verify and use a real domain

### Issue: "Domain not verified"

**Cause**: DNS records not properly configured

**Solution**:
- Check DNS records in your domain registrar
- Wait for DNS propagation (can take up to 24 hours)
- Use `dig` or `nslookup` to verify DNS records

### Issue: Still getting 500 error after adding credentials

**Cause**: Function App didn't restart or settings not saved

**Solution**:
1. Go to Azure Portal → Function App
2. Click **"Restart"** in the top menu
3. Wait 2-3 minutes
4. Try again

## Testing Your Configuration

### Quick Test Script

You can test Mailgun connectivity:

```bash
# Test SMTP connection
curl -v smtp://smtp.mailgun.org:587 \
  --user "postmaster@yourdomain.mailgun.org:your-password" \
  --mail-from "noreply@yourdomain.com" \
  --mail-rcpt "test@example.com" \
  --upload-file - << EOF
From: noreply@yourdomain.com
To: test@example.com
Subject: Test Email

This is a test email.
EOF
```

### Using Node Test Script

In the `api` directory:

```bash
cd api
# Edit test-email.js with your credentials
node test-email.js
```

## Environment Variables Summary

Required for Azure Function App:

```
MAILGUN_SMTP_HOST=smtp.mailgun.org
MAILGUN_SMTP_USERNAME=postmaster@yourdomain.mailgun.org
MAILGUN_SMTP_PASSWORD=your-smtp-password
FROM_EMAIL=noreply@yourdomain.com
```

## Next Steps

1. ✅ Add the environment variables in Azure Portal
2. ✅ Restart the Function App
3. ✅ Test registration on https://artloop.us/events/2
4. ✅ Check browser console for success (✅) or error (❌)
5. ✅ Check Azure Function logs if still failing

## Need Help?

If you're still seeing errors after configuration:

1. **Get the exact error from Azure Function logs**:
   - Azure Portal → Function App → Monitor → Logs
   - Look for the latest execution with error details

2. **Share the error** and we can troubleshoot further

3. **Alternative email services**:
   - SendGrid (Azure native)
   - Azure Communication Services
   - AWS SES
   - Any SMTP provider
