import express from "express";
import {
  criarCategoria,
  getCategorias,
  getCategoriaById,
  atualizarCategoria,
  deletarCategoria,
} from "../controllers/categoriaController.js";

const router = express.Router();

// Rotas para categoria
router.post("/", criarCategoria);
router.get("/", getCategorias);
router.get("/:id", getCategoriaById);
router.put("/:id", atualizarCategoria);
router.delete("/:id", deletarCategoria);

export default router; // Use export default
