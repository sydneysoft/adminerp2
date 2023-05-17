const TVRouteBuilder = require('../../builder.controller')

const DirectorBuilder = new TVRouteBuilder();

const DirectorController = DirectorBuilder.setTable('stream_contactos').setName('Contacto')
  .setTimeStamps().setPagination()
  .setCreateView('modulo-tv/modulo-tv/contacto/create')
  .setEditeView('modulo-tv/modulo-tv/contacto/edite')
  .setShowView('modulo-tv/modulo-tv/contacto/show')
  .setIndexView('modulo-tv/modulo-tv/contacto/index');

module.exports = DirectorController