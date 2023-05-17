const RestBuilder = require('../builder.controller');

const PedidoBuilder = new RestBuilder();

const PedidoController = PedidoBuilder.setTable('pedidos').setName('Pedido');

module.exports = {PedidoController}
