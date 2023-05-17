const RestBuilder = require('../../builder.controller');

const CategoriaBuilder = new RestBuilder();

const CategoriaController = CategoriaBuilder.setTable('blog_categorias').setName('Categoria')
  .setPagination().setTimeStamps();

module.exports = {CategoriaController}
