const RestBuilder = require('../../builder.controller')

const InfoContactoBuilder = new RestBuilder();

const FormularioContactoController = InfoContactoBuilder.setTable('formulario_contactos').setName('Formulario de Contacto');

module.exports = {FormularioContactoController}
