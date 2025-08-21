require("dotenv").config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const hash = await bcrypt.hash('clauT13', 10);

    const user = new User({
      email: 'claudia@example.com',
      senha: hash,
      name: 'Claudia Teixeira',
    });

    await user.save();
    console.log('Usuário seedado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    process.exit(1);
  }
}

seed();
