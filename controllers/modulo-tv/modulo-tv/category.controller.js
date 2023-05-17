const TVRouteBuilder = require('../../builder.controller')

const CategoryBuilder = new TVRouteBuilder();

const CategoryController = CategoryBuilder.setTable('stream_categorias').setName('Categoria')
  .setTimeStamps().setPagination();

module.exports = CategoryController
