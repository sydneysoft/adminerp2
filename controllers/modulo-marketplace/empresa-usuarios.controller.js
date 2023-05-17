const RestBuilder = require('../builder.controller');

const EmpresaUsuarioBuilder = new RestBuilder();

const EmpresaUsuarioController = EmpresaUsuarioBuilder.setTable('empresas_usuarios').setName('Empresa Usuario');

module.exports = {EmpresaUsuarioController}
