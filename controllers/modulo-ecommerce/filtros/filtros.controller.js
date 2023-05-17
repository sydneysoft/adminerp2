const RestBuilder = require('../../builder.controller');

const FiltroBuilder = new RestBuilder();

const FiltroController = FiltroBuilder.setTable('filtros').setName('Filtro');

module.exports = {FiltroController}
