const Sequelize = require('sequelize');
const database = require('./database.js');
const Post = require('./post.js');

const { Model } = Sequelize;

class Comment extends Model {
  getSimpleRepresentation() {
    const {
      id, content, user, pending,
    } = this;
    return {
      type: 'comment',
      id,
      content,
      user,
      pending,
    };
  }

  getJsonRepresentation() {
    return JSON.stringify(this.getSimpleRepresentation());
  }
}

Comment.init({
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  user: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  pending: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize: database,
  modelName: 'comment',
});

Comment.Post = Comment.belongsTo(Post);
Post.Comments = Post.hasMany(Comment);


Comment.sync({ force: true })
  .then(() => Comment.create({
    content: 'Is fake news',
    user: 'Conspiracyman1226',
  }))
  .then((comment) => {
    Post.findAll()
      .then((posts) => {
        const post1 = posts[0];
        post1.setComments(comment);
        comment.setPost(post1);
      });
  });

database.sync();
module.exports = Comment;
