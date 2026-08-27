#!/bin/bash

echo "======================================================================"
echo "CLEAR NEXT.JS CACHE"
echo "======================================================================"
echo ""

# Check if .next directory exists
if [ -d "dental-frontend/.next" ]; then
    echo "📁 Found .next cache directory"
    echo "🗑️  Removing .next cache..."
    rm -rf dental-frontend/.next
    echo "✅ Cache cleared successfully"
else
    echo "ℹ️  No .next cache directory found"
fi

echo ""
echo "======================================================================"
echo "CACHE CLEARED"
echo "======================================================================"
echo ""
echo "Next steps:"
echo "  1. Restart the Next.js dev server:"
echo "     cd dental-frontend && npm run dev"
echo ""
echo "  2. Hard refresh your browser:"
echo "     - Mac: Cmd + Shift + R"
echo "     - Windows/Linux: Ctrl + Shift + R"
echo ""
echo "  3. Or open in incognito/private window"
echo ""
