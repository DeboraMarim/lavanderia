import React from "react";
import { useNavigate } from "react-router-dom";
import "./LimpMais.css";

const LimpMais = () => {
  const navigate = useNavigate();

  return (
    <div className="limpmais-container">
      <h1>Escolha sua área de entrada</h1>
      <div className="cards-container">
        <div className="card-recepcao" onClick={() => navigate("/recepcao")}>
          Recepção
        </div>
        <div className="card-pda" onClick={() => navigate("/painel-pda")}>
          Painel PDA
        </div>
        <div className="card-administracao" onClick={() => navigate("/administracao")}>
          Administração
        </div>
      </div>
    </div>
  );
};

export default LimpMais;
