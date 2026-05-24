from rest_framework import serializers
from .models import Produto, Servico, Agendamento


class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ['id', 'nome', 'descricao', 'preco', 'estoque']


class ServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servico
        fields = ['id', 'nome', 'descricao', 'preco', 'duracao']


class AgendamentoSerializer(serializers.ModelSerializer):
    servico_nome = serializers.CharField(source='servico.nome', read_only=True)
    
    class Meta:
        model = Agendamento
        fields = [
            'id', 'cliente_nome', 'cliente_telefone', 
            'servico', 'servico_nome', 'data', 'hora', 
            'status', 'observacoes', 'created_at'
        ]
        read_only_fields = ['created_at']
