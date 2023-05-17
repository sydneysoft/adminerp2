const RestBuilder = require('../../builder.controller');

const AcercaNosotroBuilder = new RestBuilder();

const AcercaNosotroController = AcercaNosotroBuilder.setTable('acerca_nosotros').setName('Acerca nosotros');

module.exports = {AcercaNosotroController}
