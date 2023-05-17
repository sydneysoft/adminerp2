const RestBuilder = require('../builder.controller');

const SedeBuilder = new RestBuilder();

const SedeController = SedeBuilder.setTable('empresas_sedes').setName('Sede');

module.exports = {SedeController}
