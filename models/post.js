const Sequelize = require('sequelize');
const database = require('./database.js');

console.log(database);

const { Model } = Sequelize;

class Post extends Model {}

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
