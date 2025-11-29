#!/usr/bin/env python3
"""
Test script for Gemini AI integration
Run this to test if Gemini is working correctly
"""

import asyncio
import os
from app.services.gemini_service import GeminiService
from app.core.config import settings

async def test_gemini():
    print("🧪 Testing Gemini AI Integration")
    print("=" * 50)

    # Check if API key is configured
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
        print("❌ Gemini API key not configured")
        print("Run: python setup_gemini.py")
        return

    try:
        print("🔄 Initializing Gemini service...")
        gemini_service = GeminiService()
        print("✅ Gemini service initialized")

        # Test question generation
        print("\n🔄 Testing question generation...")
        test_text = """
        Python là một ngôn ngữ lập trình phổ biến được sử dụng cho nhiều mục đích khác nhau.
        Python được tạo ra bởi Guido van Rossum và được phát hành lần đầu vào năm 1991.
        Python có cú pháp đơn giản và dễ đọc, phù hợp cho người mới bắt đầu.
        """

        questions = await gemini_service.generate_questions_from_text(
            text=test_text,
            question_type="mcq",
            num_questions=2,
            difficulty="easy"
        )

        print(f"✅ Generated {len(questions)} questions:")
        for i, q in enumerate(questions, 1):
            print(f"\n{i}. {q.question_text}")
            if q.options:
                for j, option in enumerate(q.options):
                    print(f"   {chr(65+j)}. {option}")
            print(f"   Answer: {q.correct_answer}")

        print("\n🎉 Gemini AI integration is working correctly!")

    except Exception as e:
        print(f"❌ Error testing Gemini: {e}")
        print("\nTroubleshooting:")
        print("1. Check your API key is valid")
        print("2. Make sure you have internet connection")
        print("3. Check the quota/limits on your Google Cloud project")

if __name__ == "__main__":
    asyncio.run(test_gemini())
