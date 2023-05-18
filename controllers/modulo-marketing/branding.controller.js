const RestBuilder = require('../builder-test.controller');

const {matchedData} = require("express-validator");

class BrandingController extends RestBuilder {
  constructor() {
    super();
    this.setTable('branding').setName('Brand')
      .setPagination();
  }

  renderHomeView = async (req, res) => {
    let view = "modulo-marketing/branding"
    let empresa_id = undefined;
    let data = [];
    try {
      const { dataSession, dataSistema, role, token } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        view += '/superadmin'
      } else if (role === 3) {
        empresa_id = token;
        data = await this.service.getbyCompany(empresa_id);
      }
  
      if (Array.isArray(data) && data.length === 0 && role !== 1) {
        await this.service.save({ empresa_id });
        data = await this.service.getbyCompany(empresa_id);
      }

      return res.render(view, {
        dataSession,
        dataSistema,
        empresa_id,
        data
      })

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
  renderSuperadminHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema } = await this.getAllDataSession(req);
      const { id } = req.params;

      if (typeof parseInt(id) !== 'number') {
        throw new Error('No se ha encontrado la empresa');
      }

      let datos = [];
      datos = await this.service.getbyCompany(id);

      if (Array.isArray(datos) && datos.length === 0) {
        await this.service.save({ empresa_id: id });
        datos = await this.service.getbyCompany(id);
      }

      return res.render('modulo-marketing/branding', {
        dataSession,
        dataSistema,
        empresa_id: id,
        data: datos
      })

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }


}


module.exports = {BrandingController};