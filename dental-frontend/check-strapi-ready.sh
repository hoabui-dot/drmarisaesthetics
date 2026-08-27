#!/bin/bash

# Check if Strapi is ready for frontend integration

echo "🔍 Checking Strapi Setup..."
echo ""

# Check if Strapi is running
echo "1. Checking if Strapi is running..."
if curl -s https://guild-biblical-expectations-easily.trycloudflare.com/admin > /dev/null; then
    echo "   ✅ Strapi is running"
else
    echo "   ❌ Strapi is not running"
    echo "   Run: cd strapi-cms && npm run develop"
    exit 1
fi

echo ""
echo "2. Checking API endpoint..."
API_RESPONSE=$(curl -s https://guild-biblical-expectations-easily.trycloudflare.com/api/pages)
if echo "$API_RESPONSE" | grep -q "data"; then
    echo "   ✅ API is accessible"
else
    echo "   ❌ API is not accessible"
    echo "   Check permissions in Strapi admin"
    exit 1
fi

echo ""
echo "3. Checking for pages..."
PAGE_COUNT=$(echo "$API_RESPONSE" | grep -o '"data":\[' | wc -l)
if [ "$PAGE_COUNT" -gt 0 ]; then
    echo "   ✅ Pages collection exists"
    
    # Check if there are any pages
    if echo "$API_RESPONSE" | grep -q '"id"'; then
        echo "   ✅ Test page(s) found"
        echo ""
        echo "4. Checking page data with populate..."
        FULL_RESPONSE=$(curl -s "https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?populate=deep")
        
        if echo "$FULL_RESPONSE" | grep -q "layout"; then
            echo "   ✅ Layout field exists"
        else
            echo "   ⚠️  Layout field not found - check Dynamic Zone"
        fi
        
        if echo "$FULL_RESPONSE" | grep -q "__component"; then
            echo "   ✅ Components found in layout"
        else
            echo "   ⚠️  No components in layout - add blocks to your page"
        fi
    else
        echo "   ⚠️  No pages created yet"
        echo "   Create a test page in Strapi admin"
    fi
else
    echo "   ❌ Pages collection not found"
    echo "   Create Page collection type in Strapi admin"
    exit 1
fi

echo ""
echo "5. Checking .env.local..."
if [ -f ".env.local" ]; then
    if grep -q "STRAPI_API_TOKEN" .env.local; then
        echo "   ✅ API token configured"
    else
        echo "   ⚠️  API token not found in .env.local"
        echo "   Add: STRAPI_API_TOKEN=your-token"
    fi
else
    echo "   ⚠️  .env.local not found"
    echo "   Create .env.local with STRAPI_URL and STRAPI_API_TOKEN"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo ""

if echo "$API_RESPONSE" | grep -q '"id"' && echo "$FULL_RESPONSE" | grep -q "__component"; then
    echo "✅ Strapi is ready for frontend integration!"
    echo ""
    echo "Next steps:"
    echo "1. Ensure API token is in .env.local"
    echo "2. Tell me: 'Content types are ready, implement queries'"
    echo "3. I will implement the query functions"
else
    echo "⚠️  Strapi setup incomplete"
    echo ""
    echo "Complete these steps:"
    if ! echo "$API_RESPONSE" | grep -q '"id"'; then
        echo "- Create a test page in Strapi admin"
    fi
    if ! echo "$FULL_RESPONSE" | grep -q "__component"; then
        echo "- Add blocks (hero, services, cta) to your page"
    fi
    if ! grep -q "STRAPI_API_TOKEN" .env.local 2>/dev/null; then
        echo "- Generate API token and add to .env.local"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
