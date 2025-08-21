const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    postType: { type: String, required: true }, // "carousel" | "video" | "text"
    title: { type: String, required: true },
    content: { type: String },
    tags: [String],
    images: [String], // para carrossel
    videoUrl: { type: String }, // <-- adicionado para vídeo
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
