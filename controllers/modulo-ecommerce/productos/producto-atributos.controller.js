const RestBuilder = require('../../builder.controller');

const ProductoAtributoBuilder = new RestBuilder();

const ProductoAtributoController = ProductoAtributoBuilder.setTable('producto_atributos').setName('Producto Atributo');

module.exports = {ProductoAtributoController}
