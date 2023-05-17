const RestBuilder = require('../../builder.controller')

const ClinicaBuilder = new RestBuilder();

const ClinicaController = ClinicaBuilder.setTable('configuracion_clinica').setName('Clinica')
  .setPagination();

module.exports = {ClinicaController}