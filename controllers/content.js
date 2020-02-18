const contentRouter = require('express').Router();
const Post = require('../models/post.js');
const Comment = require('../models/comment.js');
const { mqSend } = require('../interservice/machinequeue.js');

const moderationEventQueue = 'moderation_event_queue';

const beginModerationSaga = async (jsonData) => {
  await mqSend(jsonData, moderationEventQueue);
};


contentRouter.get('/', async (request, response) => {
  try {
    const posts = await Post.findAll({
      include: [Comment],
      where: { pending: false },
    });
    response.json(posts);
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
    await beginModerationSaga(jsonData);
    response.status(200).json({ status: 200 });
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
    await beginModerationSaga(jsonData);
    response.status(200).json({ status: 200 });
  } catch (error) {
    console.error(error);
    response.status(500).json({ status: 500 });
  }
});

module.exports = contentRouter;
