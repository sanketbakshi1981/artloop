# Mailgun Setup Guide for ArtLoop

This guide will help you configure Mailgun as your email provider for ArtLoop.

## Prerequisites

- A Mailgun account (free tier available with 5,000 emails/month for 3 months)
- A custom domain (or use Mailgun's sandbox domain for testing)
- Access to your domain's DNS settings

## Step 1: Create a Mailgun Account

1. Go to [https://www.mailgun.com](https://www.mailgun.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add and Verify Your Domain

### Option A: Use Your Own Domain (Recommended for Production)

1. Log into your Mailgun dashboard
2. Navigate to **Sending > Domains**
3. Click **Add New Domain**
4. Enter your domain (e.g., `mg.yourdomain.com` or `yourdomain.com`)
5. Mailgun will provide DNS records you need to add:
   - **TXT records** for domain verification and SPF
   - **CNAME records** for tracking
   - **MX records** (optional, only if receiving emails)

6. Add these DNS records to your domain provider:
   ```
   TXT  @  v=spf1 include:mailgun.org ~all
   TXT  _domainkey.mg  [provided DKIM key]
   CNAME  email.mg  mailgun.org
   ```

7. Wait for DNS propagation (can take up to 48 hours, usually faster)
8. Return to Mailgun and click **Verify DNS Settings**

### Option B: Use Sandbox Domain (Testing Only)

- Mailgun provides a sandbox domain by default
- Limited to 300 emails/day
- Can only send to authorized recipients
- Format: `sandboxXXXXXXXX.mailgun.org`
- Good for development and testing

## Step 3: Get Your SMTP Credentials

1. In Mailgun dashboard, go to **Sending > Domain Settings**
2. Select your domain
3. Click on **SMTP credentials** tab
4. You'll see:
   - **SMTP Hostname**: `smtp.mailgun.org` (or `smtp.eu.mailgun.org` for EU)
   - **Port**: `587` (TLS) or `465` (SSL)
   - **Username**: `postmaster@your-domain.mailgun.org`
   - **Password**: Click "Reset Password" if you need a new one

5. Note these credentials - you'll need them for configuration

## Step 4: Configure Azure Function App Settings

### Via Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Function App
3. Go to **Configuration > Application Settings**
4. Add the following settings:

   ```
   MAILGUN_SMTP_HOST=smtp.mailgun.org
   MAILGUN_SMTP_USERNAME=postmaster@your-domain.mailgun.org
   MAILGUN_SMTP_PASSWORD=your-smtp-password
   FROM_EMAIL=noreply@your-domain.com
   ```

5. Click **Save**

### Via Azure CLI

```bash
az functionapp config appsettings set \
  --name artloop-email-function \
  --resource-group artloop-rg \
  --settings \
    "MAILGUN_SMTP_HOST=smtp.mailgun.org" \
    "MAILGUN_SMTP_USERNAME=postmaster@your-domain.mailgun.org" \
    "MAILGUN_SMTP_PASSWORD=your-smtp-password" \
    "FROM_EMAIL=noreply@your-domain.com"
```

## Step 5: Test Your Configuration Locally

1. Create a `.env` file in the `/api` directory (don't commit this!):

   ```env
   MAILGUN_SMTP_HOST=smtp.mailgun.org
   MAILGUN_SMTP_USERNAME=postmaster@your-domain.mailgun.org
   MAILGUN_SMTP_PASSWORD=your-smtp-password
   FROM_EMAIL=noreply@your-domain.com
   ```

2. Update the test script with your details:
   ```bash
   cd api
   node test-email.js
   ```

3. Check your inbox for the test email

## Step 6: Authorized Recipients (For Sandbox Domain)

If using a sandbox domain, you must authorize recipients:

1. In Mailgun dashboard, go to **Sending > Authorized Recipients**
2. Add email addresses that should receive test emails
3. Recipients will receive a confirmation email
4. They must click the confirmation link

## Step 7: Monitor Email Sending

1. Go to **Sending > Logs** in Mailgun dashboard
2. View all sent emails, delivery status, and any errors
3. Monitor your sending quota and statistics

## Mailgun Pricing

- **Free Tier**: 5,000 emails/month for first 3 months
- **Foundation**: $35/month for 50,000 emails
- **Growth**: $80/month for 100,000 emails
- **Scale**: Custom pricing for higher volumes

## Important Configuration Notes

### SPF Record
Ensure your SPF record includes Mailgun:
```
v=spf1 include:mailgun.org ~all
```

### DKIM Signing
Mailgun automatically signs emails with DKIM when your domain is verified.

### From Email Address
- Must use your verified domain
- Examples:
  - `noreply@yourdomain.com`
  - `notifications@yourdomain.com`
  - `hello@yourdomain.com`

### Rate Limits
- Free tier: 5,000 emails/month
- Sandbox: 300 emails/day, 5 emails/hour per recipient
- Paid tiers: Higher limits based on plan

## Troubleshooting

### Email Not Sending

1. **Check SMTP Credentials**
   - Verify username and password are correct
   - Ensure you're using the right SMTP host (US vs EU)

2. **Check Domain Verification**
   - Go to Mailgun dashboard > Domains
   - Ensure all DNS records are verified (green checkmarks)

3. **Check From Email**
   - Must match your verified domain
   - Can't use personal email addresses

4. **Check Mailgun Logs**
   - Go to Sending > Logs
   - Look for error messages

### DNS Records Not Verifying

1. Wait longer - DNS propagation can take 24-48 hours
2. Use a DNS checker tool: [https://mxtoolbox.com](https://mxtoolbox.com)
3. Ensure records are added to the correct domain/subdomain
4. Check with your DNS provider's support if issues persist

### Emails Going to Spam

1. **Complete Domain Verification**
   - Ensure SPF, DKIM, and DMARC are configured
   
2. **Warm Up Your Domain**
   - Start with low volume
   - Gradually increase sending over days/weeks

3. **Improve Email Content**
   - Avoid spam trigger words
   - Include plain text version
   - Add unsubscribe link for bulk emails

4. **Monitor Reputation**
   - Check Mailgun dashboard for bounce/complaint rates
   - Keep bounce rate < 5%
   - Keep complaint rate < 0.1%

## Advanced Features

### Email Templates
Use Mailgun's template feature for better email management:
```javascript
// Example using Mailgun templates
await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: customerEmail,
    subject: 'Order Confirmation',
    template: 'order-confirmation',
    'h:X-Mailgun-Variables': JSON.stringify({
        customerName: 'John Doe',
        orderID: '12345'
    })
});
```

### Webhooks
Set up webhooks to track email events:
1. Go to Sending > Webhooks
2. Add webhook URLs for events like:
   - Delivered
   - Opened
   - Clicked
   - Bounced
   - Complained

### EU Region
If you need to comply with GDPR and want EU data residency:
```env
MAILGUN_SMTP_HOST=smtp.eu.mailgun.org
```

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate SMTP passwords** regularly
4. **Monitor usage** for unusual activity
5. **Enable 2FA** on your Mailgun account
6. **Use dedicated sending domains** separate from your main domain

## Resources

- [Mailgun Documentation](https://documentation.mailgun.com)
- [Mailgun API Reference](https://documentation.mailgun.com/en/latest/api_reference.html)
- [SMTP Settings](https://documentation.mailgun.com/en/latest/user_manual.html#smtp)
- [Domain Verification Guide](https://documentation.mailgun.com/en/latest/user_manual.html#verifying-your-domain)

## Support

- **Mailgun Support**: [https://help.mailgun.com](https://help.mailgun.com)
- **Status Page**: [https://status.mailgun.com](https://status.mailgun.com)
- **Community Forum**: [https://stackoverflow.com/questions/tagged/mailgun](https://stackoverflow.com/questions/tagged/mailgun)
