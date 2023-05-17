const RestBuilder = require('../../builder.controller');

const SeccionConfiguracionBuilder = new RestBuilder();

const SeccionConfiguracionController = SeccionConfiguracionBuilder.setTable('secciones_configuracion').setName('Seccion configuracion');

module.exports = {SeccionConfiguracionController}
