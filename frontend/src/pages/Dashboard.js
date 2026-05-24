import { useEffect, useState } from "react";
import { getDashboardStats, getAgendamentos } from "@/services/api";
import { Package, Wrench, Calendar, Clock } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_produtos: 0,
    total_servicos: 0,
    total_agendamentos: 0,
    agendamentos_pendentes: 0,
    agendamentos_hoje: 0,
  });
  const [recentAgendamentos, setRecentAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const statsData = await getDashboardStats();
      setStats(statsData);

      const agendamentosData = await getAgendamentos();
      // Pegar os 5 mais recentes
      const recent = agendamentosData
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentAgendamentos(recent);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    const colors = {
      pendente: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      confirmado: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      concluido: "bg-green-500/20 text-green-300 border-green-500/30",
      cancelado: "bg-red-500/20 text-red-300 border-red-500/30",
    };
    return colors[status] || colors.pendente;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="dashboard">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Visão geral do sistema CarFlow</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Produtos"
          value={stats.total_produtos}
          icon={Package}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total de Serviços"
          value={stats.total_servicos}
          icon={Wrench}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          title="Agendamentos Hoje"
          value={stats.agendamentos_hoje}
          icon={Calendar}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
        <StatCard
          title="Pendentes"
          value={stats.agendamentos_pendentes}
          icon={Clock}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
        />
      </div>

      {/* Recent Agendamentos */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Agendamentos Recentes</h2>
        
        {recentAgendamentos.length === 0 ? (
          <p className="text-slate-400 text-center py-8">Nenhum agendamento encontrado</p>
        ) : (
          <div className="space-y-3">
            {recentAgendamentos.map((agendamento) => (
              <div
                key={agendamento.id}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all"
              >
                <div className="flex-1">
                  <p className="text-white font-medium">{agendamento.cliente_nome}</p>
                  <p className="text-slate-400 text-sm">{agendamento.cliente_telefone}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">{agendamento.data}</p>
                    <p className="text-slate-400 text-sm">{agendamento.hora}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                      agendamento.status
                    )}`}
                  >
                    {agendamento.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
