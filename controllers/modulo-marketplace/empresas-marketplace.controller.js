const RestBuilder = require('../builder.controller');

const EmpresaMarketplaceBuilder = new RestBuilder();

const EmpresaMarketplaceController = EmpresaMarketplaceBuilder.setTable('empresas_marketplace').setName('Empresa Marketplace')
  .setTimeStamps();

module.exports = {EmpresaMarketplaceController}
