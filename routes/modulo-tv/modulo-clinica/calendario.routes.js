const { Router, json } = require("express"), router = Router();
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { CitaMedicaController } = require('../../../controllers/modulo-tv/modulo-clinica/citas-medicas/cita-medica.controller');

const { isSuperAdminMiddleware, isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin')
const ServiceSQL = require('../../../services/services')
const { body, validationResult, oneOf, check } = require('express-validator');
const { EVResult } = require("../../../middlewares/EVResult.middleware");

const { service: citaService } = CitaMedicaController

const especialidadService = new ServiceSQL('especialidad');
const sedeService = new ServiceSQL('sedes');
const pacienteService = new ServiceSQL('ce_pacientes');
const medicoService = new ServiceSQL('medicos');
const ClinicaConfiguracion = new ServiceSQL('configuracion_clinica');
const ReprogramarCitaService = new ServiceSQL('reprogramacion_citas');


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
  EVResult,
  CitaMedicaController.update);

router.delete('/citas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult,
  CitaMedicaController.delete);


router.get('/calendario/data', async (req, res) => {
  try {

    let data = [];

    if (req.query.start && req.query.end) {
      data = await citaService.getTable().whereBetween('fechaCita', [req.query.start, req.query.end])
    }

    console.log(data);
    // data = await citaService.getAll();

    // Bloque para obtener los datos de las tablas relacionadas
    let idEspecialidades = []
    let idSedes = []
    let idPacientes = []
    let idMedicos = []
    if (Array.isArray(data)) {
      idEspecialidades = data.map(item => item.idEspecialidad);
      idSedes = data.map(item => item.idSede);
      idPacientes = data.map(item => item.idUser);
      idMedicos = data.map(item => item.idProfesional);

      idEspecialidades = idEspecialidades.filter((item, index) => idEspecialidades.indexOf(item) == index);
      idSedes = idSedes.filter((item, index) => idSedes.indexOf(item) == index);
      idPacientes = idPacientes.filter((item, index) => idPacientes.indexOf(item) == index);
      idMedicos = idMedicos.filter((item, index) => idMedicos.indexOf(item) == index);
    }

    let especialidadesData = await especialidadService.getTable().select(['id', 'nombre']).whereIn('id', idEspecialidades);
    let sedesData = await sedeService.getTable().select(['id', 'nombre']).whereIn('id', idSedes);
    let pacientesData = await pacienteService.getTable().select(['id', 'nombre']).whereIn('id', idPacientes);
    let medicosData = await medicoService.getTable().select(['id', 'primer_nombre']).whereIn('id', idMedicos);
    // console.log(especialidadesData, sedesData, pacientesData, medicosData)


    // bloque para crear las propiedades relacionadas
    for (let i = 0; i < data.length; i++) {

      for (let j = 0; j < especialidadesData.length; j++) {
        if (data[i].idEspecialidad == especialidadesData[j].id) {
          data[i].especialidad = especialidadesData[j]
        }
      }

      for (let j = 0; j < sedesData.length; j++) {
        if (data[i].idSede == sedesData[j].id) {
          data[i].sede = sedesData[j]
        }
      }

      for (let j = 0; j < pacientesData.length; j++) {
        if (data[i].idUser == pacientesData[j].id) {
          data[i].paciente = pacientesData[j]
        }
      }

      for (let j = 0; j < medicosData.length; j++) {
        if (data[i].idProfesional == medicosData[j].id) {
          data[i].doctor = medicosData[j]
        }
      }

    }

    // bloque para los eventos en el calendario
    let calendar = []
    if (Array.isArray(data)) {
      calendar = data.map(item => {
        // console.log(item)
        return ({
          id: item.id,
          title: item.paciente ? item.paciente.nombre : 'Sin nombre',
          start: new Date(item.fechaCita).toISOString().slice(0, 10) + "T" + item.horaInicio,
          end: new Date(item.fechaCita).toISOString().slice(0, 10) + "T" + item.horaFin,
          color: item.color,
          allDay: false,
          overlap: false,
          data: item
        });
      })
    }
    // console.log(calendar);
    return res.json(calendar);
    // return res.json({
    //   ok: true,
    //   data: calendar
    // })
  } catch (error) {
    return catchError(res, error);
  }
})

router.post('/cita', oneOf([
  check('doctor').not().isEmpty().withMessage('El doctor es requerido'),
  check('paciente').not().isEmpty().withMessage('El paciente es requerido'),
  check('tipoCita').not().isEmpty().withMessage('El tipo de cita es requerido'),
  check('especialidad').not().isEmpty().withMessage('La especialidad es requerida'),
  check('estado').not().isEmpty().withMessage('El estado es requerido'),
  check('fecha').not().isEmpty().withMessage('La fecha es requerida'),
  check('hora').not().isEmpty().withMessage('La hora es requerida'),
  check('precio').not().isEmpty().withMessage('El precio es requerido'),
  check('sede').not().isEmpty().withMessage('La sede es requerida'),
  check('color').not().isEmpty().withMessage('El color es requerido'),
  check('empresa_id').not().exists().withMessage('La empresa es requerida'),
  check('nota').not().isEmpty().withMessage('La nota es requerida'),
]), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { doctor, paciente, tipoCita, estado, fecha, horaInicio: hora, precio, sede, color, especialidad, nota } = req.body
    const empresa_id = req.body.empresa_id;

    // El siguiente bloque de codigo es para calcular la hora de fin de la cita
    const today = (new Date()).toISOString();
    const timeReg = new RegExp(/([01]?[0-9]|2[0-3]):[0-5][0-9]/);
    const horaI = new Date(today.replace(timeReg, hora));
    const auxHoraI = horaI.getTime();

    const auxMedico = await medicoService.getTable().select(['tiempo_consulta']).where('id', doctor);
    let horaF;
    if (Array.isArray(auxMedico) && auxMedico.length > 0) {
      horaF = new Date(auxHoraI + auxMedico[0].tiempo_consulta);
    } else {
      horaF = new Date(auxHoraI + 60 * 30 * 1000);
    }
    const fechaRegistro = new Date();
    const fechaCita = new Date(fecha);
    const idUser = paciente;
    const idSede = sede;
    const dia = fechaCita.getDay();

    console.log(fechaRegistro, fechaCita, horaI, horaF, dia)

    const auxData = {
      idProfesional: doctor,
      idEspecialidad: especialidad,
      estado,
      tipoCita,
      origen: 1,
      referencia_idProfesional: null,
      color,
      idUser,
      idSede,
      fechaCita: `${fechaCita.getUTCFullYear()}-${fechaCita.getUTCMonth() + 1}-${fechaCita.getUTCDate()}`,
      horaInicio: `${horaI.getUTCHours()}:${horaI.getUTCMinutes()}`,
      horaFin: `${horaF.getUTCHours()}:${horaF.getUTCMinutes()}`,
      precio,
      nota,
      dia: fechaCita.getDay(),
    }
    if (empresa_id > 0) {
      auxData.empresa_id = empresa_id;
    }

    const result = await citaService.save(auxData);

    if (result > 0) {
      return res.json({
        ok: true,
        msg: 'Cita registrada correctamente'
      })
    } else {
      return res.status(400).json({
        ok: false,
        msg: 'Error al registrar la cita'
      })
    }
    // console.log(doctor, paciente, tipoCita, estado, fecha, hora, precio, sede);
  } catch (error) {
    return catchError(res, error);
  }
});

router.put('/cita', oneOf([
  check('id').not().isEmpty().withMessage('El id es requerido'),
  check('fechaInicio').not().isEmpty().withMessage('La fecha de inicio es requerida'),
  check('fechaFin').not().isEmpty().withMessage('La fecha de fin es requerida')
]), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, fechaInicio: inicio, fechaFin: fin } = req.body;
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    const result = await citaService.updateById(id, {
      fechaCita: fechaInicio,
      horaInicio: fechaInicio,
      horaFin: fechaFin
    });

    // console.log(result)

    res.json({
      ok: true
    })
  } catch (error) {
    console.log(error);
    return
    return catchError(res, res);
  }
});

// Ruta para editar cita
// Falta vincular doctores
router.put('/allcita', oneOf([
  check('doctor').not().isEmpty().withMessage('El doctor es requerido'),
  check('paciente').not().isEmpty().withMessage('El paciente es requerido'),
  check('especialidad').not().isEmpty().withMessage('La especialidad es requerida'),
  check('tipoCita').not().isEmpty().withMessage('El tipo de cita es requerido'),
  check('estado').not().isEmpty().withMessage('El estado es requerido'),
  check('fecha').not().isEmpty().withMessage('La fecha es requerida'),
  check('hora').not().isEmpty().withMessage('La hora es requerida'),
  check('precio').not().isEmpty().withMessage('El precio es requerido'),
  check('sede').not().isEmpty().withMessage('La sede es requerida'),
  check('color').not().isEmpty().withMessage('El color es requerido'),
  check('id').not().isEmpty().withMessage('El id es requerido'),
  check('horaFin').not().isEmpty().withMessage('La Hora final es requerida'),
  check('nota').not().isEmpty().withMessage('La nota es requerida'),
]), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctor, paciente, especialidad, tipoCita, estado, fecha, hora, precio, sede, color, id, horaFin, nota } = req.body;
    const fechaCIta = new Date(fecha);
    const dataSave = {
      idProfesional: doctor,
      idEspecialidad: especialidad,
      idSede: sede,
      idUser: paciente,
      notas: null,
      diagnostico: null,
      estado,
      urgencia: null,
      tipoCita,
      origen: 1,
      referencia_idProfesional: null,
      referencia_nombre: '',
      seguro: '',
      nota,
      color,
      fechaCita: fecha,
      horaInicio: hora,
      horaFin: horaFin,
      precio,
      dia: fechaCIta.getDay(),
    }
    console.log(dataSave, id);
    const result = await citaService.updateById(id, dataSave)
    if (result > 0) {
      return res.json({
        ok: true,
        msg: 'Cita actualizada correctamente'
      })
    } else {
      throw Error('Error al actualizar la cita');
    }

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/', async (req, res) => {
  try {
    const { role, token, dataSistema, dataSession } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-clinica/calendario/superadmin', {
        dataSistema,
        dataSession
      });
    }

    if (role === 3) {
    }

    const data = await citaService.getAll();


    // bloque para obtener la configuracion de la clinica
    let configuracion_clinica = []
    configuracion_clinica = await ClinicaConfiguracion.getTable().whereIn('propiedad', ['estado_cita', 'tipo_cita']);
    let tipo_cita = [];
    let estado_cita = []

    // bloque para convertir el valor de la configuracion en un objeto
    if (Array.isArray(configuracion_clinica)) {
      for (let i = 0; i < configuracion_clinica.length; i++) {
        configuracion_clinica[i].valor = JSON.parse(configuracion_clinica[i].valor);
        switch (configuracion_clinica[i].propiedad) {
          case 'estado_cita':
            estado_cita.push(configuracion_clinica[i]);
            break;
          case 'tipo_cita':
            tipo_cita.push(configuracion_clinica[i]);
            break;
        }
      }
    }



    // bloque para obtener pacientes y medicos
    let pacientes = [];
    let medicos = [];
    let sedes = [];
    let especialidades = [];


    if (role === 3) {
      pacientes = await pacienteService.getbyCompany(token);
      medicos = await medicoService.getbyCompany(token);
      sedes = await sedeService.getbyCompany(token);
      especialidades = await especialidadService.getbyCompany(token);
    }

    res.render('modulo-tv/modulo-clinica/citas-medicas/calendario', {
      dataSession,
      dataSistema,
      data,
      estado_cita,
      tipo_cita,
      pacientes,
      medicos,
      sedes,
      especialidades
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get("/empresa/:id",
  check('id').isNumeric().withMessage('El id debe ser un numero'),
  EVResult,
  async (req, res) => {
    try {
      const { id } = req.params;

      const { dataSession, dataSistema } = await getAllDataSession(req);

      const data = await citaService.getbyCompany(id);

      // bloque para obtener la configuracion de la clinica
      let configuracion_clinica = []
      configuracion_clinica = await ClinicaConfiguracion.getTable().whereIn('propiedad', ['estado_cita', 'tipo_cita']);
      let tipo_cita = [];
      let estado_cita = []

      // bloque para convertir el valor de la configuracion en un objeto
      if (Array.isArray(configuracion_clinica)) {
        for (let i = 0; i < configuracion_clinica.length; i++) {
          configuracion_clinica[i].valor = JSON.parse(configuracion_clinica[i].valor);
          switch (configuracion_clinica[i].propiedad) {
            case 'estado_cita':
              estado_cita.push(configuracion_clinica[i]);
              break;
            case 'tipo_cita':
              tipo_cita.push(configuracion_clinica[i]);
              break;
          }
        }
      }

      // bloque para obtener pacientes y medicos
      let pacientes = [];
      let medicos = [];
      let sedes = [];
      let especialidades = [];

      pacientes = await pacienteService.getbyCompany(id);
      medicos = await medicoService.getbyCompany(id);
      sedes = await sedeService.getbyCompany(id);
      especialidades = await especialidadService.getbyCompany(id);

      res.render('modulo-tv/modulo-clinica/citas-medicas/calendario', {
        dataSession,
        dataSistema,
        data,
        estado_cita,
        tipo_cita,
        pacientes,
        medicos,
        sedes,
        especialidades,
        empresa_id: id
      });

    } catch (error) {
      return catchError(res, error);
    }
  });


router.get('/get-data-filter-date', oneOf([
  check('fecha_cita').not().exists().withMessage('La fecha de la cita es requerida'),
  check('fecha_registro').not().exists().withMessage('La fecha de registro es requerida'),
  check('estado').not().exists().withMessage('El estado es requerido'),
]), async (req, res) => {

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let data = []
    if (req.query.fecha_cita) {
      data = await citaService.getByColumn({ column: 'fechaCita', value: req.query.fecha_cita })
    } else if (req.query.fecha_registro) {
      data = await citaService.getTable().whereNotBetween('fechaRegistro', [req.query.fecha_registro + 'T00:00:00.000', req.query.fecha_registro + 'T23:59:59.999']);
    } else if (req.query.estado) {
      data = await citaService.getTable().where('estado', req.query.estado);
    }

    let idEspecialidades = []
    let idSedes = []
    let idPacientes = []
    let idMedicos = []
    if (Array.isArray(data)) {
      idEspecialidades = data.map(item => item.idEspecialidad);
      idSedes = data.map(item => item.idSede);
      idPacientes = data.map(item => item.idUser);
      idMedicos = data.map(item => item.idProfesional);

      idEspecialidades = idEspecialidades.filter((item, index) => idEspecialidades.indexOf(item) === index);
      idSedes = idSedes.filter((item, index) => idSedes.indexOf(item) === index);
      idPacientes = idPacientes.filter((item, index) => idPacientes.indexOf(item) === index);
      idMedicos = idMedicos.filter((item, index) => idMedicos.indexOf(item) === index);
    }
    let especialidadesData = await especialidadService.getTable().select(['id', 'nombre']).whereIn('id', idEspecialidades);
    let sedesData = await sedeService.getTable().select(['id', 'nombre', 'direccion']).whereIn('id', idSedes);
    let pacientesData = await pacienteService.getTable().select(['id', 'nombre', 'numero_documento', 'tipo_documento', 'celular', 'correo']).whereIn('id', idPacientes);
    let medicosData = await medicoService.getTable().select(['id', 'nombre']).whereIn('id', idMedicos);

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

    res.json({
      ok: true,
      msg: 'Datos obtenidos correctamente',
      data
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/get-data-filter-paciente', oneOf([
  check('paciente').not().isEmpty().withMessage('El paciente es requerido')])
  , async (req, res) => {
    try {
      // query with numero_documento, nombre, apellido_materno o apellido_paterno
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let data = [];
      const pa = req.query.paciente
      let pacientes = await pacienteService.getTable().where('nombre', 'like', '%' + pa + '%')
        .orWhere('apellido_paterno', 'like', '%' + pa + '%')
        .orWhere('apellido_materno', 'like', '%' + pa + '%')
        .orWhere('numero_documento', 'like', '%' + pa + '%');
      if (Array.isArray(pacientes) && pacientes.length > 0) {
        let idPacientes = pacientes.map(item => item.id);
        data = await citaService.getTable().whereIn('idUser', idPacientes);
      }

      if (Array.isArray(data) && data.length > 0) {
        let idEspecialidades = []
        let idSedes = []
        let idPacientes = []
        let idMedicos = []
        if (Array.isArray(data)) {
          idEspecialidades = data.map(item => item.idEspecialidad);
          idSedes = data.map(item => item.idSede);
          idPacientes = data.map(item => item.idUser);
          idMedicos = data.map(item => item.idProfesional);

          idEspecialidades = idEspecialidades.filter((item, index) => idEspecialidades.indexOf(item) === index);
          idSedes = idSedes.filter((item, index) => idSedes.indexOf(item) === index);
          idPacientes = idPacientes.filter((item, index) => idPacientes.indexOf(item) === index);
          idMedicos = idMedicos.filter((item, index) => idMedicos.indexOf(item) === index);
        }
        let especialidadesData = await especialidadService.getTable().select(['id', 'nombre']).whereIn('id', idEspecialidades);
        let sedesData = await sedeService.getTable().select(['id', 'nombre', 'direccion']).whereIn('id', idSedes);
        let pacientesData = pacientes.map(item => {
          // 'id', 'nombre', 'numero_documento', 'tipo_documento', 'celular', 'correo'
          return {
            id: item.id,
            nombre: item.nombre,
            numero_documento: item.numero_documento,
            tipo_documento: item.tipo_documento,
            celular: item.celular,
            correo: item.correo
          }
        });
        let medicosData = await medicoService.getTable().select(['id', 'nombre']).whereIn('id', idMedicos);

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
      }

      return res.json({
        ok: true,
        msg: 'Datos obtenidos correctamente',
        data
      });
    } catch (error) {
      return catchError(res, error);
    }
  });

router.get('/get-data-filter-doctor', oneOf([
  check('doctor').not().isEmpty().withMessage('El doctor es requerido'),
]), async (req, res) => {
  try {
    // query with nombre numero_documento correo
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let data = [];
    const doc = req.query.doctor
    let medicos = await medicoService.getTable().where('nombre', 'like', '%' + doc + '%')
      .orWhere('correo', 'like', '%' + doc + '%')
      .orWhere('numero_documento', 'like', '%' + doc + '%');
    if (Array.isArray(medicos) && medicos.length > 0) {
      let idMedicos = medicos.map(item => item.id);
      data = await citaService.getTable().whereIn('idProfesional', idMedicos);
    }
    if (Array.isArray(data) && data.length > 0) {
      let idEspecialidades = []
      let idSedes = []
      let idPacientes = []
      let idMedicos = []
      if (Array.isArray(data)) {
        idEspecialidades = data.map(item => item.idEspecialidad);
        idSedes = data.map(item => item.idSede);
        idPacientes = data.map(item => item.idUser);
        idMedicos = data.map(item => item.idProfesional);

        idEspecialidades = idEspecialidades.filter((item, index) => idEspecialidades.indexOf(item) === index);
        idSedes = idSedes.filter((item, index) => idSedes.indexOf(item) === index);
        idPacientes = idPacientes.filter((item, index) => idPacientes.indexOf(item) === index);
        idMedicos = idMedicos.filter((item, index) => idMedicos.indexOf(item) === index);
      }
      let especialidadesData = await especialidadService.getTable().select(['id', 'nombre']).whereIn('id', idEspecialidades);
      let sedesData = await sedeService.getTable().select(['id', 'nombre', 'direccion']).whereIn('id', idSedes);
      let pacientesData = await pacienteService.getTable().select(['id', 'nombre', 'numero_documento', 'tipo_documento', 'celular', 'correo']).whereIn('id', idPacientes);
      let medicosData = medicos.map(item => {
        return {
          id: item.id,
          nombre: item.nombre,
        }
      });

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
    }

    return res.json({
      ok: true,
      msg: 'Datos obtenidos correctamente',
      data
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/get-data-date', async (req, res) => {
  try {
    const data = await citaService.getAll();

    let idEspecialidades = []
    let idSedes = []
    let idPacientes = []
    let idMedicos = []
    if (Array.isArray(data)) {
      idEspecialidades = data.map(item => item.idEspecialidad);
      idSedes = data.map(item => item.idSede);
      idPacientes = data.map(item => item.idUser);
      idMedicos = data.map(item => item.idProfesional);

      idEspecialidades = idEspecialidades.filter((item, index) => idEspecialidades.indexOf(item) === index);
      idSedes = idSedes.filter((item, index) => idSedes.indexOf(item) === index);
      idPacientes = idPacientes.filter((item, index) => idPacientes.indexOf(item) === index);
      idMedicos = idMedicos.filter((item, index) => idMedicos.indexOf(item) === index);
    }
    let especialidadesData = await especialidadService.getTable().select(['id', 'nombre']).whereIn('id', idEspecialidades);
    let sedesData = await sedeService.getTable().select(['id', 'nombre', 'direccion']).whereIn('id', idSedes);
    let pacientesData = await pacienteService.getTable().select(['id', 'nombre', 'numero_documento', 'tipo_documento', 'celular', 'correo']).whereIn('id', idPacientes);
    let medicosData = await medicoService.getTable().select(['id', 'nombre']).whereIn('id', idMedicos);
    // console.log(especialidadesData, sedesData, pacientesData, medicosData)


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

    res.json({
      ok: true,
      msg: 'Datos obtenidos correctamente',
      data
    })

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/reprogramar/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult,
  async (req, res) => {
    try {
      const id = req.params.id;
      const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
      let data = await citaService.getTable().where('id', id);
      let otras_citas = [];
      let primera_cita = [];
      let reprogramada = false;


      if (Array.isArray(data) && data.length === 0) {
        return res.redirect('/modulo-clinica/citas-medicas');
      }

      if (Array.isArray(data) && data.length == 1 && role === 3) {
        if (token !== data[0].id) {
          return res.redirect('/modulo-clinica/citas-medicas');
        }
      }

      otras_citas = await ReprogramarCitaService.getTable().where('cita_id', id).orderBy('id', 'desc');

      if (Array.isArray(otras_citas) && otras_citas.length > 0) {
        reprogramada = true;
        primera_cita = data;
        data = [otras_citas[0]];
        otras_citas.shift();
      }


      // bloque para obtener la configuracion de la clinica
      let configuracion_clinica = []
      let tipo_cita = [];
      let estado_cita = [];

      if (role === 1 || role == 2) {
        configuracion_clinica = await ClinicaConfiguracion.getTable().whereIn('propiedad', ['estado_cita', 'tipo_cita']);
      }

      if (role === 3) {
        configuracion_clinica = await ClinicaConfiguracion.getTable().whereIn('propiedad', ['estado_cita', 'tipo_cita']);
      }

      // bloque para convertir el valor de la configuracion en un objeto
      if (Array.isArray(configuracion_clinica)) {
        for (let i = 0; i < configuracion_clinica.length; i++) {
          configuracion_clinica[i].valor = JSON.parse(configuracion_clinica[i].valor);
          switch (configuracion_clinica[i].propiedad) {
            case 'estado_cita':
              estado_cita.push(configuracion_clinica[i]);
              break;
            case 'tipo_cita':
              tipo_cita.push(configuracion_clinica[i]);
              break;
          }
        }
      }

      // bloque para obtener pacientes y medicos
      let paciente = [];
      let medicos = [];
      let sedes = [];
      let especialidades = [];

      if (role == 1 || role == 2) {
        paciente = await pacienteService.getById(primera_cita[0].idUser);
        medicos = await medicoService.getAll();
        sedes = await sedeService.getAll();
        especialidades = await especialidadService.getAll();
      }

      if (role == 3) {
        paciente = await pacienteService.getbyCompany(token);
        medicos = await medicoService.getbyCompany(token);
        sedes = await sedeService.getbyCompany(token);
        especialidades = await especialidadService.getbyCompany(token);
      }


      return res.render('modulo-clinica/citas-medicas/reprogramar', {
        dataSession,
        dataSistema,
        data,
        reprogramada,
        paciente,
        medicos,
        sedes,
        especialidades,
        estado_cita,
        tipo_cita,
        primera_cita,
        otras_citas
      });

    } catch (error) {
      return catchError(res, error);
    }
  });

router.post('/reprogramar', oneOf([[
  check('idProfesional').not().isEmpty().withMessage('El profesional es requerido'),
  check('idSede').not().isEmpty().withMessage('La sede es requerida'),
  check('fechaCita').not().isEmpty().withMessage('La fecha es requerida'),
  check('horaInicio').not().isEmpty().withMessage('La hora de inicio es requerida'),
  check('horaFin').not().isEmpty().withMessage('La hora de fin es requerida'),
  check('precio').not().isEmpty().withMessage('El precio es requerido'),
  check('color').not().isEmpty().withMessage('El color es requerido'),
  check('idEspecialidad').not().isEmpty().withMessage('La especialidad es requerida'),
  check('nota').not().isEmpty().withMessage('La nota es requerida'),
  check('estado').not().isEmpty().withMessage('El estado es requerido'),
  check('tipoCita').not().isEmpty().withMessage('El tipo de cita es requerido'),
  check('cita_id').not().isEmpty().withMessage('El id de la cita es requerido')
]]), async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { idProfesional, idSede, fechaCita, horaInicio, horaFin, precio, color, idEspecialidad, nota, estado, tipoCita, cita_id } = req.body;

    const auxFechaCita = new Date(fechaCita);

    const data = {
      idProfesional,
      idSede,
      fechaCita,
      horaInicio,
      horaFin,
      precio,
      color,
      idEspecialidad,
      nota,
      estado,
      tipoCita,
      cita_id,
      dia: auxFechaCita.getDay()
    }
    const result = await ReprogramarCitaService.save(data);

    return res.json({
      ok: true,
      msg: 'Cita reprogramada correctamente',
      data,
      id: result
    })

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/filtrosed', async (req, res) => {
  try {
    const sede = req.query.sede;
    const especialidad = req.query.especialidad;
    const doctor = req.query.doctor;
    let data = [];
    if (sede != 0) {
      if (sede != 0 && especialidad != 0) {
        if (sede != 0 && especialidad != 0 && doctor != 0) {
          data = await citaService.getTable().where('idSede', sede).andWhere('idEspecialidad', especialidad).andWhere('idProfesional', doctor)
        } else {
          data = await citaService.getTable().where('idSede', sede).andWhere('idEspecialidad', especialidad);
        }

      } else {
        data = await citaService.getTable().where('idSede', sede);
      }
    } else if (especialidad != 0) {
      if (especialidad != 0 && doctor != 0) {
        data = await citaService.getTable().where('idEspecialidad', especialidad).andWhere('idProfesional', doctor);
      } else {
        data = await citaService.getTable().where('idEspecialidad', especialidad);
      }
    } else if (doctor != 0) {
      data = await citaService.getTable().where('idProfesional', doctor);
    }

    let idEspecialidades = []
    let idSedes = []
    let idPacientes = []
    let idMedicos = []
    if (Array.isArray(data)) {
      idEspecialidades = data.map(item => item.idEspecialidad);
      idSedes = data.map(item => item.idSede);
      idPacientes = data.map(item => item.idUser);
      idMedicos = data.map(item => item.idProfesional);

      idEspecialidades = idEspecialidades.filter((item, index) => idEspecialidades.indexOf(item) === index);
      idSedes = idSedes.filter((item, index) => idSedes.indexOf(item) === index);
      idPacientes = idPacientes.filter((item, index) => idPacientes.indexOf(item) === index);
      idMedicos = idMedicos.filter((item, index) => idMedicos.indexOf(item) === index);
    }

    let especialidadesData = await especialidadService.getTable().select(['id', 'nombre']).whereIn('id', idEspecialidades);
    let sedesData = await sedeService.getTable().select(['id', 'nombre']).whereIn('id', idSedes);
    let pacientesData = await pacienteService.getTable().select(['id', 'nombre']).whereIn('id', idPacientes);
    let medicosData = await medicoService.getTable().select(['id', 'nombre']).whereIn('id', idMedicos);
    // console.log(especialidadesData, sedesData, pacientesData, medicosData)


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

    }

    // bloque para los eventos en el calendario
    let calendar = []
    if (Array.isArray(data)) {
      calendar = data.map(item => {
        // console.log(item)
        return ({
          id: item.id,
          title: item.paciente ? item.paciente.nombre : 'Sin nombre',
          start: new Date(item.fechaCita).toISOString().slice(0, 10) + "T" + item.horaInicio,
          end: new Date(item.fechaCita).toISOString().slice(0, 10) + "T" + item.horaFin,
          color: item.color,
          allDay: false,
          overlap: false,
          data: item
        });
      })
    }

    return res.json({
      ok: true,
      msg: 'Citas filtradas correctamente',
      data: calendar
    })

  } catch (error) {
    return catchError(res, error);
  }
});

// router.use('/medicos', require('./medico.routes'));
// router.use('/pacientes', require('./paciente.routes'));

module.exports = router
