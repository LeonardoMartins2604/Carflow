import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAgendamento, getServicos } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Calendar, User } from "lucide-react";

const Cadastro = () => {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cliente_nome: "",
    cliente_telefone: "",
    servico_id: "",
    data: "",
    hora: "",
    observacoes: "",
  });

  useEffect(() => {
    loadServicos();
  }, []);

  const loadServicos = async () => {
    try {
      const data = await getServicos();
      setServicos(data);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAgendamento(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/agendamentos");
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      alert("Erro ao criar agendamento. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getServicoDetalhes = () => {
    if (!formData.servico_id) return null;
    return servicos.find((s) => s.id === formData.servico_id);
  };

  const servicoSelecionado = getServicoDetalhes();

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-white mb-2">Agendamento Criado!</h2>
          <p className="text-slate-400">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-testid="cadastro-page">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Novo Agendamento</h1>
        <p className="text-slate-400 mt-2">
          Preencha os dados abaixo para agendar um serviço
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Cliente */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-white">Dados do Cliente</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cliente_nome">Nome Completo</Label>
                <Input
                  id="cliente_nome"
                  value={formData.cliente_nome}
                  onChange={(e) =>
                    setFormData({ ...formData, cliente_nome: e.target.value })
                  }
                  required
                  placeholder="Digite seu nome"
                  className="bg-slate-700 border-slate-600 text-white"
                  data-testid="cadastro-nome-input"
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
                  placeholder="(00) 00000-0000"
                  className="bg-slate-700 border-slate-600 text-white"
                  data-testid="cadastro-telefone-input"
                />
              </div>
            </div>
          </div>

          {/* Serviço e Agendamento */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-white">Serviço e Data</h2>
            </div>

            <div>
              <Label htmlFor="servico_id">Selecione o Serviço</Label>
              <Select
                value={formData.servico_id}
                onValueChange={(value) => setFormData({ ...formData, servico_id: value })}
                required
              >
                <SelectTrigger
                  className="bg-slate-700 border-slate-600 text-white"
                  data-testid="cadastro-servico-select"
                >
                  <SelectValue placeholder="Escolha um serviço" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  {servicos.map((servico) => (
                    <SelectItem key={servico.id} value={servico.id}>
                      {servico.nome} - R$ {servico.preco.toFixed(2)} ({servico.duracao} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {servicoSelecionado && (
              <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <h3 className="font-semibold text-white mb-2">{servicoSelecionado.nome}</h3>
                <p className="text-sm text-slate-400 mb-3">{servicoSelecionado.descricao}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    Duração: <span className="text-white font-medium">{servicoSelecionado.duracao} minutos</span>
                  </span>
                  <span className="text-2xl font-bold text-orange-500">
                    R$ {servicoSelecionado.preco.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data">Data do Agendamento</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="bg-slate-700 border-slate-600 text-white"
                  data-testid="cadastro-data-input"
                />
              </div>
              <div>
                <Label htmlFor="hora">Horário</Label>
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                  data-testid="cadastro-hora-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Input
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Informações adicionais sobre o agendamento"
                className="bg-slate-700 border-slate-600 text-white"
                data-testid="cadastro-observacoes-input"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              data-testid="cadastro-submit-button"
            >
              {loading ? "Agendando..." : "Confirmar Agendamento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
