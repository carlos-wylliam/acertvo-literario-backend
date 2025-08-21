require("dotenv").config();
const connectDB = require('./config/database');
const { app } = require("./app");

const startServer = async () => {
  try {
    await connectDB(); // conecta no MongoDB antes de iniciar o servidor
    const port = process.env.PORT || 3000; // Use maiúsculas para PORT
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (err) {
    console.error("Erro ao conectar no banco:", err);
    process.exit(1);
  }
};

startServer();
