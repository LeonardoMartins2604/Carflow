"""
Script para popular o banco de dados com dados de exemplo
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'carflow.settings')
django.setup()

from core.models import Produto, Servico, Agendamento
from datetime import date, time, timedelta

# Limpar dados existentes
print("Limpando dados existentes...")
Produto.objects.all().delete()
Servico.objects.all().delete()
Agendamento.objects.all().delete()

# Criar Produtos
print("Criando produtos...")
produtos_data = [
    {'nome': 'Óleo Motor 5W30', 'descricao': 'Óleo lubrificante sintético premium para motores modernos', 'preco': 89.90, 'estoque': 25},
    {'nome': 'Filtro de Ar Esportivo', 'descricao': 'Filtro de ar de alta performance com elemento lavável', 'preco': 120.00, 'estoque': 15},
    {'nome': 'Pastilha de Freio Dianteira', 'descricao': 'Kit de pastilhas de freio cerâmicas para freios dianteiros', 'preco': 180.50, 'estoque': 8},
    {'nome': 'Bateria 60Ah', 'descricao': 'Bateria automotiva 60Ah com 18 meses de garantia', 'preco': 450.00, 'estoque': 12},
    {'nome': 'Pneu Aro 15', 'descricao': 'Pneu radial aro 15 para uso urbano', 'preco': 320.00, 'estoque': 20},
    {'nome': 'Velas de Ignição', 'descricao': 'Jogo com 4 velas de ignição de irídio', 'preco': 95.00, 'estoque': 30},
]

for p_data in produtos_data:
    Produto.objects.create(**p_data)
    print(f"  ✓ {p_data['nome']}")

# Criar Serviços
print("\nCriando serviços...")
servicos_data = [
    {'nome': 'Troca de Óleo', 'descricao': 'Troca completa de óleo com filtro incluído', 'preco': 150.00, 'duracao': 45},
    {'nome': 'Alinhamento e Balanceamento', 'descricao': 'Alinhamento computadorizado e balanceamento das 4 rodas', 'preco': 120.00, 'duracao': 60},
    {'nome': 'Revisão Geral', 'descricao': 'Revisão completa com checklist de 50 itens', 'preco': 350.00, 'duracao': 120},
    {'nome': 'Troca de Pastilhas de Freio', 'descricao': 'Substituição de pastilhas de freio dianteiras ou traseiras', 'preco': 200.00, 'duracao': 90},
    {'nome': 'Diagnóstico Eletrônico', 'descricao': 'Análise completa do sistema eletrônico do veículo', 'preco': 100.00, 'duracao': 45},
    {'nome': 'Limpeza de Bicos Injetores', 'descricao': 'Limpeza e descarbonização dos bicos injetores', 'preco': 180.00, 'duracao': 90},
]

for s_data in servicos_data:
    Servico.objects.create(**s_data)
    print(f"  ✓ {s_data['nome']}")

# Criar Agendamentos
print("\nCriando agendamentos...")
servicos = list(Servico.objects.all())
hoje = date.today()

agendamentos_data = [
    {'cliente_nome': 'João Silva', 'cliente_telefone': '(11) 98765-4321', 'servico': servicos[0], 'data': hoje, 'hora': time(9, 0), 'status': 'confirmado', 'observacoes': 'Cliente preferencial'},
    {'cliente_nome': 'Maria Oliveira', 'cliente_telefone': '(11) 97654-3210', 'servico': servicos[1], 'data': hoje, 'hora': time(10, 30), 'status': 'pendente', 'observacoes': ''},
    {'cliente_nome': 'Carlos Santos', 'cliente_telefone': '(11) 96543-2109', 'servico': servicos[2], 'data': hoje + timedelta(days=1), 'hora': time(14, 0), 'status': 'confirmado', 'observacoes': 'Trazer documentos do carro'},
    {'cliente_nome': 'Ana Paula', 'cliente_telefone': '(11) 95432-1098', 'servico': servicos[3], 'data': hoje + timedelta(days=2), 'hora': time(8, 30), 'status': 'pendente', 'observacoes': ''},
    {'cliente_nome': 'Pedro Costa', 'cliente_telefone': '(11) 94321-0987', 'servico': servicos[4], 'data': hoje - timedelta(days=1), 'hora': time(16, 0), 'status': 'concluido', 'observacoes': 'Serviço realizado com sucesso'},
    {'cliente_nome': 'Luiza Mendes', 'cliente_telefone': '(11) 93210-9876', 'servico': servicos[5], 'data': hoje + timedelta(days=3), 'hora': time(11, 0), 'status': 'pendente', 'observacoes': ''},
]

for a_data in agendamentos_data:
    Agendamento.objects.create(**a_data)
    print(f"  ✓ {a_data['cliente_nome']} - {a_data['servico'].nome}")

print("\n✅ Dados de exemplo criados com sucesso!")
print(f"   - {Produto.objects.count()} produtos")
print(f"   - {Servico.objects.count()} serviços")
print(f"   - {Agendamento.objects.count()} agendamentos")
