import mongoose from "mongoose";

const CategoriaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
});

export default mongoose.model("Categoria", CategoriaSchema);
