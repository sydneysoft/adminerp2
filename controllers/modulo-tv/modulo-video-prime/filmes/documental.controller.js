const TVRouteBuilder = require('../../../builder.controller')

const DocumentalBuilder = new TVRouteBuilder();

const DocumentalController = DocumentalBuilder.setTable('stream_documentales').setName('Documental')
  .setTimeStamps().setPagination()
  .setCreateView('modulo-tv/modulo-video-prime/documental/create')
  .setEditeView('modulo-tv/modulo-video-prime/documental/edite')
  .setShowView('modulo-tv/modulo-video-prime/documental/show')
  .setIndexView('modulo-tv/modulo-video-prime/documental/index');

module.exports = {DocumentalController}
