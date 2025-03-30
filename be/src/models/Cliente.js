import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
  {
    tipoCliente: { type: String, enum: ["Físico", "Jurídico"], required: true },
    nome: { type: String, required: true },
    cpfCnpj: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    dataNascimento: { type: Date },
    endereco: {
      cep: { type: String },
      rua: { type: String },
      numero: { type: String },
      bairro: { type: String },
      cidade: { type: String },
      estado: { type: String },
      complemento: { type: String }
    }
  },
  { timestamps: true }
);

const Cliente = mongoose.model("Cliente", clienteSchema); // Usando clienteSchema aqui

export default Cliente;
