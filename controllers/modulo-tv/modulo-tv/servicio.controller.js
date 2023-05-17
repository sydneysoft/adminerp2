const TVRouteBuilder = require('../../builder.controller')

const ServiceBuilder = new TVRouteBuilder();

const ServiceController = ServiceBuilder.setTable('stream_servicios').setName('Servicio')
  .setTimeStamps().setPagination()
  .setCreateView('modulo-tv/modulo-tv/service/create')
  .setEditeView('modulo-tv/modulo-tv/service/edite')
  .setShowView('modulo-tv/modulo-tv/service/show')
  .setIndexView('modulo-tv/modulo-tv/service/index');

module.exports = ServiceController
