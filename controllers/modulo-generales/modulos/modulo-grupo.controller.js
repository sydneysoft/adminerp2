const RestBuilder = require('../../builder.controller');

const ModuloGrupoBuilder = new RestBuilder();

const ModuloGrupoController = ModuloGrupoBuilder.setTable('modulos_grupo').setName('Modulo Grupo');

module.exports = {ModuloGrupoController}
