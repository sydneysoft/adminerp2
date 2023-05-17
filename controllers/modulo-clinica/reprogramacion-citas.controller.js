const RestBuilder = require('../builder-test.controller')

const { matchedData } = require("express-validator");

class ReprogramarCitaMedicaController extends RestBuilder {
  constructor() {
    super()
    this.setTable('reprogramacion_citas').setName('Reprogramacion Cita').setPagination()
    .setTimeStamps();
    this.citas = this.setService('citas');
  }


  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-clinica/reprogramacion-citas/superadmin', {
          dataSession,
          dataSistema
        });
      }
      return this.renderView(res, 'modulo-clinica/reprogramacion-citas', {
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

      return this.renderView(res, 'modulo-clinica/reprogramacion-citas', {
        dataSession,
        dataSistema,
        data,
        empresa_id
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  /**
   * Método que obtiene datos de una cita existente y genera una reprogramamción de esta.
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  apiReprogramarCita = async (req, res) => {
    try {
      const paramsData = matchedData(req, { locations: ['params'] });
      const bodyData = matchedData(req, { locations: ['body']});

      const data = await this.citas.getTable().where({ id: paramsData.id});

      if (Array.isArray(data) && data.length > 0) {
        const newData = {
          ...data[0],
          fechaCita: bodyData.fechaCita,
          horaInicio: bodyData.horaInicio, 
          horaFin: bodyData.horaFin,
          notas: bodyData.notas,
          tipoCita: bodyData.tipoCita,
          urgencia: bodyData.urgencia
        }

        const result = await this.service.save(newData);

        return this.successHandler({
          result,
        }, res, "Datos guardados correctamente");
      } else {
        res.status(404);
        throw Error("No se encontro la cita");
      }

    } catch (error) {
      return this.errorHandler(error, req, res, false);
    }
  }
  
}

module.exports = {ReprogramarCitaMedicaController}