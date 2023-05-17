const RestBuilder = require('../builder.controller');

const GrupoFiltroBuilder = new RestBuilder();

const GrupoFiltroController = GrupoFiltroBuilder.setTable('grupo_filtro').setName('Grupo Filtro');

module.exports = {GrupoFiltroController}
