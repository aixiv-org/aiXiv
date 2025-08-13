#!/bin/bash

# Test both domains
echo "🧪 Testing both domains..."

echo "Testing https://aixiv.co..."
curl -I https://aixiv.co 2>/dev/null | head -1

echo "Testing https://www.aixiv.co..."
curl -I https://www.aixiv.co 2>/dev/null | head -1

echo ""
echo "✅ Both domains should return the same status code (200)"
echo "🔄 When you update your site, both domains will update together!" 