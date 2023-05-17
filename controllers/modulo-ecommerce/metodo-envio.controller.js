const RestBuilder = require('../builder.controller');

const MetodoEnvioBuilder = new RestBuilder();

const MetodoEnvioController = MetodoEnvioBuilder.setTable('metodos_envio').setName('Metodo envio');

module.exports = {MetodoEnvioController}
