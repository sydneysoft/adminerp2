const RestBuilder = require('../builder.controller');

const EmpresaSedeBuilder = new RestBuilder();

const EmpresaSedeController = EmpresaSedeBuilder.setTable('empresas_sedes').setName('Empresa Sede');

module.exports = {EmpresaSedeController}
