const RestBuilder = require('../builder.controller');

const PagoProveedorBuilder = new RestBuilder();

const PagoProveedorController = PagoProveedorBuilder.setTable('pago_proveedores').setName('PagoProveedor')
  .setTimeStamps();

module.exports = {PagoProveedorController}
