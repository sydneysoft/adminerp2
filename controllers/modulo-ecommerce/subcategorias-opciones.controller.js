
const RestBuilder = require('../builder.controller');

const SubcategoriaOpcionBuilder = new RestBuilder();

const SubcategoriaOpcionController = SubcategoriaOpcionBuilder.setTable('subcategorias_opciones').setName('Subcategoria opcion');

module.exports = {SubcategoriaOpcionController}
