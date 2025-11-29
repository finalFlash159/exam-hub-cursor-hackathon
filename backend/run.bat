@echo off
REM Exam Hub Backend - Start Script for Windows

echo Starting Exam Hub Backend...

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/update dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Create uploads directory if it doesn't exist
if not exist "uploads\" mkdir uploads

REM Copy .env.example if .env doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
)

REM Start the server
echo Starting server...
echo API: http://localhost:8000
echo Docs: http://localhost:8000/docs
echo.
python main.py

pause

