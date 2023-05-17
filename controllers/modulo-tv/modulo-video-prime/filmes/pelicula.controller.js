const TVRouteBuilder = require('../../../builder.controller')

const PeliculaBuilder = new TVRouteBuilder();

const PeliculaController = PeliculaBuilder.setTable('stream_peliculas').setName('Pelicula')
  .setTimeStamps().setPagination()
  .setCreateView('modulo-tv/modulo-video-prime/pelicula/create')
  .setEditeView('modulo-tv/modulo-video-prime/pelicula/edite')
  .setShowView('modulo-tv/modulo-video-prime/pelicula/show')
  .setIndexView('modulo-tv/modulo-video-prime/pelicula/index');

module.exports = {PeliculaController}
