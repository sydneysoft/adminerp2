const { Router, json } = require("express"), router = Router();
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { CitaMedicaController } = require('../../../controllers/modulo-tv/modulo-clinica/citas-medicas/cita-medica.controller');
const ServiceSQL = require('../../../services/services')
const { body, validationResult, oneOf, check } = require('express-validator');

const { service: citaService } = CitaMedicaController

const especialidadService = new ServiceSQL('especialidad');
const sedeService = new ServiceSQL('sedes');
const pacienteService = new ServiceSQL('ce_pacientes');
const medicoService = new ServiceSQL('medicos');
const ClinicaConfiguracion = new ServiceSQL('configuracion_clinica');
const ReprogramarCitaService = new ServiceSQL('reprogramacion_citas');

const { EVResult } = require('../../../middlewares/EVResult.middleware');
const { isAdminSuperAdminMiddleware } = require("../../../middlewares/modulo-tv/isAdmin");

router.get("/datatable/:id?",
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, CitaMedicaController.datatable);

router.get('/citas', CitaMedicaController.index);

router.post('/citas',
  check('idProfesional').optional().isNumeric().withMessage('El campo idProfesional debe ser un número'),
  check('idUser').optional().isNumeric().withMessage('El campo idUser debe ser un número'),
  check('idSede').optional().isNumeric().withMessage('El campo idSede debe ser un número'),
  check('idEspecialidad').optional().isNumeric().withMessage('El campo idEspecialidad debe ser un número'),
  check('fechaRegistro').optional().isDate().withMessage('El campo fechaRegistro debe ser una fecha'),
  check('fechaCita').optional().isDate().withMessage('El campo fechaCita debe ser una fecha'),
  check('dia').optional().isNumeric().withMessage('El campo dia debe ser un número'),
  check('hora').optional().isString().withMessage('El campo hora debe ser un número'),
  check('horaInicio').optional().isDate().withMessage('El campo horaInicio debe ser un número'),
  check('horaFin').optional().isDate().withMessage('El campo horaFin debe ser un número'),
  check('modulos').optional().isNumeric().withMessage('El campo modulos debe ser un número'),
  check('notas').optional().isString().withMessage('El campo notas debe ser un texto'),
  check('diagnostico').optional().isString().withMessage('El campo diagnostico debe ser un texto'),
  check('estado').optional().isString().withMessage('El campo estado debe ser un número'),
  check('urgencia').optional().isNumeric().withMessage('El campo urgencia debe ser un número'),
  check('tipoCita').optional().isString().withMessage('El campo tipoCita debe ser un número'),
  check('origen').optional().isNumeric().withMessage('El campo origen debe ser un número'),
  check('referencia_idProfesional').optional().isNumeric().withMessage('El campo referencia_idProfesional debe ser un número'),
  check('referencia_nombre').optional().isString().withMessage('El campo referencia_nombre debe ser un texto'),
  check('seguro').optional().isString().withMessage('El campo seguro debe ser un número'),
  check('nota').optional().isString().withMessage('El campo nota debe ser un texto'),
  check('color').optional().isString().withMessage('El campo color debe ser un texto'),
  check('precio').optional().isNumeric().withMessage('El campo precio debe ser un número'),
  check('id_tienda').optional().isNumeric().withMessage('El campo id_tienda debe ser un número'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, CitaMedicaController.save);

router.get('/citas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult,
  CitaMedicaController.show);

router.put('/citas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('idProfesional').optional().isNumeric().withMessage('El campo idProfesional debe ser un número'),
  check('idUser').optional().isNumeric().withMessage('El campo idUser debe ser un número'),
  check('idSede').optional().isNumeric().withMessage('El campo idSede debe ser un número'),
  check('idEspecialidad').optional().isNumeric().withMessage('El campo idEspecialidad debe ser un número'),
  check('fechaRegistro').optional().isDate().withMessage('El campo fechaRegistro debe ser una fecha'),
  check('fechaCita').optional().isDate().withMessage('El campo fechaCita debe ser una fecha'),
  check('dia').optional().isNumeric().withMessage('El campo dia debe ser un número'),
  check('hora').optional().isString().withMessage('El campo hora debe ser un número'),
  check('horaInicio').optional().isDate().withMessage('El campo horaInicio debe ser un número'),
  check('horaFin').optional().isDate().withMessage('El campo horaFin debe ser un número'),
  check('modulos').optional().isNumeric().withMessage('El campo modulos debe ser un número'),
  check('notas').optional().isString().withMessage('El campo notas debe ser un texto'),
  check('diagnostico').optional().isString().withMessage('El campo diagnostico debe ser un texto'),
  check('estado').optional().isString().withMessage('El campo estado debe ser un número'),
  check('urgencia').optional().isNumeric().withMessage('El campo urgencia debe ser un número'),
  check('tipoCita').optional().isString().withMessage('El campo tipoCita debe ser un número'),
  check('origen').optional().isNumeric().withMessage('El campo origen debe ser un número'),
  check('referencia_idProfesional').optional().isNumeric().withMessage('El campo referencia_idProfesional debe ser un número'),
  check('referencia_nombre').optional().isString().withMessage('El campo referencia_nombre debe ser un texto'),
  check('seguro').optional().isString().withMessage('El campo seguro debe ser un número'),
  check('nota').optional().isString().withMessage('El campo nota debe ser un texto'),
  check('color').optional().isString().withMessage('El campo color debe ser un texto'),
  check('precio').optional().isNumeric().withMessage('El campo precio debe ser un número'),
  check('id_tienda').optional().isNumeric().withMessage('El campo id_tienda debe ser un número'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, CitaMedicaController.update);

router.delete('/citas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult,
  CitaMedicaController.delete);


router.get('/', async (req, res) => {
  try {

    const { role, token, dataSistema, dataSession } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-clinica/citas-medicas/superadmin', {
        dataSession,
        dataSistema
      })
    }

    const data = await citaService.getbyCompany(token);

    // bloque para obtener pacientes y medicos
    let pacientes = [];
    let medicos = [];
    let sedes = [];
    let especialidades = [];


    pacientes = await pacienteService.getbyCompany(token);
    medicos = await medicoService.getbyCompany(token);
    sedes = await sedeService.getbyCompany(token);
    especialidades = await especialidadService.getbyCompany(token);

    let especialidadesData = especialidades;
    let sedesData = sedes;
    let pacientesData = pacientes;
    let medicosData = medicos;

    // bloque para crear las propiedades relacionadas
    for (let i = 0; i < data.length; i++) {

      for (let j = 0; j < especialidadesData.length; j++) {
        if (data[i].idEspecialidad === especialidadesData[j].id) {
          data[i].especialidad = especialidadesData[j]
        }
      }

      for (let j = 0; j < sedesData.length; j++) {
        if (data[i].idSede === sedesData[j].id) {
          data[i].sede = sedesData[j]
        }
      }

      for (let j = 0; j < pacientesData.length; j++) {
        if (data[i].idUser === pacientesData[j].id) {
          data[i].paciente = pacientesData[j]
        }
      }

      for (let j = 0; j < medicosData.length; j++) {
        if (data[i].idProfesional === medicosData[j].id) {
          data[i].doctor = medicosData[j]
        }
      }

      if (!data[i].paciente) {
        data[i].paciente = { id: 0, nombre: 'No asignado' }
      }

      if (!data[i].doctor) {
        data[i].doctor = { id: 0, nombre: 'No asignado' }
      }

      if (!data[i].sede) {
        data[i].sede = { id: 0, nombre: 'No asignado' }
      }

      if (!data[i].especialidad) {
        data[i].especialidad = { id: 0, nombre: 'No asignado' }
      }

    }


    // console.log(data);
    res.render('modulo-tv/modulo-clinica/citas-medicas/citas-medicas', {
      dataSession,
      dataSistema,
      // data,
      data: [],
      medicosData,
      sedesData,
      especialidadesData,
      pacientesData,
      pacientes,
      medicos,
      sedes,
      especialidades
    });
  } catch (error) {
    return catchError(res, error);
  }
});


router.get('/empresa/:id', isAdminSuperAdminMiddleware, 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult,
async (req, res) => {
  try {

    const { role, token, dataSistema, dataSession } = await getAllDataSession(req);

    const empresa_id = req.params.id;
    const data = await citaService.getbyCompany(empresa_id);


    // bloque para obtener pacientes y medicos
    let pacientes = [];
    let medicos = [];
    let sedes = [];
    let especialidades = [];

    pacientes = await pacienteService.getbyCompany(empresa_id);
    medicos = await medicoService.getbyCompany(empresa_id);
    sedes = await sedeService.getbyCompany(empresa_id);
    especialidades = await especialidadService.getbyCompany(empresa_id);

    let especialidadesData = especialidades;
    let sedesData = sedes;
    let pacientesData = pacientes;
    let medicosData = medicos;


    // bloque para crear las propiedades relacionadas
    for (let i = 0; i < data.length; i++) {

      for (let j = 0; j < especialidadesData.length; j++) {
        if (data[i].idEspecialidad === especialidadesData[j].id) {
          data[i].especialidad = especialidadesData[j]
        }
      }

      for (let j = 0; j < sedesData.length; j++) {
        if (data[i].idSede === sedesData[j].id) {
          data[i].sede = sedesData[j]
        }
      }

      for (let j = 0; j < pacientesData.length; j++) {
        if (data[i].idUser === pacientesData[j].id) {
          data[i].paciente = pacientesData[j]
        }
      }

      for (let j = 0; j < medicosData.length; j++) {
        if (data[i].idProfesional === medicosData[j].id) {
          data[i].doctor = medicosData[j]
        }
      }

      if (!data[i].paciente) {
        data[i].paciente = { id: 0, nombre: 'No asignado' }
      }

      if (!data[i].doctor) {
        data[i].doctor = { id: 0, nombre: 'No asignado' }
      }

      if (!data[i].sede) {
        data[i].sede = { id: 0, nombre: 'No asignado' }
      }

      if (!data[i].especialidad) {
        data[i].especialidad = { id: 0, nombre: 'No asignado' }
      }

    }



    // console.log(data);
    res.render('modulo-tv/modulo-clinica/citas-medicas/citas-medicas', {
      dataSession,
      dataSistema,
      medicosData,
      sedesData,
      especialidadesData,
      pacientesData,
      pacientes,
      medicos,
      sedes,
      especialidades,
      empresa_id
    });
  } catch (error) {
    return catchError(res, error);
  }
});


module.exports = router
