const RestBuilder = require('../builder-test.controller');

class CorteController extends RestBuilder {
  constructor() {
    super();
    this.setTable('barbershop_cortes').setName('Corte')
      .setPagination();
  }

  homeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-peluqueria/cortes/superadmin', {
          dataSession,
          dataSistema
        });
      }

      return this.renderView(res, 'modulo-peluqueria/cortes', {
        dataSession,
        dataSistema
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  superadminHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema } = await this.getAllDataSession(req);
      const empresa_id = req.params.id;

      return this.renderView(res, 'modulo-peluqueria/cortes', {
        dataSession,
        dataSistema,
        empresa_id
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

}



module.exports = {CorteController}