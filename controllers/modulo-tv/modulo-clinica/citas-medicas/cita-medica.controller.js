const RestBuilder = require('../../../builder.controller')

const CitaMedicaBuilder = new RestBuilder();

const CitaMedicaController = CitaMedicaBuilder.setTable('citas').setName('Cita Medica')
  .setPagination()
  .setIndexView('modulo-tv/modulo-citas-medicas/citas-medicas');

  module.exports = {CitaMedicaController}