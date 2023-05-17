const RestBuilder = require('../../../builder.controller')

const DocumentoBuilder = new RestBuilder();

const DocumentoController = DocumentoBuilder.setTable('documento_medicos').setName('Documento')
  .setPagination()


module.exports = {DocumentoController}