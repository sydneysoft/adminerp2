const RestBuilder = require('../builder.controller');

const EmpresaCategoriaBuilder = new RestBuilder();

const EmpresaCategoriaController = EmpresaCategoriaBuilder.setTable('empresas_categorias').setName('Empresa Categoria')
  .setTimeStamps();

module.exports = {EmpresaCategoriaController}
