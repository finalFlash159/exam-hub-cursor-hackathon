#!/usr/bin/env python3
"""
Setup script for Gemini AI integration
Run this script to configure your Gemini API key
"""

import os
import sys

def setup_gemini():
    print("🚀 Setting up Gemini AI for Exam Hub")
    print("=" * 50)

    # Check if .env file exists
    env_file = ".env"
    if not os.path.exists(env_file):
        print("📝 Creating .env file...")

        env_content = """# Google Gemini AI Configuration
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Database
DATABASE_URL=sqlite+aiosqlite:///./exam_hub.db

# File Upload
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=10485760  # 10MB

# AI Settings
GENAI_ENABLED=true
GEMINI_MODEL=gemini-1.5-flash
"""

        with open(env_file, "w") as f:
            f.write(env_content)
        print("✅ Created .env file")

    # Check if API key is already set
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and api_key != "your_gemini_api_key_here":
        print("✅ Gemini API key is already configured")
        return

    print("\n🔑 Gemini API Setup")
    print("To use AI-powered question generation, you need a Google Gemini API key:")
    print("1. Go to: https://makersuite.google.com/app/apikey")
    print("2. Sign in with your Google account")
    print("3. Create a new API key")
    print("4. Copy the API key")

    api_key = input("\nEnter your Gemini API key (or press Enter to skip): ").strip()

    if api_key:
        # Update .env file
        with open(env_file, "r") as f:
            content = f.read()

        content = content.replace("GEMINI_API_KEY=your_gemini_api_key_here", f"GEMINI_API_KEY={api_key}")

        with open(env_file, "w") as f:
            f.write(content)

        print("✅ API key saved to .env file")
        print("\n🎉 Setup complete! You can now generate questions using AI.")
        print("Run the server with: python main.py")
    else:
        print("\n⚠️  No API key provided. AI features will be disabled.")
        print("You can still use manual question creation and basic features.")
        print("To enable AI later, run this script again or edit the .env file directly.")

if __name__ == "__main__":
    setup_gemini()
