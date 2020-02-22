const Sequelize = require('sequelize');
const database = require('./database.js');


const { Model } = Sequelize;

class Post extends Model {
  getSimpleRepresentation() {
    const {
      id, title, content, user,
    } = this;
    return {
      type: 'post',
      id,
      title,
      content,
      user,
    };
  }

  getJsonRepresentation() {
    return JSON.stringify(this.getSimpleRepresentation());
  }
}

Post.init({
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING,
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
  modelName: 'post',
});

Post.sync({ force: true })
  .then(() => Post.create({
    title: 'Corona',
    content: 'Virus',
    user: 'Nursegurl12',
  }))
  .then(() => console.log('Model post updated'));

module.exports = Post;
