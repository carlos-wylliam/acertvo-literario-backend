const express = require("express");
const cors = require("cors");
const { router } = require("./routes");

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: ["https://acertvo-literario-backend.onrender.com"], // substitua pela URL do seu frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Habilita CORS com as opções
app.use(cors(corsOptions));

// Habilita JSON no body das requisições
app.use(express.json());

// Rotas
app.use(router);

module.exports = { app };
