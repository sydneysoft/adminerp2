const RestBuilder = require('../../builder.controller');

const FiltroProductoBuilder = new RestBuilder();

const FiltroProductoController = FiltroProductoBuilder.setTable('filtros_productos').setName('Filtro Producto');

module.exports = {FiltroProductoController}
