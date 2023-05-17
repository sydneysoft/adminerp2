
const RestBuilder = require('../builder.controller');

const ProductoGrupoMediaBuilder = new RestBuilder();

const ProductoGrupoMediaController = ProductoGrupoMediaBuilder.setTable('productos_grupo_media').setName('Producto grupo media');

module.exports = {ProductoGrupoMediaController}
