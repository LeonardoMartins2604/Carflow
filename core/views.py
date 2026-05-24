from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Produto, Servico, Agendamento


def home(request):
    """Dashboard principal"""
    total_produtos = Produto.objects.count()
    total_servicos = Servico.objects.count()
    total_agendamentos = Agendamento.objects.count()
    agendamentos_pendentes = Agendamento.objects.filter(status='pendente').count()
    agendamentos_recentes = Agendamento.objects.all()[:5]
    
    context = {
        'total_produtos': total_produtos,
        'total_servicos': total_servicos,
        'total_agendamentos': total_agendamentos,
        'agendamentos_pendentes': agendamentos_pendentes,
        'agendamentos_recentes': agendamentos_recentes,
    }
    return render(request, 'index.html', context)


def cadastro(request):
    """Página de cadastro de agendamento"""
    servicos = Servico.objects.all()
    
    if request.method == 'POST':
        cliente_nome = request.POST.get('cliente_nome')
        cliente_telefone = request.POST.get('cliente_telefone')
        servico_id = request.POST.get('servico')
        data = request.POST.get('data')
        hora = request.POST.get('hora')
        observacoes = request.POST.get('observacoes', '')
        
        try:
            servico = Servico.objects.get(id=servico_id)
            Agendamento.objects.create(
                cliente_nome=cliente_nome,
                cliente_telefone=cliente_telefone,
                servico=servico,
                data=data,
                hora=hora,
                observacoes=observacoes
            )
            messages.success(request, 'Agendamento criado com sucesso!')
            return redirect('home')
        except Exception as e:
            messages.error(request, f'Erro ao criar agendamento: {str(e)}')
    
    context = {'servicos': servicos}
    return render(request, 'cadastro.html', context)


def produtos_list(request):
    """Lista de produtos"""
    produtos = Produto.objects.all()
    context = {'produtos': produtos}
    return render(request, 'produtos.html', context)


def servicos_list(request):
    """Lista de serviços"""
    servicos = Servico.objects.all()
    context = {'servicos': servicos}
    return render(request, 'servicos.html', context)


def agendamentos_list(request):
    """Lista de agendamentos"""
    agendamentos = Agendamento.objects.all()
    context = {'agendamentos': agendamentos}
    return render(request, 'agendamentos.html', context)
