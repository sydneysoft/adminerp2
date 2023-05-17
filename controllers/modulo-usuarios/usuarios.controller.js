const RestBuilder = require('../builder.controller');

const UsuariosBuilder = new RestBuilder();

const UsuariosController = UsuariosBuilder.setTable('usuarios').setName('Usuario')
  .setTimeStamps();

module.exports = {UsuariosController}
