import { useEffect, useState, useCallback } from "react";
import { getServicos, createServico, updateServico, deleteServico } from "@/services/api";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";
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

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServico, setEditingServico] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    duracao: "",
  });

  const loadServicos = useCallback(async () => {
    try {
      const data = await getServicos();
      setServicos(data);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServicos();
  }, [loadServicos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const servicoData = {
        ...formData,
        preco: parseFloat(formData.preco),
        duracao: parseInt(formData.duracao),
      };

      if (editingServico) {
        await updateServico(editingServico.id, servicoData);
      } else {
        await createServico(servicoData);
      }

      setIsDialogOpen(false);
      resetForm();
      loadServicos();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
    }
  };

  const handleEdit = (servico) => {
    setEditingServico(servico);
    setFormData({
      nome: servico.nome,
      descricao: servico.descricao,
      preco: servico.preco.toString(),
      duracao: servico.duracao.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      try {
        await deleteServico(id);
        loadServicos();
      } catch (error) {
        console.error("Erro ao excluir serviço:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      preco: "",
      duracao: "",
    });
    setEditingServico(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="servicos-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Serviços</h1>
          <p className="text-slate-400 mt-1">Gerencie os serviços oferecidos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              data-testid="add-servico-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>
                {editingServico ? "Editar Serviço" : "Novo Serviço"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                  data-testid="servico-nome-input"
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                  data-testid="servico-descricao-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="servico-preco-input"
                  />
                </div>
                <div>
                  <Label htmlFor="duracao">Duração (min)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    value={formData.duracao}
                    onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="servico-duracao-input"
                  />
                </div>
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
                  data-testid="servico-submit-button"
                >
                  {editingServico ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Servicos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicos.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
            <Wrench className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">Nenhum serviço cadastrado</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Serviço
            </Button>
          </div>
        ) : (
          servicos.map((servico) => (
            <div
              key={servico.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(servico)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    data-testid={`edit-servico-${servico.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(servico.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    data-testid={`delete-servico-${servico.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{servico.nome}</h3>
              <p className="text-slate-400 text-sm mb-4">{servico.descricao}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div>
                  <p className="text-2xl font-bold text-white">
                    R$ {servico.preco.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Duração</p>
                  <p className="text-white font-medium">{servico.duracao} min</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Servicos;
