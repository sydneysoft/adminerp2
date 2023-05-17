const TVRouteBuilder = require('../../builder.controller')

const FAQBuilder = new TVRouteBuilder();

const FAQController = FAQBuilder.setTable('stream_faqs').setName('FAQ')
  .setTimeStamps().setPagination()
  .setCreateView('modulo-tv/modulo-tv/faq/create')
  .setEditeView('modulo-tv/modulo-tv/faq/edite')
  .setShowView('modulo-tv/modulo-tv/faq/show')
  .setIndexView('modulo-tv/modulo-tv/faq/index');

module.exports = FAQController
