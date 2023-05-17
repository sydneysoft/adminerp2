const TVRouteBuilder = require('../../builder.controller')

const ThumbnailBuilder = new TVRouteBuilder();
const ThumbnailController = ThumbnailBuilder.setTable('stream_thumbnails').setName('Thumbnail')
  .setTimeStamps().setPagination();

module.exports = ThumbnailController