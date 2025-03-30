import mongoose from "mongoose";

const ServicoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  tipo: { type: String, enum: ["peça", "peso"], required: true },
  categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria", required: true },
});

export default mongoose.model("Servico", ServicoSchema);
