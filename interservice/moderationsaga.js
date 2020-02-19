const Comment = require('../models/comment.js');
const Post = require('../models/post.js');
const { mqRPC } = require('./machinequeue.js');

const moderationEventQueue = 'moderation_event_queue';

const generalSagaAcceptor = async (model, data) => {
  const { id, passed } = data;
  if (passed) {
    await model.update({ pending: false }, { where: { id } });
  } else {
    await model.destroy({ where: { id, pending: true } });
  }
  return passed;
};


const getSagaAcceptor = (type) => {
  const acceptors = {
    post: async (data) => generalSagaAcceptor(Post, data),
    comment: async (data) => generalSagaAcceptor(Comment, data),
  };
  return acceptors[type];
};

const contentEventReceiver = async (message) => {
  const { content } = message;
  const data = JSON.parse(content.toString());
  const { type } = data;
  const acceptor = getSagaAcceptor(type);
  return acceptor(data);
};

const moderationSaga = async (message) => {
  const result = await mqRPC(message, moderationEventQueue, contentEventReceiver);
  return result;
};


module.exports = moderationSaga;
