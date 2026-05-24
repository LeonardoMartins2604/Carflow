"""
CarFlow Server - Wrapper that runs the Django application via uvicorn/ASGI.
The Django project is located in /app/ (parent directory).
"""
import os
import sys
from pathlib import Path

# Add the project root to the Python path
PROJECT_ROOT: Path = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'carflow.settings')

# Initialize Django
import django
django.setup()

# Import Django's WSGI application
from carflow.wsgi import application as wsgi_app

# Create FastAPI wrapper that mounts Django
from fastapi import FastAPI
from fastapi.middleware.wsgi import WSGIMiddleware
from fastapi.staticfiles import StaticFiles

app: FastAPI = FastAPI()

# Serve Django static files (admin CSS, etc.) at /api/static/
STATIC_ROOT: Path = PROJECT_ROOT / 'staticfiles'
if STATIC_ROOT.exists():
    app.mount("/api/static", StaticFiles(directory=str(STATIC_ROOT)), name="static")

# Mount Django WSGI app at root - handles all other requests including /api/admin, /api/app, etc.
app.mount("/", WSGIMiddleware(wsgi_app))
