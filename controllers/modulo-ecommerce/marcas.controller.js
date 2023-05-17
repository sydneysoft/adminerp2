const RestBuilder = require('../builder.controller');

const MarcaBuilder = new RestBuilder();

const MarcaController = MarcaBuilder.setTable('marcas').setName('Marca');

module.exports = {MarcaController}
