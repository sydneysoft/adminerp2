const RestBuilder = require('../builder.controller');

const MarketplaceBuilder = new RestBuilder();

const MarketplaceController = MarketplaceBuilder.setTable('marketplace').setName('Marketplace')
  .setTimeStamps();

module.exports = {MarketplaceController}
