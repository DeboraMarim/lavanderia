import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Servicos.css";

const API_URL = process.env.REACT_APP_API_URL;

const Servicos = () => {
  const [categorias, setCategorias] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [novoServico, setNovoServico] = useState({
    nome: "",
    preco: "",
    tipo: "peça",
    categoriaId: "",
  });

  const [modalEditServicoOpen, setModalEditServicoOpen] = useState(false);
  const [servicoEditado, setServicoEditado] = useState({});

  const [novaCategoria, setNovaCategoria] = useState({
    nome: "",
  });
  const [modalCategoriaOpen, setModalCategoriaOpen] = useState(false);
  const [categoriaEditada, setCategoriaEditada] = useState(null);

  const [gerenciarCategoriasOpen, setGerenciarCategoriasOpen] = useState(false);

  useEffect(() => {
    carregarCategorias();
    carregarServicos();
  }, []);

  const carregarCategorias = async () => {
    const { data } = await axios.get(`${API_URL}/categorias`);
    setCategorias(data);
  };

  const carregarServicos = async () => {
    const { data } = await axios.get(`${API_URL}/servicos`);
    setServicos(data);
  };

  const adicionarServico = async () => {
    if (!novoServico.nome || !novoServico.preco || !novoServico.categoriaId) {
      alert("Todos os campos são obrigatórios.");
      return;
    }
    await axios.post(`${API_URL}/servicos`, novoServico);
    carregarServicos();
    setModalOpen(false);
  };

  const editarServico = async () => {
    if (!servicoEditado.nome || !servicoEditado.preco || !servicoEditado.categoriaId) {
      alert("Todos os campos são obrigatórios.");
      return;
    }
    await axios.put(`${API_URL}/servicos/${servicoEditado._id}`, servicoEditado);
    carregarServicos();
    setModalEditServicoOpen(false);
  };

  const excluirServico = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      await axios.delete(`${API_URL}/servicos/${id}`);
      carregarServicos();
    }
  };

  const adicionarCategoria = async () => {
    if (!novaCategoria.nome) {
      alert("O nome da categoria é obrigatório.");
      return;
    }
    await axios.post(`${API_URL}/categorias`, novaCategoria);
    carregarCategorias();
    setModalCategoriaOpen(false);
  };

  const editarCategoria = async () => {
    if (!categoriaEditada.nome) {
      alert("O nome da categoria é obrigatório.");
      return;
    }
    await axios.put(`${API_URL}/categorias/${categoriaEditada._id}`, categoriaEditada);
    carregarCategorias();
    setModalCategoriaOpen(false);
  };

  const excluirCategoria = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      await axios.delete(`${API_URL}/servicos/categoria/${id}`);
      await axios.delete(`${API_URL}/categorias/${id}`);
      carregarCategorias();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gerenciamento de Serviços</h2>

      <button
        onClick={() => setModalOpen(true)}
        style={{
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Adicionar Serviço
      </button>

      <button
        onClick={() => setGerenciarCategoriasOpen(!gerenciarCategoriasOpen)} 
        style={{
          padding: "10px",
          backgroundColor: "#17a2b8",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginLeft: "10px",
        }}
      >
        Gerenciar Categorias
      </button>

      {gerenciarCategoriasOpen && (
        <div style={{ marginTop: "20px" }}>
          <h3>Gerenciamento de Categorias</h3>
          <button
            onClick={() => setModalCategoriaOpen(true)}
            style={{
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Adicionar Categoria
          </button>

          <table border="1" width="100%" style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria._id}>
                  <td>{categoria.nome}</td>
                  <td>
                    <button
                      onClick={() => {
                        setCategoriaEditada(categoria);
                        // setModalCategoriaOpen(true);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => excluirCategoria(categoria._id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {categorias.map((categoria) => (
        <div key={categoria._id} style={{ marginTop: "20px" }}>
          <h3>{categoria.nome}</h3>
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Preço</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos
                .filter((s) => s.categoriaId._id === categoria._id)
                .map((servico) => (
                  <tr key={servico._id}>
                    <td>{servico.nome}</td>
                    <td>R$ {servico.preco}</td>
                    <td>{servico.tipo}</td>
                    <td>
                      <button onClick={() => {
                        setServicoEditado(servico);
                        setModalEditServicoOpen(true);
                      }}>
                        Editar
                      </button>
                      <button onClick={() => excluirServico(servico._id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Modal para adicionar Serviço */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setModalOpen(false)} 
        >
          <div
            style={{ background: "white", padding: "20px" }}
            onClick={(e) => e.stopPropagation()} 
          >
            <h3>Adicionar Serviço</h3>
            <input
              type="text"
              placeholder="Nome"
              onChange={(e) =>
                setNovoServico({ ...novoServico, nome: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Preço"
              onChange={(e) =>
                setNovoServico({ ...novoServico, preco: e.target.value })
              }
            />
            <select
              onChange={(e) =>
                setNovoServico({ ...novoServico, categoriaId: e.target.value })
              }
            >
              <option value="">Selecione a Categoria</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.nome}
                </option>
              ))}
            </select>
            <select
              onChange={(e) =>
                setNovoServico({ ...novoServico, tipo: e.target.value })
              }
              value={novoServico.tipo}
            >
              <option value="peça">Peça</option>
              <option value="peso">Peso</option>
            </select>
            <button onClick={adicionarServico}>Salvar</button>
            <button onClick={() => setModalOpen(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* Modal para editar Serviço */}
      {modalEditServicoOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setModalEditServicoOpen(false)} 
        >
          <div
            style={{ background: "white", padding: "20px" }}
            onClick={(e) => e.stopPropagation()} 
          >
            <h3>Editar Serviço</h3>
            <input
              type="text"
              value={servicoEditado.nome}
              onChange={(e) =>
                setServicoEditado({ ...servicoEditado, nome: e.target.value })
              }
            />
            <input
              type="number"
              value={servicoEditado.preco}
              onChange={(e) =>
                setServicoEditado({ ...servicoEditado, preco: e.target.value })
              }
            />
            <select
              value={servicoEditado.categoriaId._id}
              onChange={(e) =>
                setServicoEditado({ ...servicoEditado, categoriaId: e.target.value })
              }
            >
              <option value="">Selecione a Categoria</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.nome}
                </option>
              ))}
            </select>
            <button onClick={editarServico}>Salvar</button>
            <button onClick={() => setModalEditServicoOpen(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* Modal para adicionar Categoria */}
      {modalCategoriaOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setModalCategoriaOpen(false)} 
        >
          <div
            style={{ background: "white", padding: "20px" }}
            onClick={(e) => e.stopPropagation()} 
          >
            <h3>Adicionar Categoria</h3>
            <input
              type="text"
              placeholder="Nome da Categoria"
              onChange={(e) =>
                setNovaCategoria({ ...novaCategoria, nome: e.target.value })
              }
            />
            <button onClick={adicionarCategoria}>Salvar</button>
            <button onClick={() => setModalCategoriaOpen(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* Modal para editar Categoria */}
{/* Modal para editar Categoria */}
{categoriaEditada && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
    onClick={() => setCategoriaEditada(null)} // Fecha o modal quando clica fora
  >
    <div
      style={{ background: "white", padding: "20px" }}
      onClick={(e) => e.stopPropagation()} // Previne o fechamento quando clica no conteúdo do modal
    >
      <h3>Editar Categoria</h3>
      <input
        type="text"
        value={categoriaEditada.nome}
        onChange={(e) =>
          setCategoriaEditada({ ...categoriaEditada, nome: e.target.value })
        }
      />
      <button onClick={editarCategoria}>Salvar</button>
      <button onClick={() => setCategoriaEditada(null)}>Fechar</button> {/* Fecha o modal */}
    </div>
  </div>
)}

    </div>
  );
};

export default Servicos;
