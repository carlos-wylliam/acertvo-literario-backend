const { Router } = require("express");
const { baseUrl } = require("./controllers/baseUrl");
const { login } = require("./controllers/auth");
const { createPost, listPosts, deletePost, updatePost, getPostById } = require("./controllers/postController");
const authMiddleware = require("./middlewares/authMiddleware");
const { createCarouselPost, createVideoPost } = require("./controllers/postCarouselController");
const upload = require("./config/multer"); 

const router = Router();

router.get("/", baseUrl);
router.post("/login", login);
router.post("/posts", authMiddleware, createPost);
router.get("/posts", listPosts);
router.delete("/posts/:id", authMiddleware, deletePost);
router.patch("/posts/:id", authMiddleware, updatePost);
router.get("/posts/:id", getPostById);

router.post("/posts/carousel", authMiddleware, upload.array("imagens"), createCarouselPost);
router.post("/posts/video", authMiddleware, upload.single("video"), createVideoPost)

module.exports = { router };
