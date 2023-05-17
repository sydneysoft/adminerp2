const RestBuilder = require('../builder.controller');

class CatalogoController extends RestBuilder {
  constructor () {
    super();
    this.setTable('catalogos').setName('Catalogo');
  }
}

module.exports = {CatalogoController}
