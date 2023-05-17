const RestBuilder = require('../../builder.controller');

const RolePermisoBuilder = new RestBuilder();

const RolePermisoController = RolePermisoBuilder.setTable('rol_permisos').setName('Role permiso').notCompany();

module.exports = {RolePermisoController}
