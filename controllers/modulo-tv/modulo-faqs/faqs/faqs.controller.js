const RestBuilder = require('../../../builder.controller');

const FaqBuilder = new RestBuilder();

const FAQController = FaqBuilder.setTable('ce_faqs').setName('FAQ')
  .setPagination()
  .setCreateView('modulo-tv/modulo-faq/faq/create')
  .setEditeView('modulo-tv/modulo-faq/faq/edite')
  .setShowView('modulo-tv/modulo-faq/faq/show')
  .setIndexView('modulo-tv/modulo-faq/faq/index');

module.exports = {FAQController}