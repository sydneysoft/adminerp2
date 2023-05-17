const RestBuilder = require('../../builder.controller');

const ConfiguracionCorreoBuilder = new RestBuilder();

const ConfiguracionCorreoController = ConfiguracionCorreoBuilder.setTable('configuracion_correos').setName('Configuracion Correo');

module.exports = {ConfiguracionCorreoController}
