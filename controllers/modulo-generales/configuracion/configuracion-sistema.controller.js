const RestBuilder = require('../../builder.controller');

const ConfiguracionSitemaBuilder = new RestBuilder();

const ConfiguracionSitemaController = ConfiguracionSitemaBuilder.setTable('configuracion_sistema').setName('Configuracion Sistema');

module.exports = {ConfiguracionSitemaController}
