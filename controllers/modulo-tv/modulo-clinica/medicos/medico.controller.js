const RestBuilder = require('../../../builder.controller')

const MedicoBuilder = new RestBuilder();

const MedicoController = MedicoBuilder.setTable('medicos').setName('Medico')
  .setPagination();

module.exports = {MedicoController}