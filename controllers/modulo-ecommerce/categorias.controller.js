const RestBuilder = require('../builder.controller');

const CategoriaBuilder = new RestBuilder();

const CategoriaController = CategoriaBuilder.setTable('categorias').setName('Categoria');

module.exports = {CategoriaController}
