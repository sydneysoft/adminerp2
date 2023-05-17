const RestBuilder = require('../../builder.controller');

const CotizacionClienteBuilder = new RestBuilder();

const CotizacionClienteController = CotizacionClienteBuilder.setTable('cotizaciones_clientes').setName('Cotización Cliente');

module.exports = {CotizacionClienteController}
