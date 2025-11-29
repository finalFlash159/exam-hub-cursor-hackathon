#!/usr/bin/env python3
"""
Convert black icons to white icons for dark mode
Requires: Pillow (pip install Pillow)
"""

from PIL import Image
import os

def convert_to_white(input_path, output_path):
    """
    Convert a black/dark icon to white while preserving alpha channel
    """
    try:
        # Open the image
        img = Image.open(input_path).convert('RGBA')
        
        # Get image data
        pixels = img.load()
        width, height = img.size
        
        # Convert all non-transparent pixels to white
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                
                # If pixel has any opacity, make it white
                if a > 0:
                    pixels[x, y] = (255, 255, 255, a)
        
        # Save the result
        img.save(output_path)
        print(f"✅ Converted: {os.path.basename(input_path)} -> {os.path.basename(output_path)}")
        
    except Exception as e:
        print(f"❌ Error converting {input_path}: {str(e)}")

def main():
    # Icon names to convert
    icons = ['dashboard', 'exam', 'AI', 'history', 'settings']
    
    # Current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("🔄 Converting icons to white for dark mode...")
    print(f"📁 Working directory: {current_dir}\n")
    
    for icon_name in icons:
        input_path = os.path.join(current_dir, f'{icon_name}.png')
        output_path = os.path.join(current_dir, f'{icon_name}-white.png')
        
        if os.path.exists(input_path):
            convert_to_white(input_path, output_path)
        else:
            print(f"⚠️  File not found: {icon_name}.png")
    
    print("\n✨ Conversion complete!")

if __name__ == '__main__':
    main()
