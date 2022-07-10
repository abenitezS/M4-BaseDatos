const router = require('express').Router();
const { Page, Category } = require('../models');

router.get('/', async function(req, res, next){
  // Modificar para renderizar todas las páginas creadas que se encuentren
  // dento de la base de datos (Debe traer también las categorías a las que pertenece cada página)
  // Tu código acá:
  
  const pages = await Page.findAll({
    include: Category
  });

  res.render('index', { pages });
});

module.exports = {
  users: require('./users'),
  pages: require('./pages'),
  categories: require('./categories'),
  index: router,
};
