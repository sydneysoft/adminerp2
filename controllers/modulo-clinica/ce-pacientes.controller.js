const RestBuilder = require('../builder-test.controller')

const { matchedData } = require("express-validator");

class PacienteController extends RestBuilder {
  constructor() {
    super()
    this.setTable('ce_pacientes').setName('Paciente')
    .setTimeStamps();

    this.empresa_seguros = this.setService('empresa_seguros');
    this.configuracion_clinica = this.setService('configuracion_clinica');
    this.ce_pacientes = this.setService('ce_pacientes');
    this.citas = this.setService('citas');
    this.medicos = this.setService('medicos');
    this.especialidad = this.setService('especialidad');
    this.sedes = this.setService('sedes');
    this.reprogramacion_citas = this.setService('reprogramacion_citas');
  }


  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role, token } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-clinica/pacientes/superadmin', {
          dataSession,
          dataSistema
        });
      }

      const aseguradoras = await this.empresa_seguros.getTable().select(['id', 'nombre', 'empresa_id']).where('empresa_id', token);
  

      return this.renderView(res, 'modulo-clinica/pacientes', {
        dataSession,
        dataSistema,
        aseguradoras
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

      let pacientes = [];
      pacientes = await this.ce_pacientes.getbyCompany(empresa_id);
      const configuracion_clinica = await this.configuracion_clinica.getTable().whereIn('propiedad', [
        'tipo_documento',
        'sexo',
        'tipo_seguro',
        'estado_civil'
      ]);

      let tipo_documento = [];
      let sexo = [];
      let tipo_seguro = [];
      let estado_civil = [];

      if (Array.isArray(configuracion_clinica)) {
        for (let i = 0; i < configuracion_clinica.length; i++) {
          configuracion_clinica[i].valor = JSON.parse(configuracion_clinica[i].valor);
          switch (configuracion_clinica[i].propiedad) {
            case 'tipo_documento':
              tipo_documento.push(configuracion_clinica[i]);
              break;
            case 'sexo':
              sexo.push(configuracion_clinica[i]);
              break;
            case 'tipo_seguro':
              tipo_seguro.push(configuracion_clinica[i]);
              break;
            case 'estado_civil':
              estado_civil.push(configuracion_clinica[i]);
              break;
          }
        }
      }
    
      const aseguradoras = await this.empresa_seguros.getTable().select(['id', 'nombre', 'empresa_id']).where('empresa_id', empresa_id);
    

      return this.renderView(res, 'modulo-clinica/pacientes', {
        dataSession,
        dataSistema,
        empresa_id,
        pacientes,
        tipo_documento,
        sexo,
        tipo_seguro,
        estado_civil,
        aseguradoras
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderHistorialPaciente = async (req, res) => {
    try {
      const { role, token, dataSession, dataSistema } = await this.getAllDataSession(req);
      const paramsData = matchedData(req, {locations: ['params']});
      const id = paramsData.id;

      let pacientes = await this.service.getTable().where('id', id);
      const citas = await this.citas.getTable().where('idUser', id);

      let idProfesional = [];
      let idEspecialidad = [];
      let idSede = [];
      let idReprogramacion = [];
      if (Array.isArray(citas) && citas.length > 0) {
        idProfesional = citas.map(cita => cita.idProfesional);
        idEspecialidad = citas.map(cita => cita.idEspecialidad);
        idSede = citas.map(cita => cita.idSede);
        idReprogramacion = citas.map(cita => cita.id);

        idProfesional = idProfesional.filter((item, index) => idProfesional.indexOf(item) === index);
        idEspecialidad = idEspecialidad.filter((item, index) => idEspecialidad.indexOf(item) === index);
        idSede = idSede.filter((item, index) => idSede.indexOf(item) === index);
        idReprogramacion = idReprogramacion.filter((item, index) => idReprogramacion.indexOf(item) === index);
      }

      let profesionales = [];
      let especialidades = [];
      let sedes = [];
      let reprogramacion = []
      
      if (idProfesional.length > 0) {
        profesionales = await this.medicos.getTable().select(['id', 'primer_nombre as nombre']).whereIn('id', idProfesional);
      }
      
      if (idEspecialidad.length > 0) {
        especialidades = await this.especialidad.getTable().select(['id', 'nombre']).whereIn('id', idEspecialidad);
      }
      
      if (idSede.length > 0) {
        sedes = await this.sedes.getTable().select(['id', 'nombre', 'direccion']).whereIn('id', idSede);
      }
      
      if (idReprogramacion.length > 0) {
        reprogramacion = await this.reprogramacion_citas.getTable().whereIn('cita_id', idReprogramacion);
      }

      // El siguiente bloque recorre las citas y busca los match para idSede, idEspecialidad, idProfesional, isUser
      // y lo agrega al objeto cita, tambien repite lo mismo en el caso de reprogramacion
      if (Array.isArray(citas) && citas.length > 0) {
        for (let i = 0; i < citas.length; i++) {
          const cita = citas[i];
          const profesional = profesionales.find(prof => prof.id == cita.idProfesional);
          const especialidad = especialidades.find(esp => esp.id == cita.idEspecialidad);
          const sede = sedes.find(sed => sed.id == cita.idSede);
          const paciente = pacientes.find(pac => pac.id == cita.idUser);
          const reprogramacion_cita = reprogramacion.filter(rep => rep.cita_id == cita.id);

          if (profesional != undefined) {
            citas[i].profesional = profesional;
          } else {
            citas[i].profesional = { id: 0, nombre: 'No asignado' };
          }

          if (especialidad != undefined) {
            citas[i].especialidad = especialidad;
          } else {
            citas[i].especialidad = { id: 0, nombre: 'No asignado' };
          }

          if (sede != undefined) {
            citas[i].sede = sede;
          } else {
            citas[i].sede = { id: 0, nombre: 'No asignado' };
          }

          if (paciente != undefined) {
            citas[i].paciente = paciente;
          } else {
            citas[i].paciente = { id: 0, nombre: 'No asignado' };
          }

          if (Array.isArray(reprogramacion_cita) && reprogramacion_cita.length > 0) {

            for (let j = 0; j < reprogramacion_cita.length; j++) {
              const reprogramacion = reprogramacion_cita[j];
              const profesional_reprogramacion = profesionales.find(prof => prof.id == reprogramacion.idProfesional);
              const especialidad_reprogramacion = especialidades.find(esp => esp.id == reprogramacion.idEspecialidad);
              const sede_reprogramacion = sedes.find(sed => sed.id == reprogramacion.idSede);

              if (profesional_reprogramacion != undefined) {
                reprogramacion_cita[j].profesional = profesional_reprogramacion;
              } else {
                reprogramacion_cita[j].profesional = { id: 0, nombre: 'No asignado' };
              }

              if (especialidad_reprogramacion != undefined) {
                reprogramacion_cita[j].especialidad = especialidad_reprogramacion;
              } else {
                reprogramacion_cita[j].especialidad = { id: 0, nombre: 'No asignado' };
              }

              if (sede_reprogramacion != undefined) {
                reprogramacion_cita[j].sede = sede_reprogramacion;
              } else {
                reprogramacion_cita[j].sede = { id: 0, nombre: 'No asignado' };
              }
            }

            if (reprogramacion_cita) {
              citas[i].reprogramacion = reprogramacion_cita;
            } else {
              citas[i].reprogramacion = [];
            }
          }
        }
      }

      const configuracion_clinica = await this.configuracion_clinica.getTable().whereIn('propiedad', [
        'tipo_documento',
        'sexo',
        'tipo_seguro',
        'estado_civil'
      ]);
  
      let tipo_documento = []
      let sexo = []
      let tipo_seguro = []
      let estado_civil = []
  

      return this.renderView(res, "modulo-clinica/pacientes/historial", {
        dataSession,
        dataSistema,
        pacientes,
        empresa_id: id,
        citas
      });
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
  
}


module.exports = {PacienteController}