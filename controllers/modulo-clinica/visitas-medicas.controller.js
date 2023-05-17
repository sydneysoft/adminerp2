const RestBuilder = require('../builder-test.controller')

const { matchedData } = require("express-validator");

class VisitaMedicaController extends RestBuilder {
  constructor() {
    super()
    this.setTable('visitas_medicas').setName('Visita Medica')
    .setTimeStamps();
    // this.horarios_atencion = this.setService("horarios_atencion");
  }

  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role, token } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-clinica/visitas-medicas/superadmin', {
          dataSession,
          dataSistema
        });
      }

      const data = await this.service.getbyCompany(token);


      return this.renderView(res, 'modulo-clinica/visitas-medicas', {
        dataSession,
        dataSistema,
        data,
        empresa_id: token
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

      return this.renderView(res, 'modulo-clinica/visitas-medicas', {
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


module.exports = {VisitaMedicaController}