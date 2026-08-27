#!/bin/bash

# Comprehensive Integration Verification Script

echo "🔍 Verifying Strapi → Next.js Integration"
echo "=========================================="
echo ""

# Colors
RED='\033[0.31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. Check Services
echo "1️⃣  Checking Services..."
echo ""

# Check Strapi
if curl -s https://guild-biblical-expectations-easily.trycloudflare.com/admin > /dev/null; then
    echo -e "${GREEN}✓${NC} Strapi is running (port 1337)"
else
    echo -e "${RED}✗${NC} Strapi is NOT running"
    ERRORS=$((ERRORS + 1))
fi

# Check Next.js
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓${NC} Next.js is running (port 3000)"
else
    echo -e "${RED}✗${NC} Next.js is NOT running"
    ERRORS=$((ERRORS + 1))
fi

# Check Database
if docker ps | grep -q strapi-postgres; then
    echo -e "${GREEN}✓${NC} PostgreSQL is running"
else
    echo -e "${RED}✗${NC} PostgreSQL is NOT running"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# 2. Check API Endpoints
echo "2️⃣  Checking API Endpoints..."
echo ""

# Check pages endpoint
API_RESPONSE=$(curl -s https://guild-biblical-expectations-easily.trycloudflare.com/api/pages)
if echo "$API_RESPONSE" | grep -q "data"; then
    echo -e "${GREEN}✓${NC} /api/pages endpoint accessible"
    
    # Check for pages
    if echo "$API_RESPONSE" | grep -q '"id"'; then
        PAGE_COUNT=$(echo "$API_RESPONSE" | grep -o '"id"' | wc -l | tr -d ' ')
        echo -e "${GREEN}✓${NC} Found $PAGE_COUNT page(s)"
    else
        echo -e "${YELLOW}⚠${NC}  No pages found - create test page"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} /api/pages endpoint not accessible"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# 3. Check Data Structure
echo "3️⃣  Checking Data Structure..."
echo ""

FULL_RESPONSE=$(curl -s "https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?populate=deep")

# Check layout field
if echo "$FULL_RESPONSE" | grep -q "layout"; then
    echo -e "${GREEN}✓${NC} Layout field exists"
else
    echo -e "${RED}✗${NC} Layout field missing - check Page collection type"
    ERRORS=$((ERRORS + 1))
fi

# Check components
if echo "$FULL_RESPONSE" | grep -q "__component"; then
    COMPONENT_COUNT=$(echo "$FULL_RESPONSE" | grep -o '"__component"' | wc -l | tr -d ' ')
    echo -e "${GREEN}✓${NC} Found $COMPONENT_COUNT component(s) in layout"
    
    # Check specific components
    if echo "$FULL_RESPONSE" | grep -q "blocks.hero"; then
        echo -e "${GREEN}  ✓${NC} Hero block found"
    fi
    if echo "$FULL_RESPONSE" | grep -q "blocks.services"; then
        echo -e "${GREEN}  ✓${NC} Services block found"
    fi
    if echo "$FULL_RESPONSE" | grep -q "blocks.cta"; then
        echo -e "${GREEN}  ✓${NC} CTA block found"
    fi
else
    echo -e "${YELLOW}⚠${NC}  No components in layout - add blocks to page"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# 4. Check Environment
echo "4️⃣  Checking Environment..."
echo ""

if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local exists"
    
    if grep -q "STRAPI_URL" .env.local; then
        echo -e "${GREEN}  ✓${NC} STRAPI_URL configured"
    else
        echo -e "${RED}  ✗${NC} STRAPI_URL missing"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "STRAPI_API_TOKEN" .env.local; then
        echo -e "${GREEN}  ✓${NC} STRAPI_API_TOKEN configured"
    else
        echo -e "${YELLOW}  ⚠${NC}  STRAPI_API_TOKEN missing"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} .env.local not found"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# 5. Check Permissions
echo "5️⃣  Checking Permissions..."
echo ""

# Try to access without auth
PUBLIC_RESPONSE=$(curl -s https://guild-biblical-expectations-easily.trycloudflare.com/api/pages)
if echo "$PUBLIC_RESPONSE" | grep -q "data"; then
    echo -e "${GREEN}✓${NC} Public access enabled"
else
    echo -e "${RED}✗${NC} Public access not enabled - check permissions"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# 6. Test Frontend
echo "6️⃣  Testing Frontend..."
echo ""

# Get first page slug
FIRST_SLUG=$(echo "$FULL_RESPONSE" | grep -o '"slug":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$FIRST_SLUG" ]; then
    echo "Testing page: /$FIRST_SLUG"
    
    FRONTEND_RESPONSE=$(curl -s "http://localhost:3000/$FIRST_SLUG")
    
    if echo "$FRONTEND_RESPONSE" | grep -q "<!DOCTYPE html>"; then
        echo -e "${GREEN}✓${NC} Frontend page loads"
        
        # Check for content
        if echo "$FRONTEND_RESPONSE" | grep -q "hero-block\|services-block\|cta-block"; then
            echo -e "${GREEN}✓${NC} Blocks are rendering"
        else
            echo -e "${YELLOW}⚠${NC}  Blocks may not be rendering - check browser"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "${RED}✗${NC} Frontend page not loading"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}⚠${NC}  No pages to test - create a page first"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "=========================================="
echo ""

# Summary
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "Your integration is working correctly."
    echo "Visit: http://localhost:3000/$FIRST_SLUG"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
    echo ""
    echo "Integration is mostly working but needs attention."
    exit 0
else
    echo -e "${RED}❌ $ERRORS error(s) and $WARNINGS warning(s) found${NC}"
    echo ""
    echo "Please fix the errors above before proceeding."
    exit 1
fi
