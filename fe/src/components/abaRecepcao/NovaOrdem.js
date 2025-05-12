import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Pedidos.css";
import Swal from "sweetalert2";
import gerarPDF from "../../utils/gerarPDF";

const NovaOrdem = () => {
  const [tipoPedido, setTipoPedido] = useState("presencial");
  const [endereco, setEndereco] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("dinheiro");
  const [statusPagamento, setStatusPagamento] = useState("pendente");
  const [itens, setItens] = useState([]);
  const [filtroBusca, setFiltroBusca] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [filtroCliente, setFiltroCliente] = useState("");
  const [quantidades, setQuantidades] = useState({}); // Para armazenar a quantidade de cada item
  const [peso, setPeso] = useState(""); // Para armazenar peso temporário

  // Carregar categorias, serviços e clientes do backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriaResponse = await axios.get(`${process.env.REACT_APP_API_URL}/categorias`);
        const servicoResponse = await axios.get(`${process.env.REACT_APP_API_URL}/servicos`);
        const clienteResponse = await axios.get(`${process.env.REACT_APP_API_URL}/clientes`);
        
        console.log("Categorias:", categoriaResponse.data);
        console.log("Serviços:", servicoResponse.data);
        console.log("Clientes:", clienteResponse.data);

        setCategorias(categoriaResponse.data);
        setServicos(servicoResponse.data);
        setClientes(clienteResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };
    fetchData();
  }, []);

  const handleQuantidadeChange = (servicoId, value) => {
    setQuantidades((prevQuantidades) => ({
      ...prevQuantidades,
      [servicoId]: value,
    }));
  };

  const handleAdicionarItem = (item) => {
    const quantidadeNumerica = parseInt(quantidades[item._id] || 1, 10); // Se não houver quantidade, coloca 1
    const pesoNumerico = parseFloat(peso);

    if (quantidadeNumerica > 0 || pesoNumerico > 0) {
      setItens([
        ...itens,
        {
          ...item,
          quantidade: quantidadeNumerica > 0 ? quantidadeNumerica : pesoNumerico, // Prioriza quantidade
          tipo: quantidadeNumerica > 0 ? "peça" : "peso", // Definir tipo com base na entrada
          valorTotal: item.preco * (quantidadeNumerica > 0 ? quantidadeNumerica : pesoNumerico)
        }
      ]);
      setQuantidades((prevQuantidades) => ({
        ...prevQuantidades,
        [item._id]: "", // Limpar quantidade após adicionar
      }));
      setPeso(""); // Limpar peso após adicionar
    } else {
      console.warn("Quantidade ou peso inválido");
    }
  };

  const handleExcluirItem = (index) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  };

  const servicosFiltrados = servicos.filter((servico) => {
    const nomeValido = servico.nome ? servico.nome.toLowerCase() : "";
    const categoriaValida = servico.categoriaId ? servico.categoriaId.nome.toLowerCase() : "";
    return nomeValido.includes(filtroBusca.toLowerCase()) || categoriaValida.includes(filtroBusca.toLowerCase());
  });

  // Filtrar clientes pela busca
  const clientesFiltrados = clientes.filter((cliente) => {
    const nomeValido = cliente.nome ? cliente.nome.toLowerCase() : "";
    const cpfCnpjValido = cliente.cpfCnpj ? cliente.cpfCnpj.toLowerCase() : "";
    return nomeValido.includes(filtroCliente.toLowerCase()) || cpfCnpjValido.includes(filtroCliente.toLowerCase());
  });

  const handleClienteSelecionado = (cliente) => {
    setClienteSelecionado(cliente);
    setEndereco(cliente.endereco); // Preencher o endereço no formulário
    setModalAberto(false); // Fechar o modal
  };

  // Calcular valor total do pedido
  const calcularValorTotal = () => {
    return itens.reduce((total, item) => total + item.valorTotal, 0).toFixed(2);
  };

  const handleFinalizarPedido = async () => {
    if (!clienteSelecionado) {
      return Swal.fire("Erro", "Selecione um cliente antes de finalizar o pedido.", "error");
    }
    if (itens.length === 0) {
      return Swal.fire("Erro", "Adicione ao menos um item ao pedido.", "error");
    }
  
    try {
      const ordem = {
        clienteId: clienteSelecionado._id, // Enviar apenas o ID, o backend associa os dados
        itens: itens.map(item => ({
          servicoId: item._id, // Enviar apenas o ID do serviço
          quantidade: item.quantidade,
          valorUnitario: item.preco,
          valorTotal: item.valorTotal
        })),
        tipoPedido,
        enderecoEntrega: tipoPedido === "busca" ? endereco : null,
        metodoPagamento,
        statusPagamento
      };
  
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/ordens`, ordem);
      console.log("Ordem de Serviço criada:", response.data);
  
      const numeroOrdem = response.data.numero; // Pegar o número correto do backend
  
      // 🔹 Salvar o número correto da ordem no localStorage
      localStorage.setItem("numeroOrdem", numeroOrdem);
  
      Swal.fire({
        title: "Pedido Finalizado!",
        text: "Deseja imprimir a Ordem de Serviço?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Sim, imprimir",
        cancelButtonText: "Não, obrigado",
      }).then((result) => {
        if (result.isConfirmed) {
          gerarPDF(response.data, numeroOrdem); // Enviar a ordem completa e o número correto
        }
      });
  
    } catch (error) {
      Swal.fire("Erro", "Erro ao finalizar pedido.", "error");
      console.error("Erro ao finalizar pedido:", error);
    }
  };
  
  
  
  
  return (
    <div >
      <div className="formulario-topo">
        <h2>Ordem de Serviço</h2>

        {/* Botão para selecionar o cliente */}
        <label>Cliente</label>
        <button onClick={() => setModalAberto(true)}>Selecionar Cliente</button>
        {clienteSelecionado && (
          <div>
            <p><strong>Nome:</strong> {clienteSelecionado.nome}</p>
            <p><strong>CPF/CNPJ:</strong> {clienteSelecionado.cpfCnpj}</p>
            <p><strong>Telefone:</strong> {clienteSelecionado.telefone}</p>
            <p><strong>Endereço:</strong> {`${clienteSelecionado.endereco.rua}, ${clienteSelecionado.endereco.numero}, ${clienteSelecionado.endereco.bairro}, ${clienteSelecionado.endereco.cidade}`}</p>
          </div>
        )}

        <label>Tipo de Pedido</label>
        <select value={tipoPedido} onChange={(e) => setTipoPedido(e.target.value)}>
          <option value="presencial">Atendimento Presencial</option>
          <option value="busca">Busca</option>
        </select>
        {tipoPedido === "busca" && (
          <>
            <label>Endereço</label>
            <input type="text" value={endereco.rua} onChange={(e) => setEndereco({...endereco, rua: e.target.value})} />
          </>
        )}
        <label>Método de Pagamento</label>
        <select value={metodoPagamento} onChange={(e) => setMetodoPagamento(e.target.value)}>
          <option value="dinheiro">Dinheiro</option>
          <option value="cartao">Cartão</option>
          <option value="pix">PIX</option>
        </select>
        <label>Status de Pagamento</label>
        <select value={statusPagamento} onChange={(e) => setStatusPagamento(e.target.value)}>
          <option value="pendente">Pendente</option>
          <option value="pago">Pago</option>
        </select>
      </div>

      {/* Modal de Seleção de Cliente */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Selecione um Cliente</h3>
            <input
              type="text"
              placeholder="Buscar por nome ou CPF/CNPJ"
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
            />
            <ul>
              {clientesFiltrados.map((cliente) => (
                <h4 key={cliente._id} onClick={() => handleClienteSelecionado(cliente)}>
                  {cliente.nome} - {cliente.cpfCnpj}
                </h4>
              ))}
            </ul>
            <div className="modal-actions">
              <button onClick={() => setModalAberto(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      <div className="filtro-busca">
        <input
          type="text"
          placeholder="Buscar por item ou categoria"
          value={filtroBusca}
          onChange={(e) => setFiltroBusca(e.target.value)}
        />
      </div>

      {/* Tabela de Itens por Categoria */}
      <div className="tabela-itens">
        <h3>Itens</h3>
        {categorias.length === 0 ? (
          <p>Carregando categorias...</p>
        ) : (
          categorias.map((categoria) => {
            const itensDaCategoria = servicosFiltrados.filter((servico) => servico.categoriaId._id === categoria._id);

            return (
              itensDaCategoria.length > 0 && (
                <div key={categoria._id} className="categoria">
                  <h4>{categoria.nome}</h4>
                  <table className="tabela">
                    <thead>
                      <tr>
                        <th>Nome do Serviço</th>
                        <th>Valor</th>
                        <th>Quantidade</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensDaCategoria.map((servico) => (
                        <tr key={servico._id}>
                          <td>{servico.nome}</td>
                          <td>R${servico.preco}</td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              placeholder="Quantidade"
                              value={quantidades[servico._id] || ""}
                              onChange={(e) => handleQuantidadeChange(servico._id, e.target.value)}
                            />
                            {servico.tipo === "peso" && (
                              <input
                                type="number"
                                step="0.1"
                                placeholder="Peso (kg)"
                                value={peso}
                                onChange={(e) => setPeso(e.target.value)}
                              />
                            )}
                          </td>
                          <td>
                            <button onClick={() => handleAdicionarItem(servico)}>Adicionar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            );
          })
        )}
      </div>

      <div className="resumo-pedido">
        <h3>Resumo do Pedido</h3>
        <ul>
          {itens.map((item, index) => (
            <li key={index}>
              {item.quantidade}x {item.nome} - R${item.valorTotal}
              <button onClick={() => handleExcluirItem(index)}>Excluir</button>
            </li>
          ))}
        </ul>
        <h4><strong>Valor Total: R${calcularValorTotal()}</strong></h4>
      </div>

      <div className="finalizar-pedido">
        <button onClick={handleFinalizarPedido}>Finalizar Pedido</button>
      </div>
    </div>
  );
};

export default NovaOrdem;
