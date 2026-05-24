import { useEffect, useState } from "react";
import {
  getAgendamentos,
  createAgendamento,
  updateAgendamento,
  deleteAgendamento,
  getServicos,
} from "@/services/api";
import { Plus, Pencil, Trash2, Calendar as CalendarIcon, Clock, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgendamento, setEditingAgendamento] = useState(null);
  const [formData, setFormData] = useState({
    cliente_nome: "",
    cliente_telefone: "",
    servico_id: "",
    data: "",
    hora: "",
    observacoes: "",
    status: "pendente",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [agendamentosData, servicosData] = await Promise.all([
        getAgendamentos(),
        getServicos(),
      ]);
      setAgendamentos(agendamentosData);
      setServicos(servicosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAgendamento) {
        await updateAgendamento(editingAgendamento.id, formData);
      } else {
        await createAgendamento(formData);
      }

      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      alert("Erro ao salvar agendamento. Verifique os dados e tente novamente.");
    }
  };

  const handleEdit = (agendamento) => {
    setEditingAgendamento(agendamento);
    setFormData({
      cliente_nome: agendamento.cliente_nome,
      cliente_telefone: agendamento.cliente_telefone,
      servico_id: agendamento.servico_id,
      data: agendamento.data,
      hora: agendamento.hora,
      observacoes: agendamento.observacoes || "",
      status: agendamento.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      try {
        await deleteAgendamento(id);
        loadData();
      } catch (error) {
        console.error("Erro ao excluir agendamento:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      cliente_nome: "",
      cliente_telefone: "",
      servico_id: "",
      data: "",
      hora: "",
      observacoes: "",
      status: "pendente",
    });
    setEditingAgendamento(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const getStatusBadge = (status) => {
    const colors = {
      pendente: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      confirmado: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      concluido: "bg-green-500/20 text-green-300 border-green-500/30",
      cancelado: "bg-red-500/20 text-red-300 border-red-500/30",
    };
    return colors[status] || colors.pendente;
  };

  const getServicoNome = (servicoId) => {
    const servico = servicos.find((s) => s.id === servicoId);
    return servico ? servico.nome : "Serviço não encontrado";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="agendamentos-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Agendamentos</h1>
          <p className="text-slate-400 mt-1">Gerencie os agendamentos de serviços</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              data-testid="add-agendamento-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAgendamento ? "Editar Agendamento" : "Novo Agendamento"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cliente_nome">Nome do Cliente</Label>
                  <Input
                    id="cliente_nome"
                    value={formData.cliente_nome}
                    onChange={(e) =>
                      setFormData({ ...formData, cliente_nome: e.target.value })
                    }
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="agendamento-cliente-nome-input"
                  />
                </div>
                <div>
                  <Label htmlFor="cliente_telefone">Telefone</Label>
                  <Input
                    id="cliente_telefone"
                    value={formData.cliente_telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, cliente_telefone: e.target.value })
                    }
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="agendamento-telefone-input"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="servico_id">Serviço</Label>
                <Select
                  value={formData.servico_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, servico_id: value })
                  }
                  required
                >
                  <SelectTrigger
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="agendamento-servico-select"
                  >
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    {servicos.map((servico) => (
                      <SelectItem key={servico.id} value={servico.id}>
                        {servico.nome} - R$ {servico.preco.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="agendamento-data-input"
                  />
                </div>
                <div>
                  <Label htmlFor="hora">Hora</Label>
                  <Input
                    id="hora"
                    type="time"
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="agendamento-hora-input"
                  />
                </div>
              </div>

              {editingAgendamento && (
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger
                      className="bg-slate-700 border-slate-600 text-white"
                      data-testid="agendamento-status-select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600 text-white">
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData({ ...formData, observacoes: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  data-testid="agendamento-observacoes-input"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  data-testid="agendamento-submit-button"
                >
                  {editingAgendamento ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Agendamentos List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agendamentos.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
            <CalendarIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">Nenhum agendamento cadastrado</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Agendamento
            </Button>
          </div>
        ) : (
          agendamentos.map((agendamento) => (
            <div
              key={agendamento.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {agendamento.cliente_nome}
                  </h3>
                  <p className="text-slate-400 text-sm">{agendamento.cliente_telefone}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                    agendamento.status
                  )}`}
                >
                  {agendamento.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Wrench className="w-4 h-4 text-slate-500" />
                  <span>{getServicoNome(agendamento.servico_id)}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <CalendarIcon className="w-4 h-4 text-slate-500" />
                  <span>{agendamento.data}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>{agendamento.hora}</span>
                </div>
                {agendamento.observacoes && (
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <p className="text-sm text-slate-400">{agendamento.observacoes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-700/50">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(agendamento)}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                  data-testid={`edit-agendamento-${agendamento.id}`}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(agendamento.id)}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  data-testid={`delete-agendamento-${agendamento.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Agendamentos;
