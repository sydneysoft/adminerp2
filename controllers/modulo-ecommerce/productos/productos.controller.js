const RestBuilder = require('../../builder.controller');

const ProductoBuilder = new RestBuilder();

const ProductoController = ProductoBuilder.setTable('productos').setName('Producto')
  .setTimeStamps();

module.exports = {ProductoController}
