const TVRouteBuilder = require('../../../builder.controller')

const DirectorBuilder = new TVRouteBuilder();

const DirectorController = DirectorBuilder.setTable('stream_directores').setName('Director')
  .setTimeStamps().setPagination()
  .setCreateView('modulo-video-prime/director/create')
  .setEditeView('modulo-video-prime/director/edite')
  .setShowView('modulo-video-prime/director/show')
  .setIndexView('modulo-video-prime/director/index');

module.exports = {DirectorController}