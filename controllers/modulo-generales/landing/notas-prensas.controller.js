const RestBuilder = require('../../builder.controller');

const NotaPrensaBuilder = new RestBuilder();

const NotaPrensaController = NotaPrensaBuilder.setTable('notas_prensa').setName('Nota prensa');

module.exports = {NotaPrensaController}
