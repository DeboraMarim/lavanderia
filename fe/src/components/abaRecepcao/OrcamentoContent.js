import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Pedidos.css";

const Orcamento = () => {
  const [filtroBusca, setFiltroBusca] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [itens, setItens] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [peso, setPeso] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriaResponse = await axios.get(`${process.env.REACT_APP_API_URL}/categorias`);
        const servicoResponse = await axios.get(`${process.env.REACT_APP_API_URL}/servicos`);

        setCategorias(categoriaResponse.data);
        setServicos(servicoResponse.data);
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
    const quantidadeNumerica = parseInt(quantidades[item._id] || 1, 10);
    const pesoNumerico = parseFloat(peso);

    if (quantidadeNumerica > 0 || pesoNumerico > 0) {
      setItens([
        ...itens,
        {
          ...item,
          quantidade: quantidadeNumerica > 0 ? quantidadeNumerica : pesoNumerico,
          tipo: quantidadeNumerica > 0 ? "peça" : "peso",
          valorTotal: item.preco * (quantidadeNumerica > 0 ? quantidadeNumerica : pesoNumerico),
        },
      ]);
      setQuantidades((prevQuantidades) => ({ ...prevQuantidades, [item._id]: "" }));
      setPeso("");
    } else {
      console.warn("Quantidade ou peso inválido");
    }
  };

  const handleExcluirItem = (index) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  };

  const servicosFiltrados = servicos.filter((servico) => {
    return (
      servico.nome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      servico.categoriaId.nome.toLowerCase().includes(filtroBusca.toLowerCase())
    );
  });

  const calcularValorTotal = () => {
    return itens.reduce((total, item) => total + item.valorTotal, 0).toFixed(2);
  };

  return (
    <div>
      <h2>Orçamento</h2>
      <div className="filtro-busca">
        <input
          type="text"
          placeholder="Buscar por item ou categoria"
          value={filtroBusca}
          onChange={(e) => setFiltroBusca(e.target.value)}
        />
      </div>
      <div className="tabela-itens">
        {categorias.length === 0 ? (
          <p>Carregando categorias...</p>
        ) : (
          categorias.map((categoria) => {
            const itensDaCategoria = servicosFiltrados.filter(
              (servico) => servico.categoriaId._id === categoria._id
            );
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
        <h3>Resumo do Orçamento</h3>
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
    </div>
  );
};

export default Orcamento;
