const RestBuilder = require('../builder-test.controller')

const { matchedData } = require("express-validator");

class VentanaEmergenteController extends RestBuilder {
  constructor() {
    super()
    this.setTable('ventanas_emergentes').setName('Ventana emergente')
    .setTimeStamps();
  }

  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role, token } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-generales/ventanas-emergentes/superadmin', {
          dataSession,
          dataSistema
        });
      }


      return this.renderView(res, 'modulo-generales/ventanas-emergentes', {
        dataSession,
        dataSistema,
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

      return this.renderView(res, 'modulo-generales/ventanas-emergentes', {
        dataSession,
        dataSistema,
        empresa_id
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
  
}


module.exports = {VentanaEmergenteController}