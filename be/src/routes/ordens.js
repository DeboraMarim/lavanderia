import express from "express";
import OrdemServico from "../models/OrdemServico.js";
import Cliente from "../models/Cliente.js";
import Servico from "../models/servicos.js";

const router = express.Router();

async function gerarNumeroOrdem() {
  const ano = new Date().getFullYear().toString().slice(2);
  const mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const ultimoNumero = await OrdemServico.find().sort({ numero: -1 }).limit(1);
  const numeroSequencial = ultimoNumero.length ? parseInt(ultimoNumero[0].numero.slice(4)) + 1 : 1;
  const numeroSequencialFormatado = numeroSequencial.toString().padStart(4, '0');

  return `${ano}${mes}${numeroSequencialFormatado}`;
}

// Criar uma nova ordem de serviço
router.post("/", async (req, res) => {
  try {
    const { clienteId, itens, tipoPedido, enderecoEntrega, enderecoColeta, metodoPagamento, statusPagamento } = req.body;
    
    const numeroOrdem = await gerarNumeroOrdem();

    const novaOrdem = new OrdemServico({
      numero: numeroOrdem,
      cliente: clienteId,
      itens,
      tipoPedido,
      metodoPagamento,
      statusPagamento,
      status: "Pendente",
      enderecoEntrega: tipoPedido === "busca" ? enderecoEntrega : null,
      enderecoColeta: tipoPedido === "busca" ? enderecoColeta : null
    });

    await novaOrdem.save();
    const ordemCompleta = await OrdemServico.findById(novaOrdem._id)
      .populate("cliente")
      .populate("itens.servicoId");

    res.status(201).json(ordemCompleta);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar ordem de serviço", error });
  }
});

// Obter todas as ordens de serviço
router.get("/", async (req, res) => {
  try {
    const ordens = await OrdemServico.find().populate("cliente").populate("itens.servicoId");
    res.status(200).json(ordens);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar ordens de serviço", error });
  }
});

// Obter uma ordem de serviço por ID
router.get("/:id", async (req, res) => {
  try {
    const ordem = await OrdemServico.findById(req.params.id).populate("cliente").populate("itens.servicoId");
    if (!ordem) return res.status(404).json({ message: "Ordem não encontrada" });
    res.status(200).json(ordem);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar ordem de serviço", error });
  }
});

// Atualizar uma ordem de serviço
router.put("/:id", async (req, res) => {
  try {
    const { status, statusPagamento } = req.body;
    const ordemAtualizada = await OrdemServico.findByIdAndUpdate(req.params.id, { status, statusPagamento }, { new: true });
    if (!ordemAtualizada) return res.status(404).json({ message: "Ordem não encontrada" });
    res.status(200).json(ordemAtualizada);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar ordem de serviço", error });
  }
});

// Excluir uma ordem de serviço
router.delete("/:id", async (req, res) => {
  try {
    const ordemRemovida = await OrdemServico.findByIdAndDelete(req.params.id);
    if (!ordemRemovida) return res.status(404).json({ message: "Ordem não encontrada" });
    res.status(200).json({ message: "Ordem removida com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir ordem de serviço", error });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, statusPagamento } = req.body;

    const ordemAtualizada = await OrdemServico.findByIdAndUpdate(
      id,
      { status, statusPagamento },
      { new: true }
    ).populate("cliente").populate("itens.servicoId");

    if (!ordemAtualizada) {
      return res.status(404).json({ message: "Ordem não encontrada" });
    }

    res.json(ordemAtualizada);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar ordem", error });
  }
});


export default router;
