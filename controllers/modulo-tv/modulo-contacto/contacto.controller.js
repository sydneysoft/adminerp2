const RestBuilder = require('../../builder.controller')

const ContactoBuilder = new RestBuilder();

const ContactoController = ContactoBuilder.setTable('contactos').setName('Contacto')
  .setPagination()
  .setCreateView('modulo-tv/modulo-contacto/contacto/create')
  .setEditeView('modulo-tv/modulo-contacto/contacto/edite')
  .setShowView('modulo-tv/modulo-contacto/contacto/show')
  .setIndexView('modulo-tv/modulo-contacto/contacto/index');

module.exports = {ContactoController}