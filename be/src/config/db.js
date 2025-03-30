import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose"; // Usando import aqui

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado ao banco de dados");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1); 
  }
};

export default connectDB; // Usando export default aqui
