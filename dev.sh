#!/bin/bash

# Start NextPay Development Servers

echo "🚀 Starting NextPay Development Environment..."
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill 0
}

trap cleanup EXIT

# Start API server
echo "📦 Starting Backend API on port 3001..."
cd apps/api && npm run dev &
API_PID=$!

# Wait a bit for API to start
sleep 2

# Start Web server
echo "🌐 Starting Frontend on port 3000..."
cd ../web && npm run dev &
WEB_PID=$!

# Wait for both processes
wait


