# CarFlow - Sistema de Gerenciamento Automotivo

## Problema Original
Projeto Django CarFlow para gerenciamento de oficina automotiva com models Produto, Servico e Agendamento.

## Arquitetura

### Stack
- **Backend**: Django 5.2 + SQLite
- **Frontend**: Django Templates (Server-Side Rendered) + CSS puro
- **Servido via**: uvicorn + FastAPI WSGIMiddleware na porta 8001

### Estrutura de Arquivos (Final - corresponde à estrutura solicitada)
```
/app/
├── manage.py                      # Django management script
├── requirements.txt               # Dependências Python (raiz)
├── db.sqlite3                     # Banco SQLite
├── seed_data.py                   # Script para popular DB com exemplos
├── carflow/                       # Projeto Django principal
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py                # Configurações Django
│   ├── urls.py                    # URLs principais
│   └── wsgi.py
├── core/                          # App principal Django
│   ├── __init__.py
│   ├── admin.py                   # Configuração Django Admin
│   ├── apps.py
│   ├── models.py                  # Produto, Servico, Agendamento
│   ├── tests.py
│   ├── urls.py                    # URLs do app
│   ├── views.py                   # home() e cadastro()
│   └── migrations/
│       ├── __init__.py
│       └── 0001_initial.py
├── templates/                     # Templates HTML
│   ├── index.html                 # Dashboard com stats
│   └── cadastro.html              # Formulário novo agendamento
└── static/
    └── style.css                  # Estilos do sistema
```

### URLs
- `/api/` -> Dashboard (home)
- `/api/cadastro/` -> Formulário de novo agendamento
- `/api/admin/` -> Django Admin
- `/api/static/style.css` -> CSS estático

> Nota: Internamente o Django usa `''` e `cadastro/`, mas como o roteamento Kubernetes envia `/api/*` para o backend, as URLs públicas têm o prefixo `/api/`.

## Models

### Produto
- nome, descricao, preco (DecimalField), estoque (IntegerField)

### Servico
- nome, descricao, preco (DecimalField), duracao (IntegerField em minutos)

### Agendamento
- cliente_nome, cliente_telefone, servico (FK), data, hora
- status (pendente/confirmado/concluido/cancelado), observacoes, created_at

## Implementado
- [x] (2026-05-24) Estrutura Django pura conforme listing solicitado
- [x] (2026-05-24) Models com migração 0001_initial.py
- [x] (2026-05-24) Django Admin configurado em pt-BR
- [x] (2026-05-24) Templates index.html e cadastro.html
- [x] (2026-05-24) CSS unificado em static/style.css
- [x] (2026-05-24) requirements.txt na raiz
- [x] (2026-05-24) Dados de exemplo populados (6 produtos, 6 serviços, 7 agendamentos)
- [x] (2026-05-24) Superusuário admin/admin123 criado
- [x] (2026-05-24) Removido Django REST Framework para manter estrutura simples

## Credenciais
- Admin Django: `admin` / `admin123`
- URL Admin: `https://service-scheduler-137.preview.emergentagent.com/api/admin/`
- URL Sistema: `https://service-scheduler-137.preview.emergentagent.com/api/`

## Backlog
- [ ] P2: Listar Produtos e Serviços em páginas próprias (via templates)
- [ ] P2: Filtros e busca nos agendamentos
- [ ] P2: Sistema de notificação por WhatsApp/SMS
- [ ] P2: Relatórios em PDF
