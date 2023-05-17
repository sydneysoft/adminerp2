const TVRouteBuilder = require('../../../builder.controller')

const ProductorBuilder = new TVRouteBuilder();

const ProductorController = ProductorBuilder.setTable('stream_productores').setName('Productor')
  .setTimeStamps().setPagination()
  .setCreateView('modulo-video-prime/productor/create')
  .setEditeView('modulo-video-prime/productor/edite')
  .setShowView('modulo-video-prime/productor/show')
  .setIndexView('modulo-video-prime/productor/index');

module.exports = {ProductorController}