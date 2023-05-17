const RestBuilder = require('../../builder.controller');

const ProductoPaqueteBuilder = new RestBuilder();

const ProductoPaqueteController = ProductoPaqueteBuilder.setTable('producto_paquetes').setName('Producto Paquete');

module.exports = {ProductoPaqueteController}
