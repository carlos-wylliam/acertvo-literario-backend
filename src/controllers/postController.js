const Post = require('../models/Post');

const createPost = async (req, res) => {
  const { postType, title, content, tags } = req.body;
  const userId = req.user && req.user.id;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  if (postType !== 'text') {
    return res.status(400).json({ error: 'Apenas posts de texto são aceitos por enquanto.' });
  }

  try {
    const post = new Post({
      postType,
      title,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: userId,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro interno ao criar post' });
  }
};

const listPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  try {
    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user && req.user.id;

  try {
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: 'Post não encontrado' });

    if (!post.author || post.author.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Não autorizado a deletar este post' });
    }

    await post.deleteOne();
    return res.status(200).json({ message: 'Post removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    return res.status(500).json({ error: 'Erro interno ao deletar post' });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user && req.user.id;
  const { title, content, tags } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  try {
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: 'Post não encontrado' });

    if (!post.author || post.author.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Não autorizado a editar este post' });
    }

    if ('title' in req.body) post.title = title;
    if ('content' in req.body) post.content = content;
    if ('tags' in req.body) post.tags = tags.split(',').map(tag => tag.trim());

    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar post' });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json(post);
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({ error: 'Erro interno ao buscar post' });
  }
};

// const deletePostsWithoutAuthor = async (req, res) => {
//   try {
//     const result = await Post.deleteMany({ author: { $exists: false } });
//     res.json({ message: `Posts deletados: ${result.deletedCount}` });
//   } catch (error) {
//     res.status(500).json({ error: 'Erro ao deletar posts sem author' });
//   }
// };

module.exports = {
  createPost,
  listPosts,
  deletePost,
  updatePost,
  getPostById,
  // deletePostsWithoutAuthor
};
