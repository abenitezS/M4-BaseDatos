const { Page, User } = require('../models');
const router = require('express').Router();

router.get('/', async function(req, res){
  // Modificar para renderizar todas los usuarios que se encuentren
  // dento de la base de datos
  // Tu código acá:
  const users = await User.findAll();

  res.render('users', { users });
});

router.get('/:id', async function(req, res){
  // Modificar para renderizar los datos del usuario seleccionado
  // Tu código acá:
  const { id } = req.params;
  const user = await User.findByPk(id, {
    include: Page,
  });

  res.render('unUsuarioEnParticular', { user });
});

module.exports = router;
