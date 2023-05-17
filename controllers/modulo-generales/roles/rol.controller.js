const RestBuilder = require('../../builder.controller');

const RolBuilder = new RestBuilder();

const RolController = RolBuilder.setTable('rol').setName('Rol').notCompany();

module.exports = {RolController}
