const RestBuilder = require('../../builder.controller');

class ServicioMetodoController extends RestBuilder {
  constructor() {
    super();
    this.setTable('servicios_metodos').setName('Servicio metodo');
  }
}

module.exports = { ServicioMetodoController }
