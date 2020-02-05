const Comment = require('../models/comment.js');
const Post = require('../models/post.js');


const generalSagaAcceptor = async (model, data) => {
  const { id, passed } = data;
  const result = passed
    ? await model.update({ pending: false }, { where: { id } })
    : await model.destroy({ where: { id, pending: true } });
  return result;
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


module.exports = contentEventReceiver;
