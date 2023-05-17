const TVRouteBuilder = require('../../../builder.controller')

const SerieBuilder = new TVRouteBuilder();

const SerieController = SerieBuilder.setTable('stream_series').setName('Serie')
  .setTimeStamps().setPagination()
  .setCreateView('modulo-tv/modulo-video-prime/serie/create')
  .setEditeView('modulo-tv/modulo-video-prime/serie/edite')
  .setShowView('modulo-tv/modulo-video-prime/serie/show')
  .setIndexView('modulo-tv/modulo-video-prime/serie/index');

module.exports = {SerieController}
