import mongoose from "mongoose";

const OrdemServicoSchema = new mongoose.Schema({
  numero: { type: String, unique: true }, // Número único da ordem
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  itens: [
    {
      servicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Servico' },
      quantidade: Number,
      tipo: String, // "peça" ou "peso"
      valorTotal: Number
    }
  ],
  tipoPedido: { type: String, enum: ['presencial', 'busca'], default: 'presencial' },
  metodoPagamento: { type: String, enum: ['dinheiro', 'cartao', 'pix'], default: 'dinheiro' },
  statusPagamento: { type: String, enum: ['pendente', 'pago'], default: 'pendente' },
  
  enderecoEntrega: { type: Object, default: null }, // Apenas se tipoPedido for 'busca'
  enderecoColeta: { type: Object, default: null },  // Apenas se tipoPedido for 'busca'

  status: { type: String, default: 'Pendente' },
  dataCriacao: { type: Date, default: Date.now }
});

const OrdemServico = mongoose.model("OrdemServico", OrdemServicoSchema);
export default OrdemServico;
