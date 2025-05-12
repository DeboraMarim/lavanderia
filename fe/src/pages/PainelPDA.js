import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import visualizarPDF from "../utils/visualizarPDF";

import "./PainelPDA.css";

const PainelPDA = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/ordens`);
        setPedidos(response.data);
      } catch (error) {
        console.error("Erro ao carregar pedidos", error);
      }
    };
    fetchPedidos();
  }, []);

  const handleLogout = () => {
    navigate("/"); 
  };

  const handleGoToGeral = () => {
    navigate("/limpmais"); 
  };

  const pedidosPendentes = pedidos.filter((pedido) => pedido.status === "Pendente");
  const pedidosEmAndamento = pedidos.filter((pedido) => pedido.status === "Em andamento");

  // Função para atualizar o status do pedido
  const handleStatusChange = async (pedidoId, novoStatus) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/ordens/${pedidoId}`, { status: novoStatus });
      setPedidos((prevPedidos) => 
        prevPedidos.map((pedido) =>
          pedido._id === pedidoId ? { ...pedido, status: novoStatus } : pedido
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar o status do pedido", error);
    }
  };

  // Função para visualizar os detalhes do pedido
  const handleVisualizar = (pedido) => {
    localStorage.setItem("numeroOrdem", pedido.numero);
    visualizarPDF(pedido, pedido.numero);
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
      
      <h1>Gerenciamento de Pedidos</h1>
      
      <div className="pedidos-container">
        <div className="pedidos-col">
          <h2>Pendentes</h2>
          <div className="card-container">
            {pedidosPendentes.map((pedido) => (
              <div className="pedido-card" key={pedido._id}>
                <h3>Pedido {pedido.numero}</h3>
                <p>Cliente: {pedido.cliente?.nome || 'Não informado'}</p>
                <p>Status: {pedido.status}</p>
                
                {/* Seletor de status */}
                <select
                  value={pedido.status}
                  onChange={(e) => handleStatusChange(pedido._id, e.target.value)}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Finalizado">Finalizado</option>
                </select>

                <button onClick={() => handleVisualizar(pedido)} className="card-btn">
                  Visualizar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pedidos-col">
          <h2>Em Andamento</h2>
          <div className="card-container">
            {pedidosEmAndamento.map((pedido) => (
              <div className="pedido-card" key={pedido._id}>
                <h3>Pedido {pedido.numero}</h3>
                <p>Cliente: {pedido.cliente?.nome || "Não informado"}</p>
                <p>Status: {pedido.status}</p>
                
                {/* Seletor de status */}
                <select
                  value={pedido.status}
                  onChange={(e) => handleStatusChange(pedido._id, e.target.value)}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Finalizado">Finalizado</option>
                </select>

                <button onClick={() => handleVisualizar(pedido)} className="card-btn">
                  Visualizar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainelPDA;
