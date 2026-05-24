import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Produtos from "@/pages/Produtos";
import Servicos from "@/pages/Servicos";
import Agendamentos from "@/pages/Agendamentos";
import Cadastro from "@/pages/Cadastro";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="produtos" element={<Produtos />} />
            <Route path="servicos" element={<Servicos />} />
            <Route path="agendamentos" element={<Agendamentos />} />
            <Route path="cadastro" element={<Cadastro />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
