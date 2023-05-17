const RestBuilder = require('../../builder.controller');

const AlianzaBuilder = new RestBuilder();

const AlianzaController = AlianzaBuilder.setTable('alianzas').setName('Alianza');

module.exports = {AlianzaController}
