const {FacturaProductoController} = require('./facturas-productos.controller');
const {FiltroProductoController} = require('./filtros-productos.controller');
const {MedidaProductoController} = require('./medida-productos.controller');
const {PedidoProductoController} = require('./pedido-productos.controller');
const {ProductoAtributoController} = require('./producto-atributos.controller');
const {ProductoCaracteristicaController} = require('./producto-caracteristicas.controller');
const {ProductoPaqueteController} = require('./producto-paquetes.controller');
const {ProductoController} = require('./productos.controller');
const {StockController} = require('./stock.controller');

module.exports = {
  FacturaProductoController,
  FiltroProductoController,
  MedidaProductoController,
  PedidoProductoController,
  ProductoAtributoController,
  ProductoCaracteristicaController,
  ProductoPaqueteController,
  ProductoController,
  StockController
}

