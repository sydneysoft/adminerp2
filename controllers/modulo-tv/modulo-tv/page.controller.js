const TVRouteBuilder = require('../../builder.controller')

const PageBuilder = new TVRouteBuilder();

const PageController = PageBuilder.setTable('stream_pages').setName('Página')
  .setTimeStamps().setPagination()
  .setCreateView('modulo-tv/modulo-tv/page/create')
  .setEditeView('modulo-tv/modulo-tv/page/edite')
  .setShowView('modulo-tv/modulo-tv/page/show')
  .setIndexView('modulo-tv/modulo-tv/page/index');

module.exports = PageController
