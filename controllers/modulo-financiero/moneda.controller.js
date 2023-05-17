const RestBuilder = require('../builder-test.controller');

const {matchedData} = require('express-validator');


class MonedaController extends RestBuilder {
  constructor() {
    super();
    this.setTable('monedas').setName('Moneda').setTimeStamps();
  }

  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-financiero/monedas/superadmin', {
          dataSession,
          dataSistema
        });
      }

      return this.renderView(res, 'modulo-financiero/monedas', {
        dataSession,
        dataSistema,
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderSuperadminHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema } = await this.getAllDataSession(req);
      const paramsData = matchedData(req, {locations: ['params']});
      const empresa_id = paramsData.id;

      return this.renderView(res, 'modulo-financiero/monedas', {
        dataSession,
        dataSistema,
        empresa_id,
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

}



module.exports = { MonedaController }
