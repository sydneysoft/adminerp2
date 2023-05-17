const TVRouteBuilder = require('../../../builder.controller');

const ActorBuilder = new TVRouteBuilder();

const ActorController = ActorBuilder.setTable('stream_actores').setName('Actor')
  .setTimeStamps().setPagination()
  .setCreateView('modulo-video-prime/actor/create')
  .setEditeView('modulo-video-prime/actor/edite')
  .setShowView('modulo-video-prime/actor/show')
  .setIndexView('modulo-video-prime/actor/index');

module.exports = {ActorController}