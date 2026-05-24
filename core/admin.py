from django.contrib import admin
from .models import Produto, Servico, Agendamento


@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'preco', 'estoque')
    search_fields = ('nome', 'descricao')
    list_filter = ('estoque',)


@admin.register(Servico)
class ServicoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'preco', 'duracao')
    search_fields = ('nome', 'descricao')
    list_filter = ('duracao',)


@admin.register(Agendamento)
class AgendamentoAdmin(admin.ModelAdmin):
    list_display = ('cliente_nome', 'cliente_telefone', 'servico', 'data', 'hora', 'status')
    search_fields = ('cliente_nome', 'cliente_telefone')
    list_filter = ('status', 'data', 'servico')
    date_hierarchy = 'data'
    ordering = ('-created_at',)
