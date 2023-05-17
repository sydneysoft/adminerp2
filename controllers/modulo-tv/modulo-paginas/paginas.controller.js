const RestBuilder = require('../../builder.controller')

const PaginaBuilder = new RestBuilder();

const PaginaController = PaginaBuilder.setTable('paginas').setName('Página')
  .setPagination()
  .setTimeStamps()
  .setCreateView('modulo-tv/modulo-paginas/pagina/create')
  .setEditeView('modulo-tv/modulo-paginas/pagina/edite')
  .setShowView('modulo-tv/modulo-paginas/pagina/show')
  .setIndexView('modulo-tv/modulo-paginas/pagina/index');

module.exports = {PaginaController}