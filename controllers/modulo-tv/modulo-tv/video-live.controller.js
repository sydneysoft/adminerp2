const RestBuilder = require('../../builder.controller')

const VideoLiveBuilder = new RestBuilder();

const VideoLiveController = VideoLiveBuilder.setTable('video_live').setName('Video')
  .setPagination();

module.exports = {VideoLiveController}