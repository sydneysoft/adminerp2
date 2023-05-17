const RestBuilder = require('../builder-test.controller');

const {matchedData} = require("express-validator");

class PageSliderController extends RestBuilder {
  constructor() {
    super();
    this.setTable('page_sliders').setName('Slider')
      .setPagination();
  }

  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-marketing/page-sliders/superadmin', {
          dataSession,
          dataSistema
        });
      }

      return this.renderView(res, 'modulo-marketing/page-sliders', {
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

      return this.renderView(res, 'modulo-marketing/page-sliders', {
        dataSession,
        dataSistema,
        empresa_id
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderEditBySuperadmin = async (req, res) => {
    try {
      const { dataSession, dataSistema } = await this.getAllDataSession(req);
      const paramsData = matchedData(req, {locations: ['params']});
      const {empresa_id, id} = paramsData;
      const data = await this.service.getById(id);

      return this.renderView(res, 'modulo-marketing/page-sliders/superadmin-editar', {
        dataSession,
        dataSistema,
        empresa_id,
        data
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderCreateBySuperadmin = async (req, res) => {
    try {
      const { dataSession, dataSistema } = await this.getAllDataSession(req);
      const {empresa_id} = req.params;

      return this.renderView(res, 'modulo-marketing/page-sliders/superadmin-crear', {
        dataSession,
        dataSistema,
        empresa_id
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

}


module.exports = {PageSliderController}