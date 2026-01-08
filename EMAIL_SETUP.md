# Email Notification Setup Guide

This guide will help you set up email notifications for ArtLoop payment confirmations on Azure.

## Overview

When a customer completes a payment:
1. The PayPal checkout component captures the payment
2. The frontend calls an Azure Function
3. The Azure Function sends emails to:
   - The customer (confirmation email)
   - sanket.bakshi@gmail.com (admin notification)
   - k.vikramk@gmail.com (admin notification)

## Prerequisites

1. Azure subscription
2. Mailgun account (or other SMTP provider)
3. Azure Functions Core Tools installed

## Setup Steps

### 1. Get Mailgun SMTP Credentials

**See [MAILGUN_SETUP.md](./MAILGUN_SETUP.md) for detailed Mailgun configuration instructions.**

Quick steps:
1. Sign up for a free Mailgun account at https://www.mailgun.com
2. Add and verify your domain (or use sandbox domain for testing)
3. Navigate to Sending > Domain Settings > SMTP credentials
4. Note your SMTP hostname, username, and password

### 2. Deploy Azure Function

#### Option A: Deploy via VS Code

1. Install the Azure Functions extension for VS Code
2. Open the `/api` folder in VS Code
3. Run `npm install` in the `/api` directory
4. Right-click on the `/api` folder and select "Deploy to Function App"
5. Follow the prompts to create a new Function App or use an existing one

#### Option B: Deploy via Azure CLI

```bash
# Login to Azure
az login

# Create a resource group (if you don't have one)
az group create --name artloop-rg --location eastus

# Create a storage account
az storage account create \
  --name artloopstorage \
  --resource-group artloop-rg \
  --location eastus \
  --sku Standard_LRS

# Create a function app
az functionapp create \
  --name artloop-email-function \
  --resource-group artloop-rg \
  --storage-account artloopstorage \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4

# Navigate to the api folder and deploy
cd api
npm install
func azure functionapp publish artloop-email-function
```

### 3. Configure Environment Variables

After deploying, configure the following environment variables in your Azure Function App:

1. Go to Azure Portal
2. Navigate to your Function App
3. Go to Configuration > Application Settings
4. Add the following settings:

```
MAILGUN_SMTP_HOST=smtp.mailgun.org
MAILGUN_SMTP_USERNAME=postmaster@your-domain.mailgun.org
MAILGUN_SMTP_PASSWORD=your-smtp-password
FROM_EMAIL=noreply@yourdomain.com
```

To add via Azure CLI:
```bash
az functionapp config appsettings set \
  --name artloop-email-function \
  --resource-group artloop-rg \
  --settings \
    "MAILGUN_SMTP_HOST=smtp.mailgun.org" \
    "MAILGUN_SMTP_USERNAME=postmaster@your-domain.mailgun.org" \
    "MAILGUN_SMTP_PASSWORD=your-smtp-password" \
    "FROM_EMAIL=noreply@yourdomain.com"
```

### 4. Update Website Configuration

#### For Static Web Apps (SWA)

If using Azure Static Web Apps, update your `staticwebapp.config.json`:

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

The API will be automatically available at `https://yoursite.azurestaticapps.net/api/send-email`

#### For Custom Domain

If you have a custom domain, you need to:

1. Get your Function App URL from Azure Portal (e.g., `https://artloop-email-function.azurewebsites.net`)
2. Create a `.env` file in the `website` folder:

```
REACT_APP_API_ENDPOINT=https://artloop-email-function.azurewebsites.net/api/send-email
```

3. Update your build configuration to include this environment variable

### 5. CORS Configuration (if needed)

If your website and Azure Function are on different domains, configure CORS:

```bash
az functionapp cors add \
  --name artloop-email-function \
  --resource-group artloop-rg \
  --allowed-origins https://yourwebsite.com
```

Or in Azure Portal:
1. Go to your Function App
2. Navigate to CORS
3. Add your website URL

### 6. Test the Integration

1. Make a test payment on your website
2. Check Azure Function logs in Azure Portal > Function App > Log stream
3. Verify emails are received by all recipients

## Email Templates

The Azure Function includes two email templates:

1. **Customer Confirmation Email**: Sent to the customer with order details
2. **Admin Notification Email**: Sent to administrators with customer and order information

You can customize these templates by editing `/api/send-email/index.js`.

## Monitoring

### View Function Logs

```bash
# Stream logs in real-time
func azure functionapp logstream artloop-email-function
```

Or view in Azure Portal:
- Navigate to your Function App
- Click on "Log stream" in the left menu

### Application Insights

Azure Functions automatically integrates with Application Insights for detailed monitoring:
1. Go to Azure Portal > your Function App
2. Click on "Application Insights"
3. View metrics, logs, and performance data

## Troubleshooting

### Emails not sending

1. **Check Mailgun SMTP Credentials**: Verify they're correctly set in Function App settings
2. **Check Mailgun Domain**: Ensure your domain is verified with all DNS records
3. **View Function Logs**: Check for error messages in the log stream
4. **Verify FROM_EMAIL**: Make sure it uses your verified Mailgun domain

### CORS Errors

1. Add your website domain to Function App CORS settings
2. Ensure the API endpoint URL is correct

### Function Not Found

1. Verify the function was deployed successfully
2. Check the function URL is correct
3. Ensure the function has the correct authorization level

## Alternative Email Providers

### Using Microsoft 365 SMTP

Update the transporter configuration:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});
```

## Security Best Practices

1. Never commit API keys to Git
2. Use Azure Key Vault for sensitive configuration
3. Enable Azure Function authentication if needed
4. Regularly rotate API keys
5. Monitor function invocations for unusual activity

## Cost Considerations

- Mailgun Free Tier: 5,000 emails/month for first 3 months
- Mailgun Foundation: $35/month for 50,000 emails
- Azure Functions Consumption Plan: First 1 million executions free
- Azure Static Web Apps: Free tier available

For production, consider upgrading based on your expected volume.

## Support

If you encounter issues:
1. Check Azure Function logs
2. Verify all environment variables are set
3. Test the function directly using Azure Portal
4. Review Mailgun logs in the Mailgun dashboard

---

**Note**: Remember to update the admin email addresses in `/api/send-email/index.js` if needed:
```javascript
const adminEmails = ['sanket.bakshi@gmail.com', 'k.vikramk@gmail.com'];
```
