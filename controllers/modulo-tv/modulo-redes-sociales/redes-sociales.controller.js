const RestBuilder = require('../../builder.controller')

const RedBuilder = new RestBuilder();

const RedController = RedBuilder.setTable('redes_sociales').setName('Red social');

module.exports = {RedController}