const TVRouteBuilder = require('../../builder.controller')

const DirectorBuilder = new TVRouteBuilder();

const DirectorController = DirectorBuilder.setTable('stream_directores').setName('Director')
  .setTimeStamps().setPagination();


module.exports = {DirectorController}