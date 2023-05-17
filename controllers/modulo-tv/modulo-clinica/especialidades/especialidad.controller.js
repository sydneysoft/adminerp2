const RestBuilder = require('../../../builder.controller')

const EspecialidadBuilder = new RestBuilder();

// const EspecialidadController = EspecialidadBuilder.setTable('Especialidads').setName('Especialidad')
//   .setPagination()

const EspecialidadController = EspecialidadBuilder.setTable('especialidad').setName('Especialidad')
  .setPagination().setTimeStamps();

module.exports = {EspecialidadController}