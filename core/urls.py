from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('cadastro/', views.cadastro, name='cadastro'),
    path('produtos/', views.produtos_list, name='produtos'),
    path('servicos/', views.servicos_list, name='servicos'),
    path('agendamentos/', views.agendamentos_list, name='agendamentos'),
]
