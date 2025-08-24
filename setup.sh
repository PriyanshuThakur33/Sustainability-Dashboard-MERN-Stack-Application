#!/bin/bash

echo "🌱 Sustainability Dashboard Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH."
    echo "   Please install MongoDB or use Docker Compose."
else
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB or use Docker Compose."
    fi
fi

echo ""
echo "🚀 Installing dependencies..."
echo ""

# Install root dependencies
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install common dependencies
echo "📦 Installing common dependencies..."
cd common
npm install
cd ..

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Create environment files
echo "🔧 Setting up environment files..."

# Server environment
if [ ! -f "server/.env" ]; then
    echo "📝 Creating server/.env from template..."
    cp server/env.example server/.env
    echo "   Please edit server/.env with your configuration"
else
    echo "✅ server/.env already exists"
fi

# Client environment
if [ ! -f "client/.env" ]; then
    echo "📝 Creating client/.env..."
    echo "VITE_API_URL=http://localhost:5000/api" > client/.env
    echo "   Client environment file created"
else
    echo "✅ client/.env already exists"
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. 📝 Edit environment files:"
echo "   - server/.env (database, JWT secret, etc.)"
echo "   - client/.env (API URL)"
echo ""
echo "2. 🗄️  Start MongoDB:"
echo "   - Local: mongod"
echo "   - Docker: npm run docker:up"
echo ""
echo "3. 🌱 Seed the database:"
echo "   npm run seed"
echo ""
echo "4. 🚀 Start development servers:"
echo "   npm run dev"
echo ""
echo "5. 🌐 Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend: http://localhost:5000"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🎉 Setup completed successfully!"
