const RestBuilder = require('../../builder.controller');

const CotizacionServicioBuilder = new RestBuilder();

const CotizacionServicioController = CotizacionServicioBuilder.setTable('cotizaciones_servicios').setName('Cotizacion servicio');

module.exports = {CotizacionServicioController}
