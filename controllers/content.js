const contentRouter = require('express').Router();
const Post = require('../models/post.js');
const Comment = require('../models/comment.js');
const moderationSaga = require('../interservice/moderationsaga.js');


contentRouter.get('/', async (request, response) => {
  try {
    const posts = await Post.findAll({
      include: [Comment],
      where: { pending: false },
    });
    response.status(200).json(posts);
  } catch (error) {
    console.error(error);
    response.status(404).json({ error: 'Posts not found.' });
  }
});

contentRouter.post('/', async (request, response) => {
  try {
    const data = request.body;
    const { username, title, content } = data;
    const newPost = await Post.create({ user: username, title, content });
    const jsonData = newPost.getJsonRepresentation();
    const moderationresult = await moderationSaga(jsonData);
    if (moderationresult) {
      const [postAfterModeration] = await Post.findAll({
        include: [Comment],
        where: { id: newPost.id },
      });
      response.status(200).json(postAfterModeration);
    } else {
      response.status(401).json({ error: 'Post did not pass automatic modaration' });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ status: 500 });
  }
});

contentRouter.post('/comment', async (request, response) => {
  try {
    const { body } = request;
    const { username, content, postId } = body;
    const newComment = await Comment.create({ user: username, content });
    const post = await Post.findOne({ where: { id: postId }, include: [Comment] });
    await newComment.setPost(post);
    const jsonData = newComment.getJsonRepresentation();
    const moderationResult = await moderationSaga(jsonData);
    if (moderationResult) {
      return response.status(200).json(newComment);
    }
    return response.status(401).json({ error: 'Content did not pass moderation' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ status: 500 });
  }
});

module.exports = contentRouter;
