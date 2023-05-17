const TVRouteBuilder = require('../../builder.controller')

const SliderBuilder = new TVRouteBuilder();

const SliderController = SliderBuilder.setTable('stream_sliders').setName('Slider')
  .setTimeStamps().setPagination()
  .setCreateView('modulo-tv/modulo-tv/slider/create')
  .setEditeView('modulo-tv/modulo-tv/slider/edite')
  .setShowView('modulo-tv/modulo-tv/slider/show')
  .setIndexView('modulo-tv/modulo-tv/slider/index');

module.exports = SliderController
