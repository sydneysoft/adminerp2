const RestBuilder = require('../builder.controller');

const PedidoProductoBuilder = new RestBuilder();

const PedidoProductoController = PedidoProductoBuilder.setTable('pedido_productos').setName('Pedido producto');

module.exports = {PedidoProductoController}
