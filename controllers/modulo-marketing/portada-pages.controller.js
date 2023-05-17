const RestBuilder = require('../builder.controller');

const PortadaPageBuilder = new RestBuilder();

const PortadaPageController = PortadaPageBuilder.setTable('portada_pages').setName('Portada');

module.exports = {PortadaPageController}
