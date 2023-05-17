const RestBuilder = require('../../builder.controller');

const RoleModeloBuilder = new RestBuilder();

const RoleModeloController = RoleModeloBuilder.setTable('rol_modelos').setName('Rol modelo').notCompany();

module.exports = {RoleModeloController}
