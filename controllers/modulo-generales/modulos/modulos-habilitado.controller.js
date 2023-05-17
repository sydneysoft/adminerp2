const RestBuilder = require('../../builder.controller');

const ModuloHabilitadoBuilder = new RestBuilder();

const ModuloHabilitadoController = ModuloHabilitadoBuilder.setTable('modulos_habilitado').setName('Modulo Habilitado');

module.exports = {ModuloHabilitadoController}
