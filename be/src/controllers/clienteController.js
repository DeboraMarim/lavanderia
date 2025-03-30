// controllers/clienteController.js
import Cliente from "../models/Cliente.js";  // Alterado para a sintaxe de importação ES Module

// Criar Cliente
const criarCliente = async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).json(cliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const buscarClientes = async (req, res) => {
  try {
    const { query } = req.query;
    let filtro = query
      ? {
          $or: [
            { nome: new RegExp(query, "i") },
            { cpfCnpj: new RegExp(query, "i") },
            { telefone: new RegExp(query, "i") },
            { whatsapp: new RegExp(query, "i") },
            { tipoCliente: new RegExp(query, "i") }
          ]
        }
      : {};

    const clientes = await Cliente.find(filtro);
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const buscarClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const atualizarCliente = async (req, res) => {
  try {
    const clienteAtualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!clienteAtualizado) return res.status(404).json({ message: "Cliente não encontrado" });
    res.json(clienteAtualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
    res.json({ message: "Cliente removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Alterado para exportação ES Module
export { criarCliente, buscarClientes, buscarClientePorId, atualizarCliente, deletarCliente };
