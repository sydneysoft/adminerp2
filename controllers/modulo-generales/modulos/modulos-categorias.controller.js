const RestBuilder = require('../../builder.controller');

const ModuloCategoriaBuilder = new RestBuilder();

const ModuloCategoriaController = ModuloCategoriaBuilder.setTable('modulos_categorias').setName('Modulo categoria').notCompany();

module.exports = {ModuloCategoriaController}
