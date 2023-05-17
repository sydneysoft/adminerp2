const RestBuilder = require('../builder.controller');

const EmpresaRegistradaCategoriaBuilder = new RestBuilder();

const EmpresaRegistradaCategoriaController = EmpresaRegistradaCategoriaBuilder.setTable('empresas_registradas_categorias').setName('Empresa Registradas Categoria')
  .setTimeStamps();

module.exports = {EmpresaRegistradaCategoriaController}
