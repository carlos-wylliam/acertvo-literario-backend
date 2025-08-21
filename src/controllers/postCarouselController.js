const AWS = require("aws-sdk");
const crypto = require("crypto");
const path = require("path");
const Post = require("../models/Post");

// Configuração do Backblaze S3
const s3 = new AWS.S3({
    endpoint: "https://s3.us-east-005.backblazeb2.com",
    accessKeyId: process.env.BACKBLAZE_KEY_ID,
    secretAccessKey: process.env.BACKBLAZE_APP_KEY,
    region: "us-east-005",
    signatureVersion: "v4",
});

const createCarouselPost = async (req, res) => {
    try {
        const { title, tags } = req.body;
        const author = req.user.id; // vem do seu authMiddleware

        if (!title?.trim()) {
            return res.status(400).json({ error: "Título é obrigatório" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "Envie pelo menos uma imagem" });
        }

        // Upload de cada imagem para o Backblaze
        const uploadedUrls = [];
        for (const file of req.files) {
            const fileExtension = path.extname(file.originalname);
            const fileName = crypto.randomBytes(16).toString("hex") + fileExtension;

            const params = {
                Bucket: "poetista-clau",
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read",
            };

            const data = await s3.upload(params).promise();
            uploadedUrls.push(data.Location);
        }

        // Cria o post no MongoDB
        const newPost = await Post.create({
            postType: "carousel",
            title,
            tags: tags ? tags.split(",").map(t => t.trim()) : [],
            images: uploadedUrls,
            author,
        });

        res.status(201).json({
            message: "Post de carrossel criado com sucesso!",
            post: newPost,
        });
    } catch (error) {
        console.error("Erro ao criar post de carrossel:", error);
        res.status(500).json({ error: error.message });
    }
};

const createVideoPost = async (req, res) => {
    try {
        const { title, tags } = req.body;
        const author = req.user.id;

        if (!title?.trim()) {
            return res.status(400).json({ error: "Título é obrigatório" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Envie um vídeo" });
        }

        const file = req.file;

        // valida se é vídeo
        if (!file.mimetype.startsWith("video/")) {
            return res.status(400).json({ error: "O arquivo enviado não é um vídeo válido" });
        }

        // gera nome único
        const fileExtension = path.extname(file.originalname);
        const fileName = crypto.randomBytes(16).toString("hex") + fileExtension;

        // upload no Backblaze
        const params = {
            Bucket: "poetista-clau",
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const data = await s3.upload(params).promise();

        // cria post no banco
        const newPost = await Post.create({
            postType: "video",
            title,
            tags: tags ? tags.split(",").map(t => t.trim()) : [],
            videoUrl: data.Location,
            author,
        });

        res.status(201).json({
            message: "Post de vídeo criado com sucesso!",
            post: newPost,
        });

    } catch (error) {
        console.error("Erro ao criar post de vídeo:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createCarouselPost, createVideoPost };
