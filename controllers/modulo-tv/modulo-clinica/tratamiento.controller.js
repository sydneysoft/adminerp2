const RestBuilder = require('../../builder.controller')

const TratamientoBuilder = new RestBuilder();

// const TratamientoController = TratamientoBuilder.setTable('tratamientos').setName('Tratamiento')
//   .setPagination()

const TratamientoController = TratamientoBuilder.setTable('ce_tratamientos').setName('Tratamiento')
  .setPagination()

module.exports = {TratamientoController}