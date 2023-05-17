const RestBuilder = require('../../builder.controller')

const ServicioBuilder = new RestBuilder();

const ServicioController = ServicioBuilder.setTable('ce_servicios').setName('Servicio')
  .setPagination()
  .setTimeStamps()
  .setCreateView('modulo-tv/modulo-ceservicio/servicio/create')
  .setEditeView('modulo-tv/modulo-ceservicio/servicio/edite')
  .setShowView('modulo-tv/modulo-ceservicio/servicio/show')
  .setIndexView('modulo-tv/modulo-ceservicio/servicio/index');

module.exports = {ServicioController}