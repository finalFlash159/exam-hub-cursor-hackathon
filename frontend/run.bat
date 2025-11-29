@echo off

REM Exam Hub Frontend - Start Script

echo 🚀 Starting Exam Hub Frontend...

REM Check if .env exists, if not create from example
if not exist ".env" (
    echo 📝 Creating .env file...
    copy .env.example .env
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

REM Start the development server
echo ✅ Starting development server...
echo 🌐 Frontend: http://localhost:5173
echo.
call npm run dev

