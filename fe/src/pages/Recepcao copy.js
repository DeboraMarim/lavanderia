import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook para navegação
import "./Recepcao.css";

const Recepcao = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
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
    setPassword(""); // Reseta a senha ao sair
    navigate("/"); // Redireciona para a página inicial
  };

  const handleGoToGeral = () => {
    navigate("/limpmais"); // Redireciona para a página Geral (/limpmais)
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
      {/* Header */}
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

      {/* Conteúdo da página */}
      <div className="recepcao-content">
        <h1>Recepção</h1>
        <p>Bem-vindo à página de recepção.</p>
      </div>
    </div>
  );
};

export default Recepcao;
