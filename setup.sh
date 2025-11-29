#!/bin/bash

# Exam Hub - Initial Setup Script

echo "🎓 Exam Hub - Initial Setup"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found. Please install Python 3.8+${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Python found: $(python3 --version)${NC}"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 16+${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install npm${NC}"
    exit 1
else
    echo -e "${GREEN}✅ npm found: $(npm --version)${NC}"
fi

echo ""
echo "🔧 Setting up Backend..."
echo "------------------------"

# Backend setup
cd backend

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating backend .env file..."
    cat > .env << EOL
# Backend Environment Configuration

# App
APP_NAME=Exam Hub
DEBUG=True

# Database
DATABASE_URL=sqlite+aiosqlite:///./exam_hub.db

# CORS Origins (frontend URLs)
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://localhost:5174"]

# File Upload
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=10485760
ALLOWED_EXTENSIONS=["pdf","docx","doc","txt","pptx","jpg","jpeg","png"]

# AI/GenAI (optional)
GENAI_ENABLED=False
EOL
    echo -e "${GREEN}✅ Backend .env created${NC}"
else
    echo -e "${YELLOW}⚠️  Backend .env already exists, skipping${NC}"
fi

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
    echo -e "${GREEN}✅ Virtual environment created${NC}"
else
    echo -e "${YELLOW}⚠️  Virtual environment already exists, skipping${NC}"
fi

# Activate and install dependencies
echo "📥 Installing Python dependencies..."
source venv/bin/activate
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt
echo -e "${GREEN}✅ Python dependencies installed${NC}"
deactivate

cd ..

echo ""
echo "🎨 Setting up Frontend..."
echo "------------------------"

# Frontend setup
cd frontend

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env file..."
    cat > .env << EOL
# Frontend Environment Configuration
VITE_API_BASE_URL=http://localhost:8000
EOL
    echo -e "${GREEN}✅ Frontend .env created${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend .env already exists, skipping${NC}"
fi

# Install npm dependencies
echo "📥 Installing Node.js dependencies (this may take a minute)..."
npm install --silent
echo -e "${GREEN}✅ Node.js dependencies installed${NC}"

cd ..

echo ""
echo "=============================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "=============================="
echo ""
echo "📖 Next Steps:"
echo ""
echo "1️⃣  Start Backend (Terminal 1):"
echo "   cd backend && ./run.sh"
echo "   (or: source venv/bin/activate && python main.py)"
echo ""
echo "2️⃣  Start Frontend (Terminal 2):"
echo "   cd frontend && npm run dev"
echo ""
echo "3️⃣  Access Application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: START_HERE.md"
echo "   - Full Guide:  SETUP_GUIDE.md"
echo ""
echo "Need help? Check the README.md or use the chatbot in the app!"
echo ""

