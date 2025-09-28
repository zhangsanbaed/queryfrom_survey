#!/bin/bash

# Confidential Health Surveys - Setup Script
# This script sets up the development environment for the project

set -e

echo "🏥 Setting up Confidential Health Surveys..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install contract dependencies
echo "📦 Installing contract dependencies..."
cd packages/contracts
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Go back to root
cd ../..

# Create environment files if they don't exist
echo "⚙️  Setting up environment files..."

if [ ! -f "packages/contracts/.env" ]; then
    cp packages/contracts/env.example packages/contracts/.env
    echo "📝 Created packages/contracts/.env from example"
fi

if [ ! -f "packages/frontend/.env.local" ]; then
    cp packages/frontend/env.example packages/frontend/.env.local
    echo "📝 Created packages/frontend/.env.local from example"
fi

# Compile contracts
echo "🔨 Compiling smart contracts..."
cd packages/contracts
npm run compile

# Go back to root
cd ../..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update environment files with your configuration:"
echo "   - packages/contracts/.env"
echo "   - packages/frontend/.env.local"
echo ""
echo "2. Start the Hardhat node:"
echo "   npm run dev:contracts"
echo ""
echo "3. In another terminal, deploy contracts:"
echo "   npm run deploy:local"
echo ""
echo "4. Start the frontend:"
echo "   npm run dev:frontend"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "Happy coding! 🚀"

