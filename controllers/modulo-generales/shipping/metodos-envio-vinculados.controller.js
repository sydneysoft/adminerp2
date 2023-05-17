const RestBuilder = require('../../builder.controller');

const MetodoEnvioVicunladoBuilder = new RestBuilder();

const MetodoEnvioVicunladoController = MetodoEnvioVicunladoBuilder.setTable('metodos_envio_vinculados').setName('Metodo envio vinculado');

module.exports = {MetodoEnvioVicunladoController}
