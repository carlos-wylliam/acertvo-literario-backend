const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }, // hash
  name: String,
  role: { type: String, default: "author" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);