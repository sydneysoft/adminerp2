const RestBuilder = require('../../builder.controller')

const InfoContactoBuilder = new RestBuilder();

const InfoContactoController = InfoContactoBuilder.setTable('informacion_contactos').setName('Informaciín de Contacto');

module.exports = {InfoContactoController}
