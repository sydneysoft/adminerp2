const RestBuilder = require('../../builder.controller');

const CotizacionImpuestoBuilder = new RestBuilder();

const CotizacionImpuestoController = CotizacionImpuestoBuilder.setTable('cotizaciones_impuestos').setName('Cotización Impuesto');

module.exports = {CotizacionImpuestoController}
