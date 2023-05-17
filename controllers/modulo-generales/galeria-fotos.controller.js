const RestBuilder = require('../builder.controller');

const GaleriaFotoBuilder = new RestBuilder();

const GaleriaFotoController = GaleriaFotoBuilder.setTable('galeria_fotos').setName('Galeria fotos');

module.exports = {GaleriaFotoController}
