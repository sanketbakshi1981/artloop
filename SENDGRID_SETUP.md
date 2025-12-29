# SendGrid Setup Instructions

## Quick Start Checklist

- [ ] Create SendGrid account at https://sendgrid.com
- [ ] Verify your sender email address
- [ ] Create API key with Mail Send permissions
- [ ] Test the configuration locally
- [ ] Deploy to Azure with environment variables

## Step-by-Step Setup

### 1. Create SendGrid Account (Free Tier)
- Go to https://sendgrid.com/pricing
- Sign up for FREE plan (100 emails/day)
- Verify your email address

### 2. Verify Sender Email
1. Dashboard → Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Use: **sanket.bakshi@gmail.com** or your preferred email
4. Check email and click verification link

### 3. Create API Key
1. Settings → API Keys → Create API Key
2. Name: "ArtLoop Production"
3. Permissions: Restricted Access → Mail Send (Full Access)
4. Copy the API key (save it securely!)

### 4. Test Locally

```bash
cd /workspaces/artloop/api
npm install

# Edit test-email.js with your credentials:
# - SENDGRID_API_KEY
# - FROM_EMAIL (your verified sender)
# - TEST_EMAIL (where to receive test)

node test-email.js
```

Expected output:
```
✓ Email sent successfully!
Message ID: <some-id>
Check your inbox at: your@email.com
```

### 5. Configure Azure Function

Once testing works, add to Azure Function App settings:

```bash
az functionapp config appsettings set \
  --name <your-function-app-name> \
  --resource-group <your-resource-group> \
  --settings \
    "SENDGRID_API_KEY=<your-key>" \
    "FROM_EMAIL=sanket.bakshi@gmail.com"
```

Or via Azure Portal:
1. Go to your Function App
2. Configuration → Application Settings
3. Add:
   - Name: `SENDGRID_API_KEY`, Value: `your-key`
   - Name: `FROM_EMAIL`, Value: `sanket.bakshi@gmail.com`

## Troubleshooting

### "Sender address rejected"
- Verify the FROM_EMAIL in SendGrid dashboard
- Check Settings → Sender Authentication

### "Invalid API Key"
- Ensure API key is copied correctly
- Verify it has Mail Send permissions
- Try creating a new API key

### "Daily sending limit exceeded"
- Free tier: 100 emails/day
- Upgrade plan if needed

### Email goes to spam
- Complete domain authentication (not just single sender)
- Add SPF/DKIM records to your domain

## Upgrade Options

If you need more than 100 emails/day:

| Plan | Price | Emails |
|------|-------|--------|
| Free | $0 | 100/day |
| Essentials | $19.95/mo | 50,000/mo |
| Pro | $89.95/mo | 100,000/mo |

## Alternative: Azure Communication Services

If you prefer Azure-native solution:

1. Create Communication Services resource in Azure
2. Add Email Communication Service
3. Connect custom domain
4. Update `/api/send-email/index.js` to use `@azure/communication-email`

See EMAIL_SETUP.md for details.

## Next Steps

After SendGrid is working:
1. ✅ Test locally with test-email.js
2. ✅ Deploy Azure Function
3. ✅ Add environment variables
4. ✅ Test with actual payment
5. ✅ Monitor SendGrid dashboard for delivery stats
