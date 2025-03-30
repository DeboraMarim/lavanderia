import Servico from "../models/servicos.js";

// Criar novo serviço
export const criarServico = async (req, res) => {
  try {
    const servico = new Servico(req.body);
    await servico.save();
    res.status(201).json(servico);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obter todos os serviços
export const getServicos = async (req, res) => {
  try {
    const servicos = await Servico.find().populate("categoriaId");
    res.status(200).json(servicos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obter um serviço por ID
export const getServicoById = async (req, res) => {
  try {
    const servico = await Servico.findById(req.params.id).populate("categoriaId");
    if (!servico) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }
    res.status(200).json(servico);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar um serviço
export const atualizarServico = async (req, res) => {
  try {
    const servico = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!servico) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }
    res.status(200).json(servico);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar um serviço
export const deletarServico = async (req, res) => {
  try {
    const servico = await Servico.findByIdAndDelete(req.params.id);
    if (!servico) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }
    res.status(200).json({ message: "Serviço deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletarServicoTodos = async (req, res) => {
  const { categoriaId } = req.params;

  try {
    // Excluir todos os serviços com o categoriaId correspondente
    await Servico.deleteMany({ categoriaId });

    res.status(200).json({ message: 'Serviços da categoria excluídos com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir serviços da categoria.', error: err });
  }
};
