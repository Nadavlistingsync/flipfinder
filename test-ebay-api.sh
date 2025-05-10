#!/bin/bash

# Tests the eBay Sandbox API integration via Next.js route
# This script sends a test request to the eBay search API endpoint

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing eBay Sandbox API integration...${NC}"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Make the request and handle the response
if command_exists jq; then
    echo "Using jq for JSON formatting"
    response=$(curl -s -L "http://localhost:3000/api/ebay/search/?q=macbook")
    echo "$response" | jq '.'
else
    echo "jq not found, using raw curl output"
    curl -s -L "http://localhost:3000/api/ebay/search/?q=macbook"
fi

# Check the exit status
if [ $? -eq 0 ]; then
    if echo "$response" | grep -q "Invalid access token"; then
        echo -e "${RED}Error: Invalid eBay API token. Please check your EBAY_SANDBOX_BEARER_TOKEN in .env.local${NC}"
    else
        echo -e "${GREEN}Request completed successfully${NC}"
    fi
else
    echo -e "${RED}Request failed${NC}"
fi 