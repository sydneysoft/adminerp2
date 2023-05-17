const RestBuilder = require('../builder.controller');

const AlmacenBuilder = new RestBuilder();

const AlmacenController = AlmacenBuilder.setTable('almacenes').setName('Almacen');

module.exports = {AlmacenController}
