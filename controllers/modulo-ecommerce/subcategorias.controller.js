const RestBuilder = require('../builder.controller');

const SubcategoriaBuilder = new RestBuilder();

const SubcategoriaController = SubcategoriaBuilder.setTable('subcategorias').setName('Subcategoria');

module.exports = {SubcategoriaController}
