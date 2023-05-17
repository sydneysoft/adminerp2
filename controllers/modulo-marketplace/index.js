const {EmpresaUsuarioController} = require('./empresa-usuarios.controller');
const {EmpresaCategoriaController} = require('./empresas-categorias.controller');
const {EmpresaMarketplaceController} = require('./empresas-marketplace.controller');
const {EmpresaRegistradaCategoriaController} = require('./empresas-registradas-categorias.controller');
const {MarketplaceController} = require('./marketplace.controller');


module.exports = {
  EmpresaUsuarioController,
  EmpresaCategoriaController,
  EmpresaMarketplaceController,
  EmpresaRegistradaCategoriaController,
  MarketplaceController
}