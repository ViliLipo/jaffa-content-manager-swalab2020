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


module.exports = contentRouter;
