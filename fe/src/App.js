import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LimpMais from "./pages/LimpMais.js"; // Criar essa página
import Recepcao from "./pages/Recepcao.js";
import PainelPDA from "./pages/PainelPDA.js";
import Administracao from "./pages/Administracao.js";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/limpmais" element={<LimpMais />} />
        <Route path="/recepcao" element={<Recepcao />} />
        <Route path="/painel-pda" element={<PainelPDA />} />
        <Route path="/administracao" element={<Administracao />} />
      </Routes>
    </Router>
  );
}

export default App;
