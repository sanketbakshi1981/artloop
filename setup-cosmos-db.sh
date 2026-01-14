#!/bin/bash

# Cosmos DB Setup Script for ArtLoop
# This script helps configure Cosmos DB connection for local development

set -e

echo "======================================================================"
echo "  ArtLoop - Cosmos DB Setup Script"
echo "======================================================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "api" ]; then
    echo -e "${RED}Error: Please run this script from the root of the artloop repository${NC}"
    exit 1
fi

echo "This script will help you configure Cosmos DB for your ArtLoop application."
echo ""

# Get Cosmos DB details
echo -e "${YELLOW}Step 1: Cosmos DB Connection Details${NC}"
echo "========================================"
echo ""
echo "Please provide your Cosmos DB connection details."
echo "You can find these in the Azure Portal:"
echo "  1. Go to portal.azure.com"
echo "  2. Navigate to your Cosmos DB resource (artloop-cosmosdb)"
echo "  3. Click 'Keys' in the left menu"
echo ""

read -p "Enter Cosmos DB Endpoint (e.g., https://artloop-cosmosdb.documents.azure.com:443/): " COSMOS_ENDPOINT
read -p "Enter Cosmos DB Primary Key: " -s COSMOS_KEY
echo ""
read -p "Enter Database Name [artloop-db]: " DB_NAME
DB_NAME=${DB_NAME:-artloop-db}

read -p "Enter Registrations Container Name [registrations]: " REG_CONTAINER
REG_CONTAINER=${REG_CONTAINER:-registrations}

read -p "Enter Events Container Name [events]: " EVENTS_CONTAINER
EVENTS_CONTAINER=${EVENTS_CONTAINER:-events}

echo ""
echo -e "${YELLOW}Step 2: Email Configuration${NC}"
echo "========================================"
echo ""

read -p "Enter Mailgun SMTP Host [smtp.mailgun.org]: " SMTP_HOST
SMTP_HOST=${SMTP_HOST:-smtp.mailgun.org}

read -p "Enter Mailgun SMTP Username: " SMTP_USER
read -p "Enter Mailgun SMTP Password: " -s SMTP_PASS
echo ""

read -p "Enter From Email Address: " FROM_EMAIL

echo ""
echo -e "${YELLOW}Step 3: Other Settings${NC}"
echo "========================================"
echo ""

read -p "Enter Website URL [https://artloop.azurewebsites.net]: " WEBSITE_URL
WEBSITE_URL=${WEBSITE_URL:-https://artloop.azurewebsites.net}

# Create local.settings.json
echo ""
echo -e "${GREEN}Creating api/local.settings.json...${NC}"

cat > api/local.settings.json << EOF
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "MAILGUN_SMTP_HOST": "$SMTP_HOST",
    "MAILGUN_SMTP_USERNAME": "$SMTP_USER",
    "MAILGUN_SMTP_PASSWORD": "$SMTP_PASS",
    "FROM_EMAIL": "$FROM_EMAIL",
    "COSMOS_DB_ENDPOINT": "$COSMOS_ENDPOINT",
    "COSMOS_DB_KEY": "$COSMOS_KEY",
    "COSMOS_DB_DATABASE": "$DB_NAME",
    "COSMOS_DB_CONTAINER": "$REG_CONTAINER",
    "COSMOS_DB_EVENTS_CONTAINER": "$EVENTS_CONTAINER",
    "WEBSITE_URL": "$WEBSITE_URL"
  }
}
EOF

echo -e "${GREEN}✅ Created api/local.settings.json${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "api/node_modules" ]; then
    echo -e "${YELLOW}Installing npm dependencies...${NC}"
    cd api
    npm install
    cd ..
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    echo ""
fi

# Ask if user wants to run migration
echo -e "${YELLOW}Step 4: Data Migration${NC}"
echo "========================================"
echo ""
read -p "Do you want to migrate existing events to Cosmos DB now? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${GREEN}Running migration script...${NC}"
    cd api
    node migrate-events-to-cosmosdb.js
    cd ..
fi

echo ""
echo "======================================================================"
echo -e "${GREEN}✅ Cosmos DB Setup Complete!${NC}"
echo "======================================================================"
echo ""
echo "Next steps:"
echo "  1. Test the API locally:"
echo "     cd api && npm start"
echo ""
echo "  2. Test endpoints:"
echo "     curl http://localhost:7071/api/events"
echo ""
echo "  3. Configure Azure Function App settings (for production):"
echo "     - Go to Azure Portal → Your Function App → Configuration"
echo "     - Add the same environment variables from local.settings.json"
echo ""
echo "  4. Review the documentation:"
echo "     - COSMOSDB_EVENTS_SETUP.md"
echo "     - API_REFERENCE.md"
echo ""
echo "⚠️  IMPORTANT: Never commit local.settings.json to source control!"
echo ""

