const { MetodoEnvioController } = require("./metodos-envio.controller");
const { MetodoEnvioVicunladoController } = require("./metodos-envio-vinculados.controller");
const {RegionEntregaController} = require("./regiones-entrega.controller");
const {RegionEntregaGrupoController} = require("./regiones-entregra-group.controller");
const {PaisController} = require("./pais.controller");
const {CiudadController} = require("./ciudad.controller");
const {ServicioMetodoController} = require("./servicios-metodos.controller");
const {ServicioController} = require("./servicios.controller");

module.exports = {
  MetodoEnvioController,
  MetodoEnvioVicunladoController,
  RegionEntregaController,
  RegionEntregaGrupoController,
  PaisController, 
  CiudadController,
  ServicioMetodoController,
  ServicioController
}