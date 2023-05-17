const RestBuilder = require('../builder.controller');

const PagoPersonalBuilder = new RestBuilder();

const PagoPersonalController = PagoPersonalBuilder.setTable('pago_personal').setName('Pago personal');

module.exports = {PagoPersonalController}
