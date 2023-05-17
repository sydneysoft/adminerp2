const RestBuilder = require('../builder.controller');

const LibroReclamacionBuilder = new RestBuilder();

const LibroReclamacionController = LibroReclamacionBuilder.setTable('libro_reclamaciones').setName('Libro reclamacion');

module.exports = {LibroReclamacionController}
