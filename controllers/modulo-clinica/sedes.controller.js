const RestBuilder = require('../builder-test.controller')

const { matchedData } = require("express-validator");

class SedeController extends RestBuilder {
  constructor() {
    super()
    this.setTable('sedes').setName('Sede')
    .setTimeStamps();
    this.horarios_atencion = this.setService("horarios_atencion");
  }

  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role, token } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-clinica/sedes/superadmin', {
          dataSession,
          dataSistema
        });
      }

      const horarios = await this.horarios_atencion.getbyCompany(token);

      return this.renderView(res, 'modulo-clinica/sedes', {
        dataSession,
        dataSistema,
        horarios,
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

      const auxHorarios = await this.horarios_atencion.getbyCompany(empresa_id);
      
      const horarios = auxHorarios.map((item) => {
        return {
          id: item.id,
          text: item.dia_de +'-'+ item.dia_a + ', ' + item.hora_de + '-'+ item.hora_a,
        }
      })
  
      return this.renderView(res, 'modulo-clinica/sedes', {
        dataSession,
        dataSistema,
        horarios,
        empresa_id
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
  
}


module.exports = {SedeController}