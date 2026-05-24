"""
URL configuration for carflow project.

Como o roteamento Kubernetes envia '/api/*' para o backend Django,
todas as URLs estão sob o prefixo '/api/'.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/', include('core.urls')),
]
