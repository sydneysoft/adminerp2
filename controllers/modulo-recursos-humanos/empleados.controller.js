const RestBuilder = require('../builder.controller');

const EmpleadoBuilder = new RestBuilder();

const EmpleadoController = EmpleadoBuilder.setTable('empleados').setName('Empleado');

module.exports = {EmpleadoController}
