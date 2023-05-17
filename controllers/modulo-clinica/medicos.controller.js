const RestBuilder = require('../builder-test.controller')

const { matchedData } = require("express-validator");

class MedicoController extends RestBuilder {
  constructor() {
    super()
    this.setTable('medicos').setName('Medico')
    .setTimeStamps();
    this.especialidad = this.setService('especialidad');
    this.configuracion_clinica = this.setService('configuracion_clinica');
    this.uploads = this.setService('uploads');
  }


  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-clinica/medicos/superadmin', {
          dataSession,
          dataSistema
        });
      }

      const medicos = await this.service.getbyCompany(token);
  
      const tipo_documento = await this.configuracion_clinica.getByColumn({column: 'propiedad', value: 'tipo_documento'});
  
      if (Array.isArray(tipo_documento)) {
        for (let i = 0; i < tipo_documento.length; i++) {
          tipo_documento[i].valor = JSON.parse(tipo_documento[i].valor);
        }
      }
  
      const especialidades = await this.especialidad.getTable().select(['id', 'nombre']).where('empresa_id',token).orderBy('nombre', 'asc');
  

      return this.renderView(res, 'modulo-clinica/medicos', {
        dataSession,
        dataSistema,
        medicos,
        tipo_documento,
        especialidades
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

      let medicos = [];      
      medicos = await this.service.getbyCompany(empresa_id);
  
      const tipo_documento = await this.configuracion_clinica.getByColumn({column: 'propiedad', value: 'tipo_documento'});
  
      if (Array.isArray(tipo_documento)) {
        for (let i = 0; i < tipo_documento.length; i++) {
          tipo_documento[i].valor = JSON.parse(tipo_documento[i].valor);
        }
      }
  
      const especialidades =  await this.especialidad.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);
  
      return this.renderView(res, 'modulo-clinica/medicos', {
        dataSession,
        dataSistema,
        empresa_id,
        medicos,
        tipo_documento,
        especialidades
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  apiUploadFile = async (req, res) => {
    try {
      
      const { dataSession, dataSistema } = await this.getAllDataSession(req);

      file = req.file;
      const empresa_id = req.query.empresa_id;
      let auxData = {
        nombre: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      }
      if (empresa_id) {
        auxData.empresa_id = empresa_id;
      }
      const cv = await this.uploads.save(auxData);

      res.json({
        ok: true,
        msg: 'Archivo subido con éxito',
        data: {
          file: file.path
        }
      })
    } catch (error) {
      if (file) {
        await this.uploads.deleteBy().where('nombre', file.filename);
      }
      return this.errorHandler(error, req, res, false);
    }
  }
  
}


module.exports = {MedicoController}