import React, { useState, useEffect } from "react";
import axios from "axios";
import gerarPDF from "../../utils/gerarPDF";
import visualizarPDF from "../../utils/visualizarPDF";
import "./Pedidos.css";

const PedidosContent = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filtroBusca, setFiltroBusca] = useState("");

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

  const alterarStatus = async (id, novoStatus) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/ordens/${id}`, { status: novoStatus });
      setPedidos((prevPedidos) => prevPedidos.map((pedido) =>
        pedido._id === id ? { ...pedido, status: novoStatus } : pedido
      ));
    } catch (error) {
      console.error("Erro ao atualizar status do pedido", error);
    }
  };

  const alterarStatusPagamento = async (id, novoStatus) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/ordens/${id}`, { statusPagamento: novoStatus });
      setPedidos((prevPedidos) => prevPedidos.map((pedido) =>
        pedido._id === id ? { ...pedido, statusPagamento: novoStatus } : pedido
      ));
    } catch (error) {
      console.error("Erro ao atualizar status de pagamento", error);
    }
  };

  const pedidosFiltrados = pedidos.filter(
    (pedido) => pedido.cliente?.nome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
                pedido.cliente?.cpfCnpj.includes(filtroBusca)
  );

  return (
    <div>
      <h2>Pedidos</h2>
      <div className="filtro-busca">

      <input
        type="text"
        placeholder="Buscar por nome ou CPF/CNPJ"
        value={filtroBusca}
        onChange={(e) => setFiltroBusca(e.target.value)}
      />
      </div>
      <div>
        {['Pendente', 'Em andamento', 'Finalizado'].map((status) => (
          <div key={status}>
            <h3>{status}</h3>
            <table>
              <thead>
                <tr className="tabela">
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>CPF/CNPJ</th>
                  <th>Pagamento</th>
                  <th>Status</th>
                  <th>Ações</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.filter(pedido => pedido.status === status).map((pedido) => (
                  <tr key={pedido._id}>
                    <td>{pedido.numero}</td>
                    <td>{pedido.cliente?.nome || 'Não informado'}</td>
                    <td>{pedido.cliente?.cpfCnpj}</td>
                    <td>
                      <select
                        value={pedido.statusPagamento}
                        onChange={(e) => alterarStatusPagamento(pedido._id, e.target.value)}
                      >
                        <option value="pendente">Pendente</option>
                        <option value="pago">Pago</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={pedido.status}
                        onChange={(e) => alterarStatus(pedido._id, e.target.value)}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Finalizado">Finalizado</option>
                      </select>
                    </td>
                    <td>
                    <button onClick={() => gerarPDF(pedido, pedido.numero)}>Imprimir</button>

                    </td>
                    <td>
                    <button onClick={() => visualizarPDF(pedido, pedido.numero)}>Visualizar</button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PedidosContent;