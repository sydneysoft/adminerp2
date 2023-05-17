const RestBuilder = require('../../builder.controller')

const ProductoCaracteristicaBuilder = new RestBuilder();

const ProductoCaracteristicaController = ProductoCaracteristicaBuilder.setTable('producto_caracteristicas').setName('Caracteristica');

module.exports = {ProductoCaracteristicaController}