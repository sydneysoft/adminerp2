const { Router } = require("express"), router = Router();
const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers');
const ServiceSQL = require('../../../services/services')
const { body, validationResult, oneOf, check } = require('express-validator');
const {PacienteController} = require('../../../controllers/modulo-tv/modulo-clinica/pacientes/paciente.controller');

const {CitaMedicaController, MedicoController, SedeController, EspecialidadController, SeguroController} = require('../../../controllers/modulo-tv/modulo-clinica/clinica.controller');

const ConfiguracionClinica = new ServiceSQL('configuracion_clinica');
const ReprogramarCitaService = new ServiceSQL('reprogramacion_citas');

const { EVResult } = require('../../../middlewares/EVResult.middleware');

const { service: pacienteService } = PacienteController;
const { service: CitaMedicaService } = CitaMedicaController;
const { service: MedicoService } = MedicoController;
const { service: SedeService } = SedeController;
const { service: EspecialidadService } = EspecialidadController;
const { service: SeguroService } = SeguroController;


router.get('/datatable/:id?',
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, PacienteController.datatable);

router.get('/pacientes', PacienteController.index);

router.post('/pacientes', 
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('apellido_paterno').optional().isString().withMessage('El campo apellido_paterno debe ser un string'),
check('apellido_materno').optional().isString().withMessage('El campo apellido_materno debe ser un string'),
check('fecha_nacimiento').optional().isDate().withMessage('El campo fecha_nacimiento debe ser una fecha'),
check('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
check('nota').optional().isString().withMessage('El campo nota debe ser un string'),
check('diagnostico').optional().isString().withMessage('El campo diagnostico debe ser un string'),
check('identificador').optional().isString().withMessage('El campo identificador debe ser un string'),
check('dni').optional().isString().withMessage('El campo dni debe ser un string'),
check('numero_documento').optional().isString().withMessage('El campo numero_documento debe ser un string'),
check('tipo_documento').optional().isString().withMessage('El campo tipo_documento debe ser un string'),
check('tipo_seguro').optional().isString().withMessage('El campo tipo_seguro debe ser un string'),
check('nombre_seguro').optional().isString().withMessage('El campo nombre_seguro debe ser un string'),
check('numero_seguro').optional().isString().withMessage('El campo numero_seguro debe ser un string'),
check('sexo').optional().isString().withMessage('El campo sexo debe ser un string'),
check('estado_civil').optional().isString().withMessage('El campo estado_civil debe ser un string'),
check('celular').optional().isString().withMessage('El campo celular debe ser un string'),
check('pais').optional().isString().withMessage('El campo pais debe ser un string'),
check('correo').optional().isEmail().withMessage('El campo correo debe ser un email'),
check('clave').optional().isString().withMessage('El campo clave debe ser un string'),
check('Tag_VieneDeApp').optional().isNumeric().withMessage('El campo Tag_VieneDeApp debe ser un numero'),
check('token').optional().isString().withMessage('El campo token debe ser un string'),
check('status').optional().isString().withMessage('El campo status debe ser un string'),
check('empresa_id').optional().isInt({min: 1}).withMessage('El campo empresa_id debe ser un entero'),
EVResult,
PacienteController.save);

router.get('/pacientes/:id', 
check('id').isNumeric().withMessage('El campo id debe ser un entero'),
EVResult,
PacienteController.show);

router.put('/pacientes/:id', 
check('id').isNumeric().withMessage('El campo id debe ser un entero'),
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('apellido_paterno').optional().isString().withMessage('El campo apellido_paterno debe ser un string'),
check('apellido_materno').optional().isString().withMessage('El campo apellido_materno debe ser un string'),
check('fecha_nacimiento').optional().isDate().withMessage('El campo fecha_nacimiento debe ser una fecha'),
check('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
check('nota').optional().isString().withMessage('El campo nota debe ser un string'),
check('diagnostico').optional().isString().withMessage('El campo diagnostico debe ser un string'),
check('identificador').optional().isString().withMessage('El campo identificador debe ser un string'),
check('dni').optional().isString().withMessage('El campo dni debe ser un string'),
check('numero_documento').optional().isString().withMessage('El campo numero_documento debe ser un string'),
check('tipo_documento').optional().isString().withMessage('El campo tipo_documento debe ser un string'),
check('tipo_seguro').optional().isString().withMessage('El campo tipo_seguro debe ser un string'),
check('nombre_seguro').optional().isString().withMessage('El campo nombre_seguro debe ser un string'),
check('numero_seguro').optional().isString().withMessage('El campo numero_seguro debe ser un string'),
check('sexo').optional().isString().withMessage('El campo sexo debe ser un string'),
check('estado_civil').optional().isString().withMessage('El campo estado_civil debe ser un string'),
check('celular').optional().isString().withMessage('El campo celular debe ser un string'),
check('pais').optional().isString().withMessage('El campo pais debe ser un string'),
check('correo').optional().isEmail().withMessage('El campo correo debe ser un email'),
check('clave').optional().isString().withMessage('El campo clave debe ser un string'),
check('Tag_VieneDeApp').optional().isNumeric().withMessage('El campo Tag_VieneDeApp debe ser un numero'),
check('token').optional().isString().withMessage('El campo token debe ser un string'),
check('status').optional().isString().withMessage('El campo status debe ser un string'),
check('empresa_id').optional().isInt({min: 1}).withMessage('El campo empresa_id debe ser un entero'),
EVResult,PacienteController.update);

router.delete('/pacientes/:id', 
check('id').isNumeric().withMessage('El campo id debe ser un entero'),
EVResult,
PacienteController.delete)


router.get('/', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-clinica/paciente/superadmin', {
        dataSession,
        dataSistema,
      });

    }
    const aseguradoras = await SeguroService.getTable().select(['id', 'nombre', 'empresa_id']).where('empresa_id', token);

    res.render('modulo-tv/modulo-clinica/citas-medicas/pacientes', {
      dataSession,
      dataSistema,
      aseguradoras
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);
    const id = req.params.id;


    let pacientes = [];
    pacientes = await pacienteService.getbyCompany(id);
    const configuracion_clinica = await ConfiguracionClinica.getTable().whereIn('propiedad', [
      'tipo_documento',
      'sexo',
      'tipo_seguro',
      'estado_civil'
    ]);

    let tipo_documento = []
    let sexo = []
    let tipo_seguro = []
    let estado_civil = []

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

    const aseguradoras = await SeguroService.getTable().select(['id', 'nombre', 'empresa_id']).where('empresa_id', id);

    res.render('modulo-tv/modulo-clinica/paciente/empresa', {
      dataSession,
      dataSistema,
      pacientes,
      tipo_documento,
      sexo,
      tipo_seguro,
      estado_civil,
      empresa_id: id,
      aseguradoras
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/historial/:id', 
check('id').isNumeric().withMessage('El campo id debe ser un entero'),
EVResult,
async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);
    const id = req.params.id;

    let pacientes = [];
    pacientes = await pacienteService.getTable().where('id', id);


    const citas = await CitaMedicaService.getTable().where('idUser', id);

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
      profesionales = await MedicoService.getTable().select(['id', 'nombre']).whereIn('id', idProfesional);
    }
    
    if (idEspecialidad.length > 0) {
      especialidades = await EspecialidadService.getTable().select(['id', 'nombre']).whereIn('id', idEspecialidad);
    }
    
    if (idSede.length > 0) {
      sedes = await SedeService.getTable().select(['id', 'nombre', 'direccion']).whereIn('id', idSede);
    }
    
    if (idReprogramacion.length > 0) {
      reprogramacion = await ReprogramarCitaService.getTable().whereIn('cita_id', idReprogramacion);
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

    
    const configuracion_clinica = await ConfiguracionClinica.getTable().whereIn('propiedad', [
      'tipo_documento',
      'sexo',
      'tipo_seguro',
      'estado_civil'
    ]);

    let tipo_documento = []
    let sexo = []
    let tipo_seguro = []
    let estado_civil = []

    console.log(pacientes);

    res.render('modulo-tv/modulo-clinica/paciente/historial', {
      dataSession,
      dataSistema,
      pacientes,
      empresa_id: id,
      citas
    })
  } catch (error) {
    return catchError(res, error);
  }
});

module.exports = router