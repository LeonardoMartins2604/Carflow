from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views

router = DefaultRouter()
router.register(r'produtos', api_views.ProdutoViewSet, basename='produto')
router.register(r'servicos', api_views.ServicoViewSet, basename='servico')
router.register(r'agendamentos', api_views.AgendamentoViewSet, basename='agendamento')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', api_views.dashboard_stats, name='dashboard-stats'),
]
