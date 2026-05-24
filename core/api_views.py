from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Produto, Servico, Agendamento
from .serializers import ProdutoSerializer, ServicoSerializer, AgendamentoSerializer


class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer


class ServicoViewSet(viewsets.ModelViewSet):
    queryset = Servico.objects.all()
    serializer_class = ServicoSerializer


class AgendamentoViewSet(viewsets.ModelViewSet):
    queryset = Agendamento.objects.all()
    serializer_class = AgendamentoSerializer


@api_view(['GET'])
def dashboard_stats(request):
    """Retorna estatísticas do dashboard"""
    from datetime import date
    
    total_produtos = Produto.objects.count()
    total_servicos = Servico.objects.count()
    total_agendamentos = Agendamento.objects.count()
    agendamentos_pendentes = Agendamento.objects.filter(status='pendente').count()
    agendamentos_hoje = Agendamento.objects.filter(data=date.today()).count()
    
    data = {
        'total_produtos': total_produtos,
        'total_servicos': total_servicos,
        'total_agendamentos': total_agendamentos,
        'agendamentos_pendentes': agendamentos_pendentes,
        'agendamentos_hoje': agendamentos_hoje,
    }
    
    return Response(data)
