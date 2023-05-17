const RestBuilder = require('../../../builder.controller')

const PacienteBuilder = new RestBuilder();

const PacienteController = PacienteBuilder.setTable('ce_pacientes').setName('Paciente')
  .setPagination()

module.exports = {PacienteController}