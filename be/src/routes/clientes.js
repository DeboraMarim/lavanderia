import express from "express";
import {
  criarCliente,
  buscarClientes,
  buscarClientePorId,
  atualizarCliente,
  deletarCliente,
} from "../controllers/clienteController.js";

const router = express.Router();

router.post("/", criarCliente);
router.get("/", buscarClientes);
router.get("/:id", buscarClientePorId);
router.put("/:id", atualizarCliente);
router.delete("/:id", deletarCliente);

export default router; // Use export default
