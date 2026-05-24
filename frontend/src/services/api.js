import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ========== PRODUTOS ==========
export const getProdutos = async () => {
  const response = await axios.get(`${API}/produtos`);
  return response.data;
};

export const createProduto = async (produto) => {
  const response = await axios.post(`${API}/produtos`, produto);
  return response.data;
};

export const updateProduto = async (id, produto) => {
  const response = await axios.put(`${API}/produtos/${id}`, produto);
  return response.data;
};

export const deleteProduto = async (id) => {
  const response = await axios.delete(`${API}/produtos/${id}`);
  return response.data;
};

// ========== SERVICOS ==========
export const getServicos = async () => {
  const response = await axios.get(`${API}/servicos`);
  return response.data;
};

export const createServico = async (servico) => {
  const response = await axios.post(`${API}/servicos`, servico);
  return response.data;
};

export const updateServico = async (id, servico) => {
  const response = await axios.put(`${API}/servicos/${id}`, servico);
  return response.data;
};

export const deleteServico = async (id) => {
  const response = await axios.delete(`${API}/servicos/${id}`);
  return response.data;
};

// ========== AGENDAMENTOS ==========
export const getAgendamentos = async () => {
  const response = await axios.get(`${API}/agendamentos`);
  return response.data;
};

export const createAgendamento = async (agendamento) => {
  const response = await axios.post(`${API}/agendamentos`, agendamento);
  return response.data;
};

export const updateAgendamento = async (id, agendamento) => {
  const response = await axios.put(`${API}/agendamentos/${id}`, agendamento);
  return response.data;
};

export const deleteAgendamento = async (id) => {
  const response = await axios.delete(`${API}/agendamentos/${id}`);
  return response.data;
};

// ========== DASHBOARD ==========
export const getDashboardStats = async () => {
  const response = await axios.get(`${API}/dashboard/stats`);
  return response.data;
};
