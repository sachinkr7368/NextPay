#!/bin/bash

# Railway build script for NextPay API
echo "🚀 Starting Railway build process..."

# Navigate to API directory
cd apps/api

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully"
echo "📁 Build output in apps/api/dist/"
