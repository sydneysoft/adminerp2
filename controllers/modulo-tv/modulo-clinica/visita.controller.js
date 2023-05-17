const RestBuilder = require('../../builder.controller')

const VisitaBuilder = new RestBuilder();

const VisitaController = VisitaBuilder.setTable('visitas_medicas').setName('Visita')
  .setPagination();

module.exports = {VisitaController}