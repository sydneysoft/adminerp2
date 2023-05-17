const RestBuilder = require('../../builder.controller');

const MedidaProductoBuilder = new RestBuilder();

const MedidaProductoController = MedidaProductoBuilder.setTable('medida_productos').setName('Medida Producto');

module.exports = {MedidaProductoController}
