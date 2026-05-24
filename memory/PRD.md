# CarFlow - Sistema de Gerenciamento Automotivo

## Problema Original
O usuário compartilhou um projeto Django CarFlow com estrutura básica (models de Produto, Servico, Agendamento, templates simples) e pediu para criar um frontend completo, depois solicitou que tudo fosse implementado em Python (Django).

## Arquitetura

### Backend: Django 5.2 + Django REST Framework
- Localização: `/app/` (manage.py, carflow/, core/)
- Banco de dados: SQLite (db.sqlite3)
- Roda na porta 8001 via uvicorn + WSGIMiddleware
- Servido pelo supervisor program `backend`

### Frontend: 
- **Django Templates (SSR)**: Acessível em `/api/app/*`
- **Django Admin**: `/api/admin/`
- **React (cliente alternativo)**: `/` (porta 3000)

### Estrutura de Arquivos
```
/app/
├── manage.py                     # Django management script
├── seed_data.py                  # Script para popular DB com exemplos
├── db.sqlite3                    # Banco SQLite
├── carflow/                      # Projeto Django principal
│   ├── __init__.py
│   ├── settings.py               # Configurações (CSRF, CORS, etc.)
│   ├── urls.py                   # URLs principais (com prefixo /api/)
│   ├── wsgi.py                   # WSGI app
│   └── asgi.py                   # ASGI app
├── core/                         # App principal Django
│   ├── models.py                 # Produto, Servico, Agendamento
│   ├── admin.py                  # Configuração Django Admin
│   ├── views.py                  # Views HTML (dashboard, cadastro, etc.)
│   ├── api_views.py              # ViewSets DRF
│   ├── api_urls.py               # URLs da API REST
│   ├── urls.py                   # URLs HTML templates
│   ├── serializers.py            # Serializers DRF
│   └── migrations/0001_initial.py
├── templates/                    # Templates HTML
│   ├── base.html                 # Template base com Tailwind
│   ├── index.html                # Dashboard
│   ├── produtos.html             # Lista produtos
│   ├── servicos.html             # Cards de serviços
│   ├── agendamentos.html         # Cards de agendamentos
│   └── cadastro.html             # Form novo agendamento
├── static/                       # Arquivos estáticos
├── staticfiles/                  # Arquivos coletados (collectstatic)
└── backend/
    └── server.py                 # Wrapper FastAPI que serve Django via WSGI
```

## Modelos (Models)

### Produto
- `nome`: CharField(max_length=100)
- `descricao`: TextField
- `preco`: DecimalField(max_digits=10, decimal_places=2)
- `estoque`: IntegerField

### Servico
- `nome`: CharField(max_length=100)
- `descricao`: TextField
- `preco`: DecimalField
- `duracao`: IntegerField (em minutos)

### Agendamento
- `cliente_nome`: CharField(max_length=100)
- `cliente_telefone`: CharField(max_length=20)
- `servico`: ForeignKey(Servico)
- `data`: DateField
- `hora`: TimeField
- `status`: CharField (pendente/confirmado/concluido/cancelado)
- `observacoes`: TextField (blank)
- `created_at`: DateTimeField(auto_now_add)

## Implementado

- [x] (2026-05-24) Projeto Django estruturado (carflow + core app)
- [x] (2026-05-24) Models Produto, Servico, Agendamento com migrações
- [x] (2026-05-24) Django Admin configurado em português
- [x] (2026-05-24) Templates HTML responsivos com Tailwind CSS
- [x] (2026-05-24) 5 páginas HTML: Dashboard, Produtos, Serviços, Agendamentos, Cadastro
- [x] (2026-05-24) API REST completa via Django REST Framework
- [x] (2026-05-24) Endpoint /api/dashboard/stats/ para estatísticas
- [x] (2026-05-24) Banco populado com dados de exemplo (6 produtos, 6 serviços, 6 agendamentos)
- [x] (2026-05-24) CORS configurado
- [x] (2026-05-24) CSRF Trusted Origins configurado para preview environment
- [x] (2026-05-24) Static files coletados e servidos em /api/static/
- [x] (2026-05-24) Frontend React mantido e adaptado para consumir Django REST API
- [x] (2026-05-24) Superusuário admin criado (admin / admin123)

## Como Acessar

### Páginas Django HTML (Server-Side Rendered)
- Dashboard: `/api/app/`
- Produtos: `/api/app/produtos/`
- Serviços: `/api/app/servicos/`
- Agendamentos: `/api/app/agendamentos/`
- Cadastro: `/api/app/cadastro/`

### Django Admin
- URL: `/api/admin/`
- User: `admin` / Senha: `admin123`

### API REST
- `/api/produtos/` (GET, POST, PUT, DELETE)
- `/api/servicos/` (GET, POST, PUT, DELETE)
- `/api/agendamentos/` (GET, POST, PUT, DELETE)
- `/api/dashboard/stats/` (GET)

### Frontend React (alternativo)
- `/` (porta 3000) - consome a API Django

## Backlog (P1/P2)
- [ ] P1: Adicionar formulários CRUD nos templates HTML Django (sem precisar do admin)
- [ ] P2: Sistema de autenticação para clientes (login)
- [ ] P2: Notificações por email/SMS de agendamentos
- [ ] P2: Relatórios e gráficos (Chart.js)
- [ ] P2: Sistema de pagamentos
- [ ] P2: API de busca de produtos/serviços com filtros avançados

## Tech Stack
- **Backend**: Django 5.2, Django REST Framework 3.17, Python 3.11
- **Frontend (SSR)**: Django Templates + Tailwind CSS (CDN) + FontAwesome
- **Frontend (SPA)**: React 19 + Tailwind + Radix UI + lucide-react
- **Database**: SQLite
- **Server**: uvicorn + FastAPI WSGIMiddleware
