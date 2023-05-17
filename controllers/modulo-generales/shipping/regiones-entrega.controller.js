const RestBuilder = require('../../builder.controller');

const RegionEntregaBuilder = new RestBuilder();

const RegionEntregaController = RegionEntregaBuilder.setTable('regiones_entrega').setName('Region entrega');

module.exports = {RegionEntregaController}
