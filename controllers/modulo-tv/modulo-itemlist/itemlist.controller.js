const RestBuilder = require('../../builder.controller')

const ItemListBuilder = new RestBuilder();

const ItemListController = ItemListBuilder.setTable('itemlist').setName('Item')

module.exports = {ItemListController}