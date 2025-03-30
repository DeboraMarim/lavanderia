import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook para redirecionamento

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        username,
        password,
      });

      navigate("/limpmais"); // Redireciona para a rota /limpmais
    } catch (err) {
      setError("Usuário ou senha inválidos!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">LIMPMAIS</h1>
        <input
          type="text"
          placeholder="Usuário"
          className="input-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button className="login-btn" onClick={handleLogin}>
          Entrar
        </button>
      </div>
    </div>
  );
};

export default Login;
