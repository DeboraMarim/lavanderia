import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Clientes.css";

const API_URL = process.env.REACT_APP_API_URL;

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCliente, setNewCliente] = useState({
    tipoCliente: "Físico",
    nome: "",
    cpfCnpj: "",
    telefone: "",
    whatsapp: "",
    dataNascimento: "",
    endereco: {
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
      complemento: "",
      cidade: "",
      estado: "",
    }
  });

  // 🔄 Carregar clientes da API
  useEffect(() => {
    getClientes();
  }, []);

  const getClientes = () => {
    axios.get(`${API_URL}/clientes`)
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Erro ao buscar clientes:", err));
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredClientes = clientes.filter((cliente) =>
    Object.values(cliente).some((valor) =>
      String(valor).toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      const field = name.split(".")[1]; // Pega o nome do campo dentro de 'endereco'
      setNewCliente((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [field]: value }
      }));
    } else {
      setNewCliente((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 🆕 Criar ou atualizar cliente
  const handleSaveCliente = () => {
    const clienteFormatado = {
      ...newCliente,
      whatsapp: newCliente.telefone,  // WhatsApp sempre recebe o telefone
      dataNascimento: newCliente.dataNascimento ? new Date(newCliente.dataNascimento).toISOString() : "",
    };

    const request = newCliente._id
      ? axios.put(`${API_URL}/clientes/${newCliente._id}`, clienteFormatado)
      : axios.post(`${API_URL}/clientes`, clienteFormatado);

    request
      .then((res) => {
        console.log("Cliente salvo com sucesso:", res.data);
        getClientes();
        setShowModal(false);
        resetForm();
      })
      .catch((err) => {
        console.error("Erro ao salvar cliente:", err.response?.data || err.message);
      });
  };

  const handleEditCliente = (cliente) => {
    setNewCliente(cliente);
    setShowModal(true);
  };

  const handleDeleteCliente = (id) => {
    axios.delete(`${API_URL}/clientes/${id}`)
      .then(() => {
        console.log("Cliente removido com sucesso");
        getClientes();
      })
      .catch((err) => console.error("Erro ao remover cliente:", err));
  };

  const resetForm = () => {
    setNewCliente({
      tipoCliente: "Físico",
      nome: "",
      cpfCnpj: "",
      telefone: "",
      whatsapp: "",
      dataNascimento: "",
      endereco: {
        cep: "",
        rua: "",
        numero: "",
        bairro: "",
        complemento: "",
        cidade: "",
        estado: "",
      }
    });
  };

  return (
    <div className="clientes-container">
      <h2>Gestão de Clientes</h2>

      <div className="clientes-header">
        <input
          type="text"
          placeholder="Buscar por nome, tipo, telefone, CPF/CNPJ..."
          className="search-input"
          value={search}
          onChange={handleSearch}
        />
        <button className="add-btn" onClick={() => { resetForm(); setShowModal(true); }}>
          Novo Cliente
        </button>
      </div>

      <table className="clientes-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Nome</th>
            <th>CPF/CNPJ</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredClientes.length > 0 ? (
            filteredClientes.map((cliente) => (
              <tr key={cliente._id}>
                <td>{cliente.tipoCliente}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.cpfCnpj}</td>
                <td>{cliente.telefone}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditCliente(cliente)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDeleteCliente(cliente._id)}>Excluir</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">Nenhum cliente encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{newCliente._id ? "Editar Cliente" : "Adicionar Cliente"}</h3>

            <select name="tipoCliente" value={newCliente.tipoCliente} onChange={handleInputChange}>
              <option value="Físico">Físico</option>
              <option value="Jurídico">Jurídico</option>
            </select>

            <input type="text" name="nome" placeholder="Nome" value={newCliente.nome} onChange={handleInputChange} />
            <input type="text" name="cpfCnpj" placeholder="CPF/CNPJ" value={newCliente.cpfCnpj} onChange={handleInputChange} />
            <input type="text" name="telefone" placeholder="Telefone/WhatsApp" value={newCliente.telefone} onChange={handleInputChange} />
            <input type="date" name="dataNascimento" value={newCliente.dataNascimento} onChange={handleInputChange} />

            <h4>Endereço</h4>
            <input type="text" name="endereco.cep" placeholder="CEP" value={newCliente.endereco.cep} onChange={handleInputChange} />
            <input type="text" name="endereco.rua" placeholder="Rua" value={newCliente.endereco.rua} onChange={handleInputChange} />
            <input type="text" name="endereco.numero" placeholder="Número" value={newCliente.endereco.numero} onChange={handleInputChange} />
            <input type="text" name="endereco.bairro" placeholder="Bairro" value={newCliente.endereco.bairro} onChange={handleInputChange} />
            <input type="text" name="endereco.complemento" placeholder="Complemento" value={newCliente.endereco.complemento} onChange={handleInputChange} />
            <input type="text" name="endereco.cidade" placeholder="Cidade" value={newCliente.endereco.cidade} onChange={handleInputChange} />
            <input type="text" name="endereco.estado" placeholder="Estado" value={newCliente.endereco.estado} onChange={handleInputChange} />

            <div className="modal-actions">
              <button className="save-btn" onClick={handleSaveCliente}>Salvar</button>
              <button className="close-btn" onClick={() => setShowModal(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
