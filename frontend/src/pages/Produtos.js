import { useEffect, useState, useCallback } from "react";
import { getProdutos, createProduto, updateProduto, deleteProduto } from "@/services/api";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
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

// Helper: retorna a classe CSS do badge de estoque
const getEstoqueBadgeClass = (estoque) => {
  if (estoque > 10) return "bg-green-500/20 text-green-300";
  if (estoque > 0) return "bg-yellow-500/20 text-yellow-300";
  return "bg-red-500/20 text-red-300";
};

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
  });

  const loadProdutos = useCallback(async () => {
    try {
      const data = await getProdutos();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProdutos();
  }, [loadProdutos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const produtoData = {
        ...formData,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque),
      };

      if (editingProduto) {
        await updateProduto(editingProduto.id, produtoData);
      } else {
        await createProduto(produtoData);
      }

      setIsDialogOpen(false);
      resetForm();
      loadProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  const handleEdit = (produto) => {
    setEditingProduto(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      estoque: produto.estoque.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduto(id);
        loadProdutos();
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      preco: "",
      estoque: "",
    });
    setEditingProduto(null);
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
    <div className="space-y-6" data-testid="produtos-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Produtos</h1>
          <p className="text-slate-400 mt-1">Gerencie o estoque de produtos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              data-testid="add-produto-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>
                {editingProduto ? "Editar Produto" : "Novo Produto"}
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
                  data-testid="produto-nome-input"
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
                  data-testid="produto-descricao-input"
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
                    data-testid="produto-preco-input"
                  />
                </div>
                <div>
                  <Label htmlFor="estoque">Estoque</Label>
                  <Input
                    id="estoque"
                    type="number"
                    value={formData.estoque}
                    onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="produto-estoque-input"
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
                  data-testid="produto-submit-button"
                >
                  {editingProduto ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Produtos List */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
        {produtos.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">Nenhum produto cadastrado</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Produto
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {produtos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{produto.nome}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300">{produto.descricao}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        R$ {produto.preco.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstoqueBadgeClass(produto.estoque)}`}
                      >
                        {produto.estoque}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(produto)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          data-testid={`edit-produto-${produto.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(produto.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          data-testid={`delete-produto-${produto.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Produtos;
