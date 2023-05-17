const RestBuilder = require('../../builder.controller')

const ItemBuilder = new RestBuilder();

const ItemController = ItemBuilder.setTable('menu_items').setName('Item')
  .setTimeStamps();

module.exports = ItemController