const RestBuilder = require('../../builder.controller')

const MapBuilder = new RestBuilder();

const MapController = MapBuilder.setTable('google_maps').setName('Mapa')
  .setPagination();

module.exports = {MapController}