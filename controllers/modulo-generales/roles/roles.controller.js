const RestBuilder = require('../../builder.controller');

const RoleBuilder = new RestBuilder();

const RoleController = RoleBuilder.setTable('roles').setName('Role');

module.exports = {RoleController}
