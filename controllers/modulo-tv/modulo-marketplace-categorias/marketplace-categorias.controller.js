const RestBuilder = require('../../builder.controller')

const MarketplaceCategoriaBuilder = new RestBuilder();

const MarketplaceCategoriaController = MarketplaceCategoriaBuilder.setTable('marketplace_categorias').setName('Marketplace')
  .setTimeStamps();

module.exports = {MarketplaceCategoriaController}