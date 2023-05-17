const TVRouteBuilder = require('../../builder.controller')

const ProductorBuilder = new TVRouteBuilder();

const ProductorController = ProductorBuilder.setTable('stream_productores').setName('Productor')
  .setTimeStamps().setPagination();


module.exports = {ProductorController}