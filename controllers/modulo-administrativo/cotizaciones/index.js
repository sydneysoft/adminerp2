const {CotizacionClienteController} = require('./cotizaciones-clientes.controller');
const {CotizacionServicioController} = require('./cotizaciones-servicios.controller');
const {CotizacionDetallerController} = require('./cotizaciones-detalle.controller');
const {CotizacionImpuestoController} = require('./cotizaciones-impuesto.controller');
const {CotizacionController} = require('./cotizaciones.controller');

module.exports = {
  CotizacionClienteController,
  CotizacionServicioController,
  CotizacionDetallerController,
  CotizacionImpuestoController,
  CotizacionController
}