const RestBuilder = require('../../builder.controller')

const ListBuilder = new RestBuilder();

const ListController = ListBuilder.setTable('menu_lists').setName('Menu')
  .setTimeStamps();

module.exports = ListController