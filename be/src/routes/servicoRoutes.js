import express from "express";
import {
  criarServico,
  getServicos,
  getServicoById,
  atualizarServico,
  deletarServico,
  deletarServicoTodos,
} from "../controllers/servicoController.js";

const router = express.Router();

// Rotas para serviço
router.post("/", criarServico);
router.get("/", getServicos);
router.get("/:id", getServicoById);
router.put("/:id", atualizarServico);
router.delete("/:id", deletarServico);

router.delete('/categoria/:categoriaId', deletarServicoTodos);

export default router;