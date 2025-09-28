#!/bin/bash

# Confidential Health Surveys - Development Startup Script
# This script starts all development services

set -e

echo "🏥 Starting Confidential Health Surveys Development Environment..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Check if Hardhat node is running
if check_port 8545; then
    echo "✅ Hardhat node is already running on port 8545"
else
    echo "🚀 Starting Hardhat node..."
    cd packages/fhevm-hardhat-template
    npx hardhat node --verbose &
    HARDHAT_PID=$!
    cd ../..
    
    # Wait for Hardhat to start
    echo "⏳ Waiting for Hardhat node to start..."
    sleep 10
    
    # Check if Hardhat started successfully
    if check_port 8545; then
        echo "✅ Hardhat node started successfully"
    else
        echo "❌ Failed to start Hardhat node"
        exit 1
    fi
fi

# Deploy contracts
echo "📦 Deploying contracts..."
cd packages/fhevm-hardhat-template
npx hardhat deploy --network localhost
cd ../..

# Check if frontend is already running
if check_port 3000; then
    echo "✅ Frontend is already running on port 3000"
else
    echo "🌐 Starting frontend..."
    cd packages/frontend
    npm run dev:mock &
    FRONTEND_PID=$!
    cd ../..
    
    # Wait for frontend to start
    echo "⏳ Waiting for frontend to start..."
    sleep 5
fi

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "⛓️  Hardhat Node: http://localhost:8545"
echo "📊 Contract Address: Check terminal output above"
echo ""
echo "💡 Tips:"
echo "   - Connect MetaMask to Hardhat network (Chain ID: 31337)"
echo "   - Use the first Hardhat account for testing"
echo "   - Check browser console for any errors"
echo ""
echo "🛑 To stop all services, press Ctrl+C"

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping services..."; kill $HARDHAT_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

# Keep script running
wait

