const TVRouteBuilder = require('../../builder.controller')

const GeneroBuilder = new TVRouteBuilder();

const GeneroController = GeneroBuilder.setTable('stream_generos').setName('Genero')
  .setTimeStamps().setPagination()
  .setCreateView('modulo-tv/modulo-tv/genero/create')
  .setEditeView('modulo-tv/modulo-tv/genero/edite')
  .setShowView('modulo-tv/modulo-tv/genero/show')
  .setIndexView('modulo-tv/modulo-tv/genero/index');

module.exports = GeneroController
