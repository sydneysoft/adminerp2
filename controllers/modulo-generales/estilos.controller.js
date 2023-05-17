const RestBuilder = require('../builder.controller');

const EstiloBuilder = new RestBuilder();

const EstiloController = EstiloBuilder.setTable('estilos').setName('Estilo');

module.exports = {EstiloController}
