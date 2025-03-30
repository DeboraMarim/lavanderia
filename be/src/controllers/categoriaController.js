import Categoria from "../models/categoria.js";

// Criar nova categoria
export const criarCategoria = async (req, res) => {
  try {
    const categoria = new Categoria(req.body);
    await categoria.save();
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obter todas as categorias
export const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obter uma categoria por ID
export const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.status(200).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar uma categoria
export const atualizarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categoria) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.status(200).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar uma categoria
export const deletarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.status(200).json({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
