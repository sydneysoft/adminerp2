const TVRouteBuilder = require('../../builder.controller')

const VideoLiveBuilder = new TVRouteBuilder();

const VideoLiveController = VideoLiveBuilder.setTable('video_live').setName('Live')
  .setPagination();

module.exports = VideoLiveController