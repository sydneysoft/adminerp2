const RestBuilder = require('../../builder.controller');

const FacturaProductoBuilder = new RestBuilder();

const FacturaProductoController = FacturaProductoBuilder.setTable('facturas_productos').setName('Factura Producto');

module.exports = {FacturaProductoController}
