var { Sequelize, STRING, TEXT, ENUM, VIRTUAL } = require('sequelize');

var db = new Sequelize('postgres://usuario:password@localhost:5432/henryblog', {
  logging: false,
});

const Page = db.define('page', {
  // Tu código acá:
  title: {
    type: STRING,
    allowNull: false,
  },
  urlTitle: {
    type: STRING,
    unique: true,
    allowNull: false,
  },
  content: {
    type: TEXT,
    allowNull: false,
  },
  status: {
    type: ENUM('open', 'closed')
  },
  route: {
    type: VIRTUAL,
    get () {
      return `/pages/${this.urlTitle}`
    }
  },
});

// .addHook() method

Page.addHook('beforeValidate', page => {
    page.urlTitle = page.title && page.title.replace(/\s+/g, '_').replace(/[^\w-]+/g, '');
});

const User = db.define('users', {
  name: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});

const Category = db.define('category', {
  // Tu código acá:
  name: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: TEXT,
  },
});

// Vincular User con Page
// Tu código acá:
User.hasMany(Page);
Page.belongsTo(User);

Page.belongsToMany(Category, { through: 'page_category' });
Category.belongsToMany(Page, { through: 'page_category' });

module.exports = {
  User,
  Page,
  Category,
  db
}
