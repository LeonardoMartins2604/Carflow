from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, date, time, timezone
from decimal import Decimal


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ========== MODELS ==========

# Produto Models
class ProdutoBase(BaseModel):
    nome: str
    descricao: str
    preco: float
    estoque: int

class ProdutoCreate(ProdutoBase):
    pass

class Produto(ProdutoBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    preco: Optional[float] = None
    estoque: Optional[int] = None


# Servico Models
class ServicoBase(BaseModel):
    nome: str
    descricao: str
    preco: float
    duracao: int  # em minutos

class ServicoCreate(ServicoBase):
    pass

class Servico(ServicoBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

class ServicoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    preco: Optional[float] = None
    duracao: Optional[int] = None


# Agendamento Models
class AgendamentoBase(BaseModel):
    cliente_nome: str
    cliente_telefone: str
    servico_id: str
    data: str  # formato YYYY-MM-DD
    hora: str  # formato HH:MM
    observacoes: Optional[str] = ""

class AgendamentoCreate(AgendamentoBase):
    pass

class Agendamento(AgendamentoBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "pendente"  # pendente, confirmado, concluido, cancelado
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AgendamentoUpdate(BaseModel):
    cliente_nome: Optional[str] = None
    cliente_telefone: Optional[str] = None
    servico_id: Optional[str] = None
    data: Optional[str] = None
    hora: Optional[str] = None
    status: Optional[str] = None
    observacoes: Optional[str] = None


# Dashboard Stats Model
class DashboardStats(BaseModel):
    total_produtos: int
    total_servicos: int
    total_agendamentos: int
    agendamentos_pendentes: int
    agendamentos_hoje: int


# ========== PRODUTOS ENDPOINTS ==========

@api_router.get("/produtos", response_model=List[Produto])
async def get_produtos():
    """Listar todos os produtos"""
    produtos = await db.produtos.find({}, {"_id": 0}).to_list(1000)
    return produtos

@api_router.post("/produtos", response_model=Produto)
async def create_produto(produto: ProdutoCreate):
    """Criar novo produto"""
    produto_obj = Produto(**produto.model_dump())
    doc = produto_obj.model_dump()
    await db.produtos.insert_one(doc)
    return produto_obj

@api_router.get("/produtos/{produto_id}", response_model=Produto)
async def get_produto(produto_id: str):
    """Obter produto por ID"""
    produto = await db.produtos.find_one({"id": produto_id}, {"_id": 0})
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto

@api_router.put("/produtos/{produto_id}", response_model=Produto)
async def update_produto(produto_id: str, produto_update: ProdutoUpdate):
    """Atualizar produto"""
    update_data = {k: v for k, v in produto_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar")
    
    result = await db.produtos.update_one(
        {"id": produto_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    produto = await db.produtos.find_one({"id": produto_id}, {"_id": 0})
    return produto

@api_router.delete("/produtos/{produto_id}")
async def delete_produto(produto_id: str):
    """Deletar produto"""
    result = await db.produtos.delete_one({"id": produto_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    return {"message": "Produto deletado com sucesso"}


# ========== SERVICOS ENDPOINTS ==========

@api_router.get("/servicos", response_model=List[Servico])
async def get_servicos():
    """Listar todos os serviços"""
    servicos = await db.servicos.find({}, {"_id": 0}).to_list(1000)
    return servicos

@api_router.post("/servicos", response_model=Servico)
async def create_servico(servico: ServicoCreate):
    """Criar novo serviço"""
    servico_obj = Servico(**servico.model_dump())
    doc = servico_obj.model_dump()
    await db.servicos.insert_one(doc)
    return servico_obj

@api_router.get("/servicos/{servico_id}", response_model=Servico)
async def get_servico(servico_id: str):
    """Obter serviço por ID"""
    servico = await db.servicos.find_one({"id": servico_id}, {"_id": 0})
    if not servico:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    return servico

@api_router.put("/servicos/{servico_id}", response_model=Servico)
async def update_servico(servico_id: str, servico_update: ServicoUpdate):
    """Atualizar serviço"""
    update_data = {k: v for k, v in servico_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar")
    
    result = await db.servicos.update_one(
        {"id": servico_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    
    servico = await db.servicos.find_one({"id": servico_id}, {"_id": 0})
    return servico

@api_router.delete("/servicos/{servico_id}")
async def delete_servico(servico_id: str):
    """Deletar serviço"""
    result = await db.servicos.delete_one({"id": servico_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    
    return {"message": "Serviço deletado com sucesso"}


# ========== AGENDAMENTOS ENDPOINTS ==========

@api_router.get("/agendamentos", response_model=List[Agendamento])
async def get_agendamentos():
    """Listar todos os agendamentos"""
    agendamentos = await db.agendamentos.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for agendamento in agendamentos:
        if isinstance(agendamento.get('created_at'), str):
            agendamento['created_at'] = datetime.fromisoformat(agendamento['created_at'])
    
    return agendamentos

@api_router.post("/agendamentos", response_model=Agendamento)
async def create_agendamento(agendamento: AgendamentoCreate):
    """Criar novo agendamento"""
    # Verificar se o serviço existe
    servico = await db.servicos.find_one({"id": agendamento.servico_id})
    if not servico:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    
    agendamento_obj = Agendamento(**agendamento.model_dump())
    doc = agendamento_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.agendamentos.insert_one(doc)
    return agendamento_obj

@api_router.get("/agendamentos/{agendamento_id}", response_model=Agendamento)
async def get_agendamento(agendamento_id: str):
    """Obter agendamento por ID"""
    agendamento = await db.agendamentos.find_one({"id": agendamento_id}, {"_id": 0})
    if not agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    
    if isinstance(agendamento.get('created_at'), str):
        agendamento['created_at'] = datetime.fromisoformat(agendamento['created_at'])
    
    return agendamento

@api_router.put("/agendamentos/{agendamento_id}", response_model=Agendamento)
async def update_agendamento(agendamento_id: str, agendamento_update: AgendamentoUpdate):
    """Atualizar agendamento"""
    update_data = {k: v for k, v in agendamento_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar")
    
    # Se está atualizando servico_id, verificar se existe
    if "servico_id" in update_data:
        servico = await db.servicos.find_one({"id": update_data["servico_id"]})
        if not servico:
            raise HTTPException(status_code=404, detail="Serviço não encontrado")
    
    result = await db.agendamentos.update_one(
        {"id": agendamento_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    
    agendamento = await db.agendamentos.find_one({"id": agendamento_id}, {"_id": 0})
    
    if isinstance(agendamento.get('created_at'), str):
        agendamento['created_at'] = datetime.fromisoformat(agendamento['created_at'])
    
    return agendamento

@api_router.delete("/agendamentos/{agendamento_id}")
async def delete_agendamento(agendamento_id: str):
    """Deletar agendamento"""
    result = await db.agendamentos.delete_one({"id": agendamento_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    
    return {"message": "Agendamento deletado com sucesso"}


# ========== DASHBOARD ENDPOINT ==========

@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Obter estatísticas do dashboard"""
    total_produtos = await db.produtos.count_documents({})
    total_servicos = await db.servicos.count_documents({})
    total_agendamentos = await db.agendamentos.count_documents({})
    agendamentos_pendentes = await db.agendamentos.count_documents({"status": "pendente"})
    
    # Agendamentos de hoje
    hoje = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    agendamentos_hoje = await db.agendamentos.count_documents({"data": hoje})
    
    return DashboardStats(
        total_produtos=total_produtos,
        total_servicos=total_servicos,
        total_agendamentos=total_agendamentos,
        agendamentos_pendentes=agendamentos_pendentes,
        agendamentos_hoje=agendamentos_hoje
    )


# ========== ROOT ENDPOINT ==========

@api_router.get("/")
async def root():
    return {"message": "CarFlow API - Sistema de Gerenciamento Automotivo"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
