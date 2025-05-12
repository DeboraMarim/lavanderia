import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Administracao.css";
// import logo from "../../public/logo.png";

import Clientes from "../components/abaAdm/Clientes.jsx";
import Servicos from "../components/abaAdm/Servicos.jsx";
import Pedidos from "../components/abaAdm/Pedidos.jsx";
import Relatorios from "../components/abaAdm/Relatorios.jsx";
import Configuracoes from "../components/abaAdm/Configuracoes.jsx";



const Administracao = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("clientes"); 
  const navigate = useNavigate();

  const handleLogin = () => {
    const correctPassword = process.env.REACT_APP_ADMIN_PASSWORD;
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Senha incorreta!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    navigate("/");
  };

  const handleGoToGeral = () => {
    navigate("/limpmais"); 
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="admin-card">
          <h2>Área Restrita</h2>
          <p>Digite a senha para acessar</p>
          <input
            type="password"
            className="password-input"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="submit-btn" onClick={handleLogin}>
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
      <img src="../../public/logo.png" alt="Logo" className="admin-logo" />
      <div className="header-buttons">
          <button className="header-btn" onClick={handleGoToGeral}>
            Geral
          </button>
          <button className="header-btn logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      {/* Menu lateral */}
        <nav className="admin-menu">
          <button
            className={`menu-btn ${activeTab === "clientes" ? "active" : ""}`}
            style={{ backgroundColor: "#75048a", color: "#fff" }}
            onClick={() => setActiveTab("clientes")}
          >
            Clientes
          </button>

          <button
            className={`menu-btn ${activeTab === "servicos" ? "active" : ""}`}
            style={{ backgroundColor: "#faa105", color: "#fff" }}
            onClick={() => setActiveTab("servicos")}
          >
            Serviços
          </button>

          <button
            className={`menu-btn ${activeTab === "pedidos" ? "active" : ""}`}
            style={{ backgroundColor: "#2060de", color: "#fff" }}
            onClick={() => setActiveTab("pedidos")}
          >
            Pedidos
          </button>

          <button
            className={`menu-btn ${activeTab === "relatorios" ? "active" : ""}`}
            style={{ backgroundColor: "#2ebe07", color: "#fff" }}
            onClick={() => setActiveTab("relatorios")}
          >
            Relatórios
          </button>

          {/* <button
            className={`menu-btn ${activeTab === "configuracoes" ? "active" : ""}`}
            style={{ backgroundColor: "#ec1034", color: "#fff" }}
            onClick={() => setActiveTab("configuracoes")}
          >
            Configurações
          </button> */}
        </nav>

        {/* Conteúdo das abas */}
        <main className="admin-content">
          {activeTab === "clientes" && <Clientes />}
          {activeTab === "servicos" && <Servicos />}
          {activeTab === "pedidos" && <Pedidos />}
          {activeTab === "relatorios" && <Relatorios />}
          {activeTab === "configuracoes" && <Configuracoes />}
        </main>
      </div>
  );
};



export default Administracao;
