const RestBuilder = require('../../builder.controller');

const ModuloBuilder = new RestBuilder();

const ModuloController = ModuloBuilder.setTable('modulos').setName('Modulo').notCompany();

module.exports = {ModuloController}
