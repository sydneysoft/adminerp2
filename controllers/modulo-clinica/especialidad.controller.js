const RestBuilder = require('../builder-test.controller')

const { matchedData } = require("express-validator");

class EspecialidadController extends RestBuilder {
  constructor() {
    super()
    this.setTable('especialidad').setName('Especialidad')
    .setTimeStamps();
    this.sedes = this.setService('sedes');
  }


  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role, token } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-clinica/especialidades/superadmin', {
          dataSession,
          dataSistema
        });
      }

      const sedes = await this.sedes.getTable().select(['id', 'nombre']).where('empresa_id', token);

      return this.renderView(res, 'modulo-clinica/especialidades', {
        dataSession,
        dataSistema,
        sedes,
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

      const sedes = await this.sedes.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);


      return this.renderView(res, 'modulo-clinica/especialidades', {
        dataSession,
        dataSistema,
        sedes,
        empresa_id
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
  
}


module.exports = {EspecialidadController}