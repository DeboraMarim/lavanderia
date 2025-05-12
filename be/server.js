import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./src/config/db.js";
import clientesRoutes from "./src/routes/clientes.js";
import categoriaRoutes from "./src/routes/categoriaRoutes.js";
import servicoRoutes from "./src/routes/servicoRoutes.js";
import errorHandler from "./src/middleware/errorMiddleware.js";
import ordemRoutes from "./src/routes/ordens.js";

dotenv.config();

const app = express();

// Middleware
// app.use(cors());
app.use(cors({
  origin: 'https://sistema.lavanderialimpmais.com.br', // Atualize com o domínio correto
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

// Credenciais estáticas (usuário e senha fixos)
const USERS = {
  username: "admin",
  password: "123",
};

connectDB();

// Rota de login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USERS.username && password === USERS.password) {
    return res.json({ success: true, message: "Login bem-sucedido" });
  }

  return res.status(401).json({ success: false, message: "Credenciais inválidas" });
});

app.use("/api/clientes", clientesRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/servicos", servicoRoutes);
app.use("/api/ordens", ordemRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
