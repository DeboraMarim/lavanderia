import React from "react";
import { useNavigate } from "react-router-dom"; 

const PainelPDA = () => {
  const navigate = useNavigate(); // Inicializando o hook
  const handleLogout = () => {
    navigate("/"); 
  };

  const handleGoToGeral = () => {
    navigate("/limpmais"); // Redireciona para a página Geral (/limpmais)
  };


  return (
    <div>
            <header className="admin-header">
        <img src="/logo.png" alt="Logo" className="admin-logo" />
        <div className="header-buttons">
          <button className="header-btn" onClick={handleGoToGeral}>
            Geral
          </button>
          <button className="header-btn logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>
      <h1>Painel PDA</h1>
      <p>Bem-vindo ao Painel PDA.</p>
    </div>
  );
};

export default PainelPDA;
