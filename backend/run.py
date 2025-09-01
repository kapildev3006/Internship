#!/usr/bin/env python3
import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False
    return True

def run_flask_app():
    """Run the Flask application"""
    try:
        print("🚀 Starting Flask server...")
        subprocess.run([sys.executable, 'app.py'])
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except Exception as e:
        print(f"❌ Error running Flask app: {e}")

if __name__ == "__main__":
    print("🔧 Setting up PM Internship Recommender Backend...")
    
    if install_requirements():
        run_flask_app()
    else:
        print("❌ Setup failed. Please check the error messages above.")