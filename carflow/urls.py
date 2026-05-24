"""
URL configuration for carflow project.

Como o roteamento Kubernetes envia '/' para o frontend React e '/api/*' para o backend Django,
todas as URLs do Django (admin, templates HTML, API REST) estão sob o prefixo '/api/'.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Django Admin
    path('api/admin/', admin.site.urls),
    
    # Django REST API
    path('api/', include('core.api_urls')),
    
    # Django HTML Templates (Server-Side Rendered)
    path('api/app/', include('core.urls')),
]
