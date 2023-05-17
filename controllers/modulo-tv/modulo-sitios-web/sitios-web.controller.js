const RestBuilder = require('../../builder.controller')

const SitioWebBuilder = new RestBuilder();

const SitioWebController = SitioWebBuilder.setTable('sitios_web').setName('Sitio Web')
  .setTimeStamps()
  .setPagination();

module.exports = {SitioWebController}