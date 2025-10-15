#!/bin/bash

# Vercel build script to handle monorepo dependencies
echo "🚀 Starting Vercel build process..."

# Use standalone package.json to avoid workspace conflicts
cp package-standalone.json package.json

echo "✅ Using standalone package.json"

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

echo "✅ Dependencies installed"

# Build the Next.js app
npm run build

echo "✅ Build completed successfully"
