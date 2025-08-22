const express = require("express");
const cors = require("cors");
const { router } = require("./routes");

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: [
    "https://acervo-literario.vercel.app", // frontend deploy
    "http://localhost:8080"                // frontend local
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

// Habilita JSON no body das requisições
app.use(express.json());

// Rotas
app.use(router);

module.exports = { app };
