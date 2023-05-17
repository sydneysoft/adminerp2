const RestBuilder = require('../../builder.controller');

const CotizacionBuilder = new RestBuilder();

const CotizacionController = CotizacionBuilder.setTable('cotizaciones').setName('Cotizacion');

module.exports = {CotizacionController}
