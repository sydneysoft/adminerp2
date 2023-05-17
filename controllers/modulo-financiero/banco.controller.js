const RestBuilder = require('../builder-test.controller');

const {matchedData} = require('express-validator');

let Country = require("country-state-city").Country;

class BancoController extends RestBuilder {
  constructor() {
    super();
    this.setTable('bancos').setName('Banco');
  }


  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-financiero/bancos/superadmin', {
          dataSession,
          dataSistema
        });
      }

      const stores = await this.service.getbyCompany(token);
      const countries = Country.getAllCountries();

      return this.renderView(res, 'modulo-financiero/bancos/admin-bancos', {
        dataSession,
        dataSistema,
        stores,
        countries
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

      
      const stores = await this.service.getbyCompany(req.params.id);
      const countries = Country.getAllCountries();

      return this.renderView(res, 'modulo-financiero/bancos', {
        dataSession,
        dataSistema,
        empresa_id,
        stores,
        countries
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

}



module.exports = {BancoController}
