from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Produto, Servico, Agendamento


def home(request):
    """Página inicial - Dashboard"""
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
        try:
            servico = Servico.objects.get(id=request.POST.get('servico'))
            Agendamento.objects.create(
                cliente_nome=request.POST.get('cliente_nome'),
                cliente_telefone=request.POST.get('cliente_telefone'),
                servico=servico,
                data=request.POST.get('data'),
                hora=request.POST.get('hora'),
                observacoes=request.POST.get('observacoes', '')
            )
            messages.success(request, 'Agendamento criado com sucesso!')
            return redirect('home')
        except Exception as e:
            messages.error(request, f'Erro ao criar agendamento: {str(e)}')

    return render(request, 'cadastro.html', {'servicos': servicos})
