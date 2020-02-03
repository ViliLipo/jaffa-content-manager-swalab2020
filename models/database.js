const Sequelize = require('sequelize');

const database = new Sequelize({
  dialect: 'sqlite', storage: './content.db',
});

module.exports = database;
