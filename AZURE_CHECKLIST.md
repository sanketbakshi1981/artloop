# Quick Azure Checklist for HTTPS Fix

## ✅ What I Fixed in Code
1. Added HSTS (Strict-Transport-Security) headers
2. Added custom domain forwarding configuration
3. Updated Docusaurus config to use `https://artloop.us`
4. Rebuilt the site with new configuration

## 🔍 What You Need to Check in Azure Portal

### 1. Navigate to Your Static Web App
- Go to: https://portal.azure.com
- Search for: "gray-water-0a5b86410" or "artloop"
- Click on your Static Web App

### 2. Check Custom Domains Section
Click "Custom domains" in the left sidebar and verify:

- [ ] `artloop.us` is listed
- [ ] Status shows **"Ready"** with green checkmark
- [ ] SSL Certificate shows **"Active"** or **"Managed"**
- [ ] "Managed certificate" is enabled (free Let's Encrypt cert)

**If NOT configured:**
1. Click "+ Add"
2. Enter: `artloop.us`
3. Click "Next"
4. Azure will give you DNS validation instructions
5. Add the TXT record to your DNS provider
6. Wait 5-10 minutes and click "Validate"

### 3. Check Configuration Section (Optional)
Click "Configuration" in left sidebar:
- HTTPS is enabled by default (can't be disabled)
- You should see "HTTP to HTTPS redirect" is ON

## 🌐 What to Check at Your DNS Provider

You need these DNS records at your domain registrar/DNS provider:

### Required Records:
```
Type: CNAME (or ALIAS/ANAME if apex domain)
Name: @ (or artloop.us)
Value: gray-water-0a5b86410.1.azurestaticapps.net
TTL: 3600 (or automatic)

Type: CNAME
Name: www
Value: gray-water-0a5b86410.1.azurestaticapps.net
TTL: 3600
```

### Validation Record (Azure will provide this):
```
Type: TXT
Name: _dnsauth.artloop.us (or as specified by Azure)
Value: (Azure will provide a unique token)
TTL: 3600
```

## 📝 Next Steps

### Step 1: Commit and Push Changes
```bash
git add .
git commit -m "Fix HTTPS routing and update custom domain configuration"
git push origin main
```

### Step 2: Wait for Deployment
- GitHub Actions will automatically deploy (2-5 minutes)
- Monitor at: https://github.com/sanketbakshi1981/artloop/actions

### Step 3: Test
After deployment completes:

**Test HTTP to HTTPS redirect:**
```bash
curl -IL http://artloop.us
```

**Test HTTPS works:**
```bash
curl -I https://artloop.us
```

**Test in browser:**
- Open incognito window
- Go to: http://artloop.us
- Should redirect to: https://artloop.us with secure lock icon

## 🚨 Common Issues and Solutions

### Issue: "This site can't be reached" or DNS errors
**Solution:** DNS not configured or not propagated yet
- Check DNS records at your registrar
- Wait up to 48 hours for propagation (usually 5-30 minutes)
- Test: `nslookup artloop.us`

### Issue: SSL certificate error
**Solution:** Certificate not provisioned yet
- Wait 5-10 minutes after adding custom domain
- Check Azure Portal → Custom domains → Certificate status
- If stuck, try deleting and re-adding the custom domain

### Issue: Still showing "not secure" in browser
**Solution:** Browser cache or certificate provisioning
- Clear browser cache and cookies
- Try incognito/private mode
- Wait 10 minutes for Azure to provision SSL certificate

### Issue: 404 errors on subpages
**Solution:** Already fixed in staticwebapp.config.json
- The navigationFallback configuration handles SPA routing
- Should work after deployment

## 📞 Need Help?

If issues persist after following all steps:
1. Check GitHub Actions deployment logs
2. Check Azure Portal → Static Web App → Logs
3. Verify DNS with: `dig artloop.us` or `nslookup artloop.us`
4. Check browser console for specific errors (F12)

## 📚 Documentation References
- [Azure Static Web Apps Custom Domains](https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain)
- [Azure Static Web Apps Configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration)
