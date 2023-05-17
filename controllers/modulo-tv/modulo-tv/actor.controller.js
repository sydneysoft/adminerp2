const TVRouteBuilder = require('../../builder.controller')

const ActorBuilder = new TVRouteBuilder();

const ActorController = ActorBuilder.setTable('stream_actores').setName('Actor')
  .setTimeStamps().setPagination();


module.exports = {ActorController}