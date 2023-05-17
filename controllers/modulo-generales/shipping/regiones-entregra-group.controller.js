const RestBuilder = require('../../builder.controller');

const RegionEntregaGrupoBuilder = new RestBuilder();

const RegionEntregaGrupoController = RegionEntregaGrupoBuilder.setTable('regiones_entrega_grupo').setName('Region entrega grupo');

module.exports = {RegionEntregaGrupoController}
