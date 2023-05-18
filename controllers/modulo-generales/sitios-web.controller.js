const RestBuilder = require('../builder-test.controller')

const { matchedData } = require("express-validator");

class SitioWebController extends RestBuilder {
  constructor() {
    super()
    this.setTable('sitios_web').setName('Sitio Web')
    .setTimeStamps();

  }


  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role, token } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-generales/sitios-web/superadmin', {
          dataSession,
          dataSistema
        });
      }

      let data = await this.service.getbyCompany(token);
      if (Array.isArray(data) && data.length == 0) {
        await this.service.save({ empresa_id: token });
        data = await this.service.getbyCompany(token);
      }

      return this.renderView(res, 'modulo-generales/sitios-web', {
        dataSession,
        dataSistema,
        data
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

      let data = []
      data = await this.service.getbyCompany(empresa_id);

      if (Array.isArray(data) && data.length == 0) {
        await this.service.save({ empresa_id });
        data = await this.service.getbyCompany(empresa_id);
      }

      return this.renderView(res, 'modulo-generales/sitios-web', {
        dataSession,
        dataSistema,
        data,
        empresa_id,
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }


  
}


module.exports = {SitioWebController}