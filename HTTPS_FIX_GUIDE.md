# HTTPS Routing Fix for artloop.us

## Issues Fixed

### 1. **Updated staticwebapp.config.json**
Added critical configurations:
- **Strict-Transport-Security header**: Forces browsers to use HTTPS
- **allowedForwardedHosts**: Allows custom domain forwarding
- **routes configuration**: Proper routing setup for Azure Static Web Apps
- **apiRuntime**: Specified Node.js 20 runtime

### 2. **Updated docusaurus.config.ts**
Changed the URL from Azure default to your custom domain:
- Changed from: `https://gray-water-0a5b86410.1.azurestaticapps.net`
- Changed to: `https://artloop.us`

## Required Azure Portal Configuration

Azure Static Web Apps **automatically redirects HTTP to HTTPS** by default, but you need to ensure:

### Step 1: Verify Custom Domain is Properly Configured
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Static Web App: **gray-water-0a5b86410**
3. Click on "Custom domains" in the left menu
4. Ensure `artloop.us` is listed and shows as "Validated"
5. Status should show a green checkmark and "Ready"

### Step 2: Check DNS Configuration
Your DNS provider should have these records:

**For apex domain (artloop.us):**
```
Type: ALIAS or ANAME or CNAME (depends on provider)
Name: @ (or blank/root)
Value: gray-water-0a5b86410.1.azurestaticapps.net
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: gray-water-0a5b86410.1.azurestaticapps.net
```

**For SSL certificate validation (if required):**
```
Type: TXT
Name: _dnsauth (or as provided by Azure)
Value: (provided by Azure)
```

### Step 3: Verify HTTPS Certificate
1. In Azure Portal, under "Custom domains"
2. Verify that SSL certificate shows as "Active" or "Managed"
3. Azure provides free SSL certificates automatically

## Deploy the Changes

After committing these changes, the GitHub Actions workflow will automatically deploy:

```bash
git add .
git commit -m "Fix HTTPS routing and update custom domain configuration"
git push origin main
```

The deployment takes about 2-5 minutes.

## Testing After Deployment

### Test 1: Direct HTTPS
```bash
curl -I https://artloop.us
```
Should return `200 OK` status

### Test 2: HTTP to HTTPS Redirect
```bash
curl -I http://artloop.us
```
Should return `301 Moved Permanently` or `307 Temporary Redirect` with Location header pointing to HTTPS

### Test 3: Browser Test
1. Open browser in incognito mode
2. Navigate to: `http://artloop.us`
3. Browser should automatically redirect to: `https://artloop.us`
4. Check the address bar - should show secure lock icon

### Test 4: Check Headers
```bash
curl -I https://artloop.us | grep -i "strict-transport-security"
```
Should show: `Strict-Transport-Security: max-age=31536000; includeSubDomains`

## Troubleshooting

### Issue: Still getting non-HTTPS or errors

**1. DNS not resolving properly:**
```bash
nslookup artloop.us
# Should point to Azure Static Web Apps
```

**2. Clear DNS cache:**
```bash
# Linux/Mac
sudo systemd-resolve --flush-caches
# or
sudo dscacheutil -flushcache

# Windows
ipconfig /flushdns
```

**3. Check Custom Domain status in Azure:**
- Go to Azure Portal → Static Web App → Custom domains
- If status shows "Failed" or "Validating", you may need to:
  - Delete the custom domain
  - Re-add it
  - Verify DNS records are correct

**4. Certificate issues:**
- Azure automatically provisions Let's Encrypt certificates
- This can take 5-10 minutes after adding custom domain
- Check "Custom domains" section for certificate status

**5. Still seeing errors after deployment:**
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private browsing mode
- Wait for CDN cache to clear (can take up to 30 minutes)

### Issue: DNS Configuration Problems

If your domain registrar doesn't support ALIAS/ANAME records for apex domain:

**Option A: Use subdomain only**
- Configure only `www.artloop.us`
- Set up redirect from `artloop.us` to `www.artloop.us` at registrar level

**Option B: Use Azure DNS**
1. Create Azure DNS Zone for `artloop.us`
2. Update nameservers at your registrar
3. Create proper A records pointing to Azure Static Web Apps IP

**Option C: Use Cloudflare (free)**
1. Add site to Cloudflare
2. Update nameservers at registrar
3. Add CNAME record (Cloudflare flattening will handle apex domain)
4. Enable "Always Use HTTPS" in Cloudflare settings

## Expected Behavior After Fix

✅ `http://artloop.us` → Redirects to → `https://artloop.us`
✅ `https://artloop.us` → Loads site with SSL certificate
✅ `http://www.artloop.us` → Redirects to → `https://artloop.us`
✅ `https://www.artloop.us` → Redirects to → `https://artloop.us`

## Files Modified
- [website/static/staticwebapp.config.json](website/static/staticwebapp.config.json)
- [website/docusaurus.config.ts](website/docusaurus.config.ts)

## Additional Security Headers Added
- `Strict-Transport-Security`: Forces HTTPS for 1 year
- These work in conjunction with Azure's automatic HTTPS redirect

## Questions or Issues?
If you continue to experience problems:
1. Check Azure Portal for any alerts or errors
2. Review deployment logs in GitHub Actions
3. Verify DNS records with your registrar
4. Allow up to 48 hours for DNS propagation (usually much faster)
