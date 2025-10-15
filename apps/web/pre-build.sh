#!/bin/bash

# Pre-build script for Vercel deployment
# This script ensures we only build the web app without monorepo dependencies

echo "🚀 Starting Vercel pre-build process..."

# Backup original package.json
cp package.json package.json.backup

# Use standalone package.json for deployment
cp package-standalone.json package.json

echo "✅ Switched to standalone package.json for Vercel deployment"

# Run the build
npm install --legacy-peer-deps
npm run build

echo "✅ Build completed successfully"
