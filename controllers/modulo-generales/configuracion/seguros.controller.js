const RestBuilder = require('../../builder-test.controller')

const { matchedData } = require("express-validator");

class SeguroController extends RestBuilder {
  constructor() {
    super()
    this.setTable('seguros').setName('Seguro')
    .setTimeStamps();
  }


  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-generales/configuracion/seguros/superadmin', {
          dataSession,
          dataSistema
        });
      }

      return this.renderView(res, 'modulo-generales/configuracion/seguros', {
        dataSession,
        dataSistema
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

      const data = await this.service.getbyCompany(empresa_id);

      return this.renderView(res, 'modulo-generales/configuracion/seguros', {
        dataSession,
        dataSistema,
        data,
        empresa_id
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
  
}

module.exports = {SeguroController}