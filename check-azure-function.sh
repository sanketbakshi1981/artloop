#!/bin/bash
# Quick diagnostic script to check Azure Function App status

echo "======================================"
echo "Azure Function App Diagnostic"
echo "======================================"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI not installed"
    echo ""
    echo "To check Azure Function logs, you need to either:"
    echo ""
    echo "1. Use Azure Portal (Easiest):"
    echo "   - Go to: https://portal.azure.com"
    echo "   - Search for: artloop-email-function"
    echo "   - Click on it"
    echo "   - Go to: Monitor → Logs"
    echo "   - Look for recent executions with errors"
    echo ""
    echo "2. Install Azure CLI:"
    echo "   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash"
    echo ""
    exit 1
fi

echo "✅ Azure CLI installed"
echo ""

# Check if logged in
if ! az account show &> /dev/null; then
    echo "❌ Not logged into Azure"
    echo ""
    echo "Run: az login"
    echo ""
    exit 1
fi

echo "✅ Logged into Azure"
echo ""

# Find the function app
FUNCTION_APP=$(az functionapp list --query "[?contains(name, 'artloop')].name" -o tsv)

if [ -z "$FUNCTION_APP" ]; then
    echo "❌ Could not find artloop function app"
    echo ""
    echo "Available function apps:"
    az functionapp list --query "[].name" -o tsv
    exit 1
fi

echo "✅ Found Function App: $FUNCTION_APP"
echo ""

# Get resource group
RESOURCE_GROUP=$(az functionapp list --query "[?contains(name, 'artloop')].resourceGroup" -o tsv)
echo "📦 Resource Group: $RESOURCE_GROUP"
echo ""

# Check function app settings
echo "======================================" 
echo "Checking Environment Variables..."
echo "======================================"
echo ""

SETTINGS=$(az functionapp config appsettings list --name "$FUNCTION_APP" --resource-group "$RESOURCE_GROUP" --query "[?contains(name, 'MAILGUN') || contains(name, 'FROM_EMAIL')].{Name:name, Value:value}" -o table)

if echo "$SETTINGS" | grep -q "MAILGUN_SMTP_HOST"; then
    echo "✅ MAILGUN_SMTP_HOST is set"
else
    echo "❌ MAILGUN_SMTP_HOST is MISSING"
fi

if echo "$SETTINGS" | grep -q "MAILGUN_SMTP_USERNAME"; then
    echo "✅ MAILGUN_SMTP_USERNAME is set"
else
    echo "❌ MAILGUN_SMTP_USERNAME is MISSING"
fi

if echo "$SETTINGS" | grep -q "MAILGUN_SMTP_PASSWORD"; then
    echo "✅ MAILGUN_SMTP_PASSWORD is set"
else
    echo "❌ MAILGUN_SMTP_PASSWORD is MISSING"
fi

if echo "$SETTINGS" | grep -q "FROM_EMAIL"; then
    echo "✅ FROM_EMAIL is set"
else
    echo "❌ FROM_EMAIL is MISSING"
fi

echo ""
echo "======================================"
echo "Recent Function Logs (last 5 minutes)"
echo "======================================"
echo ""

# Get recent logs
az monitor activity-log list \
    --resource-group "$RESOURCE_GROUP" \
    --start-time $(date -u -d '5 minutes ago' '+%Y-%m-%dT%H:%M:%SZ') \
    --query "[?contains(resourceId, '$FUNCTION_APP')].{Time:eventTimestamp, Status:status.value, Message:properties.statusMessage}" \
    -o table

echo ""
echo "======================================"
echo "To stream live logs, run:"
echo "======================================"
echo "az webapp log tail --name $FUNCTION_APP --resource-group $RESOURCE_GROUP"
echo ""
