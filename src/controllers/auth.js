const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ mensagem: "Conta não encontrada" });
    }

    const checkPass = await bcrypt.compare(senha, user.senha);
    if (!checkPass) {
      return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_PASSWORD,
      { expiresIn: "8h" }
    );

    const { senha: _, ...usuarioLogado } = user.toObject();
    return res.status(200).json({ usuario: usuarioLogado, token });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = { login };
