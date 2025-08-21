const express = require("express");
const cors = require("cors");
const { router } = require("./routes");

const app = express();

// Habilita CORS para qualquer origem (pode restringir depois)
app.use(cors());

// Habilita JSON no body das requisições
app.use(express.json());

// Rotas
app.use(router);

module.exports = { app };
