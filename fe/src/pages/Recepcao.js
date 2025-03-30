import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Precos from "../components/abaRecepcao/Precos.jsx";
import Pedidos from "../components/abaRecepcao/Pedidos.jsx";
import Clientes from "../components/abaRecepcao/Clientes.jsx";
import Inicio from "../components/abaRecepcao/Inicio.jsx";
import "./Recepcao.css";


const Recepcao = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("Preços");
  const navigate = useNavigate();

  const handleLogin = () => {
    const correctPassword = process.env.REACT_APP_RECEPCAO_PASSWORD;
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
      <div className="recepcao-container">
        <div className="recepcao-card">
          <h2>Área Restrita</h2>
          <p>Digite a senha para acessar</p>
          <input
            type="password"
            className="password-input"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="submit-btn-recep" onClick={handleLogin}>
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recepcao-page">
      <header className="recepcao-header">
        <img src="/logo.png" alt="Logo" className="recepcao-logo" />
        <div className="header-buttons">
          <button className="header-btn" onClick={handleGoToGeral}>
            Geral
          </button>
          <button className="header-btn logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>


      {/* Conteúdo das abas */}
      <nav className="admin-menu">
          <button
            className={`menu-btn ${activeTab === "inicio" ? "active" : ""}`}
            style={{ backgroundColor: "#75048a", color: "#fff" }}
            onClick={() => setActiveTab("inicio")}
          >
            Inicio
          </button>

          <button
            className={`menu-btn ${activeTab === "precos" ? "active" : ""}`}
            style={{ backgroundColor: "#faa105", color: "#fff" }}
            onClick={() => setActiveTab("precos")}
          >
            Preços
          </button>

          <button
            className={`menu-btn ${activeTab === "pedidos" ? "active" : ""}`}
            style={{ backgroundColor: "#2060de", color: "#fff" }}
            onClick={() => setActiveTab("pedidos")}
          >
            Pedidos
          </button>

          <button
            className={`menu-btn ${activeTab === "clientes" ? "active" : ""}`}
            style={{ backgroundColor: "#2ebe07", color: "#fff" }}
            onClick={() => setActiveTab("clientes")}
          >
            Clientes
          </button>



        </nav>
        <main className="admin-content">
          {activeTab === "inicio" && <Inicio />}
          {activeTab === "precos" && <Precos />}
          {activeTab === "pedidos" && <Pedidos />}
          {activeTab === "clientes" && <Clientes />}
        </main>
    </div>
  );
};

export default Recepcao;
