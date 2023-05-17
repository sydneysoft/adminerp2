const RestBuilder = require('../../builder.controller');

const CotizacionDetallerBuilder = new RestBuilder();

const CotizacionDetallerController = CotizacionDetallerBuilder.setTable('cotizaciones_detalle').setName('Cotización Detalle');

module.exports = {CotizacionDetallerController}
