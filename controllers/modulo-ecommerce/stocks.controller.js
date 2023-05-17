const RestBuilder = require('../builder.controller');

const StockBuilder = new RestBuilder();

const StockController = StockBuilder.setTable('stock').setName('Stock').notCompany();

module.exports = {StockController}
