const contentRouter = require('express').Router();
const Post = require('../models/post.js');
const Comment = require('../models/comment.js');


contentRouter.get('/', async (request, response) => {
  try {
    const posts = await Post.findAll({ include: [Comment] });
    response.json(posts);
  } catch (error) {
    console.error(error);
    response.status(404).json({ error: 'Posts not found.' });
  }
});

contentRouter.post('/post', async (request, response) => {
  try {
    const data = request.body;
    const { username, title, content } = data;
    const newPost = await Post.create({ user: username, title, content });
    response.status(200).json({ status: 200 });
  } catch (error) {
    console.error(error);
    response.status(500).json({ status: 500 });
  }
});

contentRouter.post('/comment', async (request, response) => {
  try {
    const { body } = request;
    console.log(body);
    const { username, content, postId } = body;
    const newComment = await Comment.create({ user: username, content });
    const post = await Post.findOne({ where: { id: postId }, include: [Comment] });
    newComment.setPost(post);
    response.status(200).json({ status: 200 });
  } catch (error) {
    console.error(error);
    response.status(500).json({ status: 500 });
  }
});

module.exports = contentRouter;
