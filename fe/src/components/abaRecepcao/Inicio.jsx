import React from "react";
import "./Inicio.css";

const Inicio = ({ setActiveTab }) => {
  return (
    <div className="inicio-container">
      <div className="card">
        <h2>Bem-vindo, Atendente!</h2>
        <p>{new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}</p>

        <div className="botoes">
          <button onClick={() => setActiveTab("pedidos")}>
            Serviços
          </button>
          <button onClick={() => setActiveTab("clientes")}>
            Clientes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
