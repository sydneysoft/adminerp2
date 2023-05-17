

const RestBuilder = require('../../builder.controller')

const EmpresaMarketplaceBuilder = new RestBuilder();

const EmpresaMarketplaceController = EmpresaMarketplaceBuilder.setTable('empresa_marketplace_categoria').setName('Empresa Marketplace Categoria')

module.exports = {EmpresaMarketplaceController}