const RestBuilder = require('../builder.controller');

const ProveedorBuilder = new RestBuilder();

const ProveedorController = ProveedorBuilder.setTable('proveedores').setName('Proveedor')
  .setTimeStamps();

module.exports = {ProveedorController}
