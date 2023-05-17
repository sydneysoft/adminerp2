const RestBuilder = require('../builder-test.controller');

const { matchedData } = require("express-validator");

class CeRedesController extends RestBuilder {
  constructor() {
    super();
    this.setTable('ce_redes').setName('Section').setPagination();
  }

  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-marketing/ce-redes/superadmin', {
          dataSession,
          dataSistema
        });
      }

      return this.renderView(res, 'modulo-marketing/ce-redes', {
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

      return this.renderView(res, 'modulo-marketing/ce-redes', {
        dataSession,
        dataSistema,
        empresa_id
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
}



module.exports = {CeRedesController}
