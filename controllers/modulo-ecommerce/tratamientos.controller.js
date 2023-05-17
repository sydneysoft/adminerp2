const RestBuilder = require('../builder.controller');

const TratamientoBuilder = new RestBuilder();

const TratamientoController = TratamientoBuilder.setTable('tratamientos').setName('Tratamiento');

module.exports = {TratamientoController}
