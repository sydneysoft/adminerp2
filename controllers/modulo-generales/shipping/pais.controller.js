const RestBuilder = require('../../builder.controller');

const PaisBuilder = new RestBuilder();

const PaisController = PaisBuilder.setTable('pais').setName('Pais').notCompany();

module.exports = {PaisController}
