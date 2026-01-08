# Quick Start: Mailgun Email Setup

This is a quick reference guide to get Mailgun working with ArtLoop. For detailed instructions, see [MAILGUN_SETUP.md](MAILGUN_SETUP.md).

## ⚡ Quick Setup (5 minutes)

### 1. Get Mailgun Credentials (2 min)

1. Go to https://www.mailgun.com and sign up
2. Go to **Sending** > **Domain Settings** > **SMTP credentials**
3. Copy these values:
   - SMTP Host: `smtp.mailgun.org`
   - Username: `postmaster@sandbox123.mailgun.org`
   - Password: (click "Reset Password" if needed)

### 2. Test Locally (1 min)

```bash
cd api

# Create local.settings.json from example
cp local.settings.json.example local.settings.json

# Edit local.settings.json with your credentials
nano local.settings.json
```

Add your credentials:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "MAILGUN_SMTP_HOST": "smtp.mailgun.org",
    "MAILGUN_SMTP_USERNAME": "postmaster@sandbox123.mailgun.org",
    "MAILGUN_SMTP_PASSWORD": "your-password-here",
    "FROM_EMAIL": "noreply@sandbox123.mailgun.org"
  }
}
```

### 3. Test Email (1 min)

```bash
# If using sandbox, first authorize your email in Mailgun dashboard
# Go to: Sending > Authorized Recipients > Add Recipient

# Then run test
node test-email.js
```

Expected output:
```
Testing Mailgun email configuration...
Sending test email...
✓ Email sent successfully!
Your Mailgun configuration is working correctly! 🎉
```

### 4. Deploy to Azure (1 min)

Update Azure Function App settings:

```bash
az functionapp config appsettings set \
  --name artloop-email-function \
  --resource-group artloop-rg \
  --settings \
    "MAILGUN_SMTP_HOST=smtp.mailgun.org" \
    "MAILGUN_SMTP_USERNAME=postmaster@sandbox123.mailgun.org" \
    "MAILGUN_SMTP_PASSWORD=your-password" \
    "FROM_EMAIL=noreply@sandbox123.mailgun.org"

# Deploy updated code
func azure functionapp publish artloop-email-function
```

## ✅ You're Done!

Your email service is now using Mailgun. Test it by making a registration on your website.

---

## 🎯 Production Setup (Optional)

For production, use your own domain instead of sandbox:

### 1. Add Your Domain to Mailgun

1. **Sending** > **Domains** > **Add New Domain**
2. Enter: `mg.yourdomain.com`
3. Add DNS records shown in Mailgun:

```
TXT  @        v=spf1 include:mailgun.org ~all
TXT  k1._domainkey  [DKIM key provided by Mailgun]
CNAME  email.mg  mailgun.org
```

### 2. Wait for Verification

- DNS propagation: 1-48 hours (usually < 1 hour)
- Check status in Mailgun dashboard
- All records should show green checkmarks

### 3. Update Configuration

Update your settings to use your domain:

```bash
az functionapp config appsettings set \
  --name artloop-email-function \
  --resource-group artloop-rg \
  --settings \
    "MAILGUN_SMTP_USERNAME=postmaster@mg.yourdomain.com" \
    "FROM_EMAIL=noreply@yourdomain.com"
```

---

## 📊 Free Tier Limits

**Sandbox Domain:**
- 300 emails/day
- Must authorize each recipient
- Good for: Testing, development

**Verified Domain:**
- 5,000 emails/month (first 3 months)
- No recipient restrictions
- Good for: Production, staging

---

## 🔍 Monitoring

**View Logs:**
- Mailgun: https://app.mailgun.com → Sending → Logs
- Azure: Portal → Function App → Log stream

**Common Issues:**
- 📧 **Sandbox**: Authorize recipients first
- 🌐 **Domain**: Wait for DNS propagation
- 🔑 **Auth**: Double-check username/password format

---

## 📚 Full Documentation

- **Complete Setup**: [MAILGUN_SETUP.md](MAILGUN_SETUP.md)
- **Migration Guide**: [SENDGRID_TO_MAILGUN_MIGRATION.md](SENDGRID_TO_MAILGUN_MIGRATION.md)
- **General Email Setup**: [EMAIL_SETUP.md](EMAIL_SETUP.md)

---

## 🆘 Need Help?

1. Check [MAILGUN_SETUP.md](MAILGUN_SETUP.md) troubleshooting section
2. Review Mailgun logs for delivery status
3. Test with `node test-email.js`
4. Verify environment variables in Azure

**Mailgun Support**: https://help.mailgun.com
