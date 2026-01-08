# Migration Guide: SendGrid to Mailgun

This guide will help you migrate your ArtLoop email service from SendGrid to Mailgun.

## What Changed

### Files Modified
- ✅ [api/send-email/index.js](api/send-email/index.js) - Updated SMTP configuration
- ✅ [api/test-email.js](api/test-email.js) - Updated test script
- ✅ [api/local.settings.json.example](api/local.settings.json.example) - Updated environment variables
- ✅ [EMAIL_SETUP.md](EMAIL_SETUP.md) - Updated general setup guide

### Files Created
- ✅ [MAILGUN_SETUP.md](MAILGUN_SETUP.md) - Comprehensive Mailgun setup guide

## Migration Steps

### Step 1: Set Up Mailgun Account

1. **Create Account**
   - Go to https://www.mailgun.com
   - Sign up (free tier: 5,000 emails/month for 3 months)
   - Verify your email

2. **Add Domain**
   - Follow detailed instructions in [MAILGUN_SETUP.md](MAILGUN_SETUP.md)
   - Add DNS records (SPF, DKIM, CNAME)
   - Wait for verification (can take up to 48 hours)

3. **Get SMTP Credentials**
   - Navigate to Sending > Domain Settings
   - Go to SMTP credentials tab
   - Note:
     - SMTP Host: `smtp.mailgun.org`
     - Username: `postmaster@your-domain.mailgun.org`
     - Password: Your SMTP password

### Step 2: Update Local Development Environment

1. **Update local.settings.json**
   ```bash
   cd api
   cp local.settings.json.example local.settings.json
   ```

2. **Edit local.settings.json with your credentials:**
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "",
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "MAILGUN_SMTP_HOST": "smtp.mailgun.org",
       "MAILGUN_SMTP_USERNAME": "postmaster@your-domain.mailgun.org",
       "MAILGUN_SMTP_PASSWORD": "your-actual-smtp-password",
       "FROM_EMAIL": "noreply@your-domain.com"
     }
   }
   ```

3. **Test locally:**
   ```bash
   # Make sure nodemailer is installed
   npm install
   
   # Run test
   node test-email.js
   ```

   You should see:
   ```
   Testing Mailgun email configuration...
   
   Sending test email...
   ✓ Email sent successfully!
   Message ID: <some-id@your-domain.mailgun.org>
   
   Check your inbox at: sanket.bakshi@gmail.com
   
   Your Mailgun configuration is working correctly! 🎉
   ```

### Step 3: Update Azure Function App Settings

Choose one of the following methods:

#### Method A: Azure Portal (Recommended)

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Function App (e.g., `artloop-email-function`)
3. Go to **Configuration** > **Application Settings**
4. **Remove old SendGrid settings:**
   - Delete `SENDGRID_API_KEY`
5. **Add new Mailgun settings:**
   - Click **+ New application setting**
   - Add each of these:
     ```
     Name: MAILGUN_SMTP_HOST
     Value: smtp.mailgun.org
     
     Name: MAILGUN_SMTP_USERNAME
     Value: postmaster@your-domain.mailgun.org
     
     Name: MAILGUN_SMTP_PASSWORD
     Value: your-smtp-password
     
     Name: FROM_EMAIL
     Value: noreply@your-domain.com
     ```
6. Click **Save**
7. Click **Continue** to restart the Function App

#### Method B: Azure CLI

```bash
# Remove old SendGrid setting
az functionapp config appsettings delete \
  --name artloop-email-function \
  --resource-group artloop-rg \
  --setting-names SENDGRID_API_KEY

# Add Mailgun settings
az functionapp config appsettings set \
  --name artloop-email-function \
  --resource-group artloop-rg \
  --settings \
    "MAILGUN_SMTP_HOST=smtp.mailgun.org" \
    "MAILGUN_SMTP_USERNAME=postmaster@your-domain.mailgun.org" \
    "MAILGUN_SMTP_PASSWORD=your-smtp-password" \
    "FROM_EMAIL=noreply@your-domain.com"
```

### Step 4: Deploy Updated Code

The code has already been updated. Deploy to Azure:

#### Using VS Code
1. Open VS Code
2. Open Azure Functions extension
3. Right-click on your function app
4. Select **Deploy to Function App**

#### Using Azure CLI
```bash
cd api
npm install
func azure functionapp publish artloop-email-function
```

### Step 5: Test in Production

1. **Via Azure Portal:**
   - Go to your Function App
   - Navigate to Functions > send-email
   - Click **Test/Run**
   - Use this test payload:
     ```json
     {
       "customerName": "Test User",
       "customerEmail": "your-email@example.com",
       "customerPhone": "123-456-7890",
       "eventTitle": "Test Event",
       "eventDate": "2026-02-15",
       "eventTime": "7:00 PM",
       "eventVenue": "Test Venue",
       "ticketQuantity": 2,
       "totalAmount": 50.00,
       "paymentStatus": "COMPLETED",
       "orderID": "TEST-" + Date.now()
     }
     ```
   - Click **Run**
   - Check your email inbox

2. **Via Website:**
   - Make a test registration/purchase on your website
   - Verify emails are received

3. **Check Mailgun Dashboard:**
   - Go to Mailgun dashboard
   - Navigate to **Sending** > **Logs**
   - Verify emails show as "Delivered"

### Step 6: Monitor and Verify

1. **Check Azure Function Logs:**
   ```bash
   func azure functionapp logstream artloop-email-function
   ```

2. **Monitor Mailgun:**
   - Dashboard: https://app.mailgun.com
   - Check sending statistics
   - Monitor delivery rates
   - Review any bounces or complaints

3. **Test Different Scenarios:**
   - Free event registration
   - Paid ticket purchase
   - Multiple tickets
   - Different email addresses

## Rollback Plan (If Needed)

If you need to rollback to SendGrid:

1. **Revert code changes:**
   ```bash
   git checkout main  # or your previous branch
   ```

2. **Update Azure settings back to SendGrid:**
   ```bash
   az functionapp config appsettings set \
     --name artloop-email-function \
     --resource-group artloop-rg \
     --settings "SENDGRID_API_KEY=your_sendgrid_key"
   ```

3. **Redeploy:**
   ```bash
   func azure functionapp publish artloop-email-function
   ```

## Comparison: SendGrid vs Mailgun

| Feature | SendGrid | Mailgun |
|---------|----------|---------|
| **Free Tier** | 100 emails/day | 5,000 emails/month (3 months) |
| **Pricing** | $19.95/mo (40K emails) | $35/mo (50K emails) |
| **Interface** | User-friendly | Developer-focused |
| **API** | RESTful API | RESTful API + SMTP |
| **SMTP** | Supported | Supported |
| **Logs** | 30 days | 3 days (free), longer (paid) |
| **Support** | Email, ticket | Email, ticket, phone (paid) |
| **Deliverability** | Excellent | Excellent |
| **EU Region** | Available | Available |

## Benefits of Mailgun

✅ **Higher free tier** - 5,000 emails/month vs 100/day
✅ **Better developer tools** - Powerful API and webhooks
✅ **Advanced routing** - Route emails based on rules
✅ **Email validation** - Built-in email validation API
✅ **Easier setup** - Simple SMTP configuration
✅ **Better analytics** - Detailed tracking and logs
✅ **Template management** - Built-in template system

## Common Issues and Solutions

### Issue: Emails going to spam

**Solution:**
1. Ensure SPF record includes: `v=spf1 include:mailgun.org ~all`
2. Verify DKIM is properly configured
3. Add DMARC record for your domain
4. Warm up your domain by starting with low volume
5. Maintain good sending practices

### Issue: Domain not verifying

**Solution:**
1. Wait longer (DNS can take 24-48 hours)
2. Check DNS records with [MXToolbox](https://mxtoolbox.com)
3. Ensure records are in the correct DNS zone
4. Contact your DNS provider if issues persist

### Issue: SMTP authentication failed

**Solution:**
1. Verify username is in format: `postmaster@your-domain.mailgun.org`
2. Ensure password is correct (reset if needed)
3. Check SMTP host is correct (`smtp.mailgun.org` for US)
4. Verify your Mailgun account is active

### Issue: Rate limiting errors

**Solution:**
1. Check your Mailgun plan limits
2. For sandbox domain: Max 300 emails/day
3. Add authorized recipients for sandbox testing
4. Upgrade plan for higher limits

## Next Steps

After successful migration:

1. **Monitor for 1 week** - Watch delivery rates and errors
2. **Update documentation** - Ensure team knows about the change
3. **Archive SendGrid** - Keep account for 30 days as backup
4. **Set up webhooks** (optional) - Track email events
5. **Configure templates** (optional) - Use Mailgun templates
6. **Set up monitoring** - Add alerts for failed deliveries

## Support Resources

- **Mailgun Setup Guide**: [MAILGUN_SETUP.md](MAILGUN_SETUP.md)
- **Email Setup Guide**: [EMAIL_SETUP.md](EMAIL_SETUP.md)
- **Mailgun Documentation**: https://documentation.mailgun.com
- **Mailgun Support**: https://help.mailgun.com

## Questions?

If you encounter any issues during migration:
1. Check the logs in Azure Function App
2. Review Mailgun dashboard for delivery status
3. Test with the test-email.js script
4. Verify all environment variables are set correctly

---

**Note**: Keep your SendGrid account active for a few weeks after migration as a backup, just in case you need to rollback.
