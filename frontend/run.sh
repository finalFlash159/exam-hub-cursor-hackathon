#!/bin/bash

# Exam Hub Frontend - Start Script

echo "🚀 Starting Exam Hub Frontend..."

# Check if .env exists, if not create from example
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "✅ Starting development server..."
echo "🌐 Frontend: http://localhost:5173"
echo ""
npm run dev

