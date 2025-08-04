#!/bin/bash

# Smart-ATS-Resume Dependency Update Script
# Run this from the project root directory

echo "🔒 Starting security and dependency updates..."

# 1. Security audit and fixes
echo "📋 Running security audit..."
npm audit

echo "🔧 Attempting automatic security fixes..."
npm audit fix

# 2. Critical security updates
echo "🚨 Updating critical packages with security issues..."
npm install stripe@latest
npm install jspdf@latest  
npm install dompurify@latest

# 3. Major dependency updates
echo "📦 Updating major dependencies..."
npm install @sentry/nextjs@latest
npm install ai@latest
npm install openai@latest
npm install @supabase/supabase-js@latest
npm install @supabase/ssr@latest
npm install lucide-react@latest
npm install zod@latest

# 4. Framework updates
echo "🚀 Updating framework packages..."
npm install next@latest
npm install react@latest
npm install react-dom@latest
npm install tailwindcss@latest

# 5. Type definitions
echo "📝 Updating TypeScript definitions..."
npm install -D @types/node@latest
npm install -D @types/react@latest
npm install -D @types/react-dom@latest
npm install -D typescript@latest

# 6. Dev dependencies
echo "🔨 Updating development dependencies..."
npm install -D eslint@latest
npm install -D eslint-config-next@latest
npm install -D jest@latest
npm install -D @testing-library/react@latest
npm install -D @testing-library/jest-dom@latest
npm install -D postcss@latest
npm install -D autoprefixer@latest

# 7. Remove unused dependencies
echo "🧹 Removing unused dependencies..."
npm uninstall fileinput
npm uninstall formidable
npm uninstall mammoth
npm uninstall pdf-parse
npm uninstall pdf2pic
npm uninstall @playwright/test

# 8. Clean and reinstall
echo "🔄 Cleaning and reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install

# 9. Final audit
echo "✅ Final security audit..."
npm audit

echo "✨ Dependency update complete!"