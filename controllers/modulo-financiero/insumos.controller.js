const RestBuilder = require('../builder.controller');

const InsumoBuilder = new RestBuilder();

const InsumoController = InsumoBuilder.setTable('insumos').setName('Insumo')
  .setTimeStamps();

module.exports = {InsumoController}
