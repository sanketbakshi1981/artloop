# Custom Domain Setup for artloop.us

## Current Status
Your website is now deployed and accessible at:
**https://gray-water-0a5b86410.1.azurestaticapps.net**

## Issue Found
The 404 error on artloop.us was caused by:
1. The deployment was pointing to the wrong directory (now fixed)
2. artloop.us DNS doesn't resolve to Azure Static Web Apps
3. Docusaurus was trying to redirect to artloop.us, which doesn't work

## To Set Up Custom Domain (artloop.us)

### Step 1: Configure Custom Domain in Azure
1. Go to Azure Portal
2. Navigate to your Static Web App (gray-water-0a5b86410)
3. Go to "Custom domains" in the left menu
4. Click "Add" and enter `artloop.us`
5. Azure will provide you with verification values

### Step 2: Update DNS Records
Add these DNS records with your domain registrar:

**For apex domain (artloop.us):**
- Type: `ALIAS` or `ANAME` record
- Name: `@`
- Value: `gray-water-0a5b86410.1.azurestaticapps.net`

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `gray-water-0a5b86410.1.azurestaticapps.net`

**TXT record for verification (Azure will provide the specific value):**
- Type: `TXT`
- Name: As specified by Azure
- Value: As specified by Azure

### Step 3: Update Docusaurus Config
Once DNS is working, update `website/docusaurus.config.ts`:
```typescript
url: 'https://artloop.us',
```

## Testing
After DNS propagation (can take up to 48 hours):
1. Test: `nslookup artloop.us`
2. Verify it resolves to Azure
3. Visit https://artloop.us in your browser

## Current Temporary Fix
The site is configured to use the Azure Static Web Apps URL, so it works immediately at:
https://gray-water-0a5b86410.1.azurestaticapps.net
