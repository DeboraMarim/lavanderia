import React, { useState } from "react";
import NovaOrdem from "./NovaOrdem";
import PedidosContent from "./PedidosContent";
import OrcamentoContent from "./OrcamentoContent";
import "./Pedidos.css";

const Pedidos = () => {
  const [conteudoAtual, setConteudoAtual] = useState("pedidos");

  const handleNovaOrdem = () => setConteudoAtual("novaOrdem");
  const handlePedidos = () => setConteudoAtual("pedidos");
  const handleOrcamento = () => setConteudoAtual("orcamento");

  return (
    <div className="pedido-container">
      {/* Botões no topo */}
      <div className="botao-container">
        <button className="botao" onClick={handleNovaOrdem}>
          Nova Ordem
        </button>
        <button className="botao" onClick={handlePedidos}>
          Pedidos
        </button>
        <button className="botao" onClick={handleOrcamento}>
          Orçamento
        </button>
      </div>

      {/* Conteúdo dinâmico baseado no botão clicado */}
      {conteudoAtual === "novaOrdem" && <NovaOrdem />}
      {conteudoAtual === "pedidos" && <PedidosContent />}
      {conteudoAtual === "orcamento" && <OrcamentoContent />}
    </div>
  );
};

export default Pedidos;
