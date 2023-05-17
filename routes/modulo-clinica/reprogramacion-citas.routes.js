const { Router} = require("express"), router = Router();

const { body, validationResult, oneOf, check, param, query } = require('express-validator');

const { ReprogramarCitaMedicaController } = require("../../controllers/modulo-clinica/reprogramacion-citas.controller");

const ReprogramarCitaMedica = new ReprogramarCitaMedicaController();

const { EVResult, EVResultView } = require('../../middlewares/EVResult.middleware');
const { isAdminSuperAdminMiddleware } = require("../../middlewares/modulo-tv/isAdmin");

router.get("/datatable/:id?",
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, ReprogramarCitaMedica.datatable);

// router.get("/select2/:id?", ReprogramarCitaMedica.select2);

// router.get('/citas', ReprogramarCitaMedica.index);

// router.post('/citas',
//   body('idProfesional').optional().isNumeric().withMessage('El campo idProfesional debe ser un número'),
//   body('idUser').optional().isNumeric().withMessage('El campo idUser debe ser un número'),
//   body('idSede').optional().isNumeric().withMessage('El campo idSede debe ser un número'),
//   body('idEspecialidad').optional().isNumeric().withMessage('El campo idEspecialidad debe ser un número'),
//   body('fechaRegistro').optional().isDate().withMessage('El campo fechaRegistro debe ser una fecha'),
//   body('fechaCita').optional().isDate().withMessage('El campo fechaCita debe ser una fecha'),
//   body('dia').optional().isNumeric().withMessage('El campo dia debe ser un número'),
//   body('hora').optional().isString().withMessage('El campo hora debe ser un número'),
//   body('horaInicio').optional().isDate().withMessage('El campo horaInicio debe ser un número'),
//   body('horaFin').optional().isDate().withMessage('El campo horaFin debe ser un número'),
//   body('modulos').optional().isNumeric().withMessage('El campo modulos debe ser un número'),
//   body('notas').optional().isString().withMessage('El campo notas debe ser un texto'),
//   body('diagnostico').optional().isString().withMessage('El campo diagnostico debe ser un texto'),
//   body('estado').optional().isString().withMessage('El campo estado debe ser un número'),
//   body('urgencia').optional().isNumeric().withMessage('El campo urgencia debe ser un número'),
//   body('tipoCita').optional().isString().withMessage('El campo tipoCita debe ser un número'),
//   body('origen').optional().isNumeric().withMessage('El campo origen debe ser un número'),
//   body('referencia_idProfesional').optional().isNumeric().withMessage('El campo referencia_idProfesional debe ser un número'),
//   body('referencia_nombre').optional().isString().withMessage('El campo referencia_nombre debe ser un texto'),
//   body('seguro').optional().isString().withMessage('El campo seguro debe ser un número'),
//   body('nota').optional().isString().withMessage('El campo nota debe ser un texto'),
//   body('color').optional().isString().withMessage('El campo color debe ser un texto'),
//   body('precio').optional().isNumeric().withMessage('El campo precio debe ser un número'),
//   body('id_tienda').optional().isNumeric().withMessage('El campo id_tienda debe ser un número'),
//   body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
//   EVResult, ReprogramarCitaMedica.save);

// router.get('/citas/:id',
//   check('id').isNumeric().withMessage('El id debe ser un número'),
//   EVResult,
//   ReprogramarCitaMedica.show);

router.put('/citas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  body('idProfesional').optional().isNumeric().withMessage('El campo idProfesional debe ser un número'),
  body('idUser').optional().isNumeric().withMessage('El campo idUser debe ser un número'),
  body('idSede').optional().isNumeric().withMessage('El campo idSede debe ser un número'),
  body('idEspecialidad').optional().isNumeric().withMessage('El campo idEspecialidad debe ser un número'),
  body('fechaRegistro').optional().isDate().withMessage('El campo fechaRegistro debe ser una fecha'),
  body('fechaCita').optional().isDate().withMessage('El campo fechaCita debe ser una fecha'),
  body('dia').optional().isNumeric().withMessage('El campo dia debe ser un número'),
  body('hora').optional().isString().withMessage('El campo hora debe ser un número'),
  body('horaInicio').optional().isDate().withMessage('El campo horaInicio debe ser un número'),
  body('horaFin').optional().isDate().withMessage('El campo horaFin debe ser un número'),
  body('modulos').optional().isNumeric().withMessage('El campo modulos debe ser un número'),
  body('notas').optional().isString().withMessage('El campo notas debe ser un texto'),
  body('diagnostico').optional().isString().withMessage('El campo diagnostico debe ser un texto'),
  body('estado').optional().isString().withMessage('El campo estado debe ser un número'),
  body('urgencia').optional().isNumeric().withMessage('El campo urgencia debe ser un número'),
  body('tipoCita').optional().isString().withMessage('El campo tipoCita debe ser un número'),
  body('origen').optional().isNumeric().withMessage('El campo origen debe ser un número'),
  body('referencia_idProfesional').optional().isNumeric().withMessage('El campo referencia_idProfesional debe ser un número'),
  body('referencia_nombre').optional().isString().withMessage('El campo referencia_nombre debe ser un texto'),
  body('seguro').optional().isString().withMessage('El campo seguro debe ser un número'),
  body('nota').optional().isString().withMessage('El campo nota debe ser un texto'),
  body('color').optional().isString().withMessage('El campo color debe ser un texto'),
  body('precio').optional().isNumeric().withMessage('El campo precio debe ser un número'),
  body('id_tienda').optional().isNumeric().withMessage('El campo id_tienda debe ser un número'),
  body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, ReprogramarCitaMedica.update);

router.delete('/citas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult,ReprogramarCitaMedica.delete);


router.get('/', EVResultView, ReprogramarCitaMedica.renderHomeView);


router.get('/empresa/:id', isAdminSuperAdminMiddleware, 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResultView, ReprogramarCitaMedica.renderSuperadminHomeView);


router.post("/reprogramar/:id", 
param("id").isNumeric().withMessage("El id debe ser un numero"),
body("fechaCita"),
body("fechaInicio"),
body("fechaFin"),
body("notas").optional().isString().withMessage("La nota debe ser un string"),
body("tipoCita"),
body("urgencia"),
EVResult, ReprogramarCitaMedica.apiReprogramarCita);


// router.put("/:id", 
//   check('id').isNumeric().withMessage('El id debe ser un número'),
//   body('fechaCita'),
//   body('tipoCita'),
//   body('horaInicio'),
//   body('horaFin'),
//   body('color'),
//   body('nota'),
// EVResult,CitaMedica.apiReprogramarCita);

// router.get('/reprogramar/:id',
//   check('id').isNumeric().withMessage('El id debe ser un número'),
//   EVResult,
//   async (req, res) => {
//     try {
//       const id = req.params.id;
//       const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
//       let data = await citaService.getTable().where('id', id);
//       let otras_citas = [];
//       let primera_cita = [];
//       let reprogramada = false;


//       if (Array.isArray(data) && data.length === 0) {
//         return res.redirect('/modulo-clinica/citas-medicas');
//       }

//       if (Array.isArray(data) && data.length == 1 && role === 3) {
//         if (token !== data[0].id) {
//           return res.redirect('/modulo-clinica/citas-medicas');
//         }
//       }

//       otras_citas = await ReprogramarCitaService.getTable().where('cita_id', id).orderBy('id', 'desc');

//       if (Array.isArray(otras_citas) && otras_citas.length > 0) {
//         reprogramada = true;
//         primera_cita = data;
//         data = [otras_citas[0]];
//         otras_citas.shift();
//       }


//       // bloque para obtener la configuracion de la clinica
//       let configuracion_clinica = []
//       let tipo_cita = [];
//       let estado_cita = [];

//       if (role === 1 || role == 2) {
//         configuracion_clinica = await ClinicaConfiguracion.getTable().whereIn('propiedad', ['estado_cita', 'tipo_cita']);
//       }

//       if (role === 3) {
//         configuracion_clinica = await ClinicaConfiguracion.getTable().whereIn('propiedad', ['estado_cita', 'tipo_cita']);
//       }

//       // bloque para convertir el valor de la configuracion en un objeto
//       if (Array.isArray(configuracion_clinica)) {
//         for (let i = 0; i < configuracion_clinica.length; i++) {
//           configuracion_clinica[i].valor = JSON.parse(configuracion_clinica[i].valor);
//           switch (configuracion_clinica[i].propiedad) {
//             case 'estado_cita':
//               estado_cita.push(configuracion_clinica[i]);
//               break;
//             case 'tipo_cita':
//               tipo_cita.push(configuracion_clinica[i]);
//               break;
//           }
//         }
//       }

//       // bloque para obtener pacientes y medicos
//       let paciente = [];
//       let medicos = [];
//       let sedes = [];
//       let especialidades = [];

//       if (role == 1 || role == 2) {
//         paciente = await pacienteService.getById(primera_cita[0].idUser);
//         medicos = await medicoService.getAll();
//         sedes = await sedeService.getAll();
//         especialidades = await especialidadService.getAll();
//       }

//       if (role == 3) {
//         paciente = await pacienteService.getbyCompany(token);
//         medicos = await medicoService.getbyCompany(token);
//         sedes = await sedeService.getbyCompany(token);
//         especialidades = await especialidadService.getbyCompany(token);
//       }


//       return res.render('modulo-clinica/citas-medicas/reprogramar', {
//         dataSession,
//         dataSistema,
//         data,
//         reprogramada,
//         paciente,
//         medicos,
//         sedes,
//         especialidades,
//         estado_cita,
//         tipo_cita,
//         primera_cita,
//         otras_citas
//       });

//     } catch (error) {
//       return catchError(res, error);
//     }
//   });

// router.post('/reprogramar', oneOf([[
//   check('idProfesional').not().isEmpty().withMessage('El profesional es requerido'),
//   check('idSede').not().isEmpty().withMessage('La sede es requerida'),
//   check('fechaCita').not().isEmpty().withMessage('La fecha es requerida'),
//   check('horaInicio').not().isEmpty().withMessage('La hora de inicio es requerida'),
//   check('horaFin').not().isEmpty().withMessage('La hora de fin es requerida'),
//   check('precio').not().isEmpty().withMessage('El precio es requerido'),
//   check('color').not().isEmpty().withMessage('El color es requerido'),
//   check('idEspecialidad').not().isEmpty().withMessage('La especialidad es requerida'),
//   check('nota').not().isEmpty().withMessage('La nota es requerida'),
//   check('estado').not().isEmpty().withMessage('El estado es requerido'),
//   check('tipoCita').not().isEmpty().withMessage('El tipo de cita es requerido'),
//   check('cita_id').not().isEmpty().withMessage('El id de la cita es requerido')
// ]]), async (req, res) => {
//   try {

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(422).json({ errors: errors.array() });
//     }

//     const { idProfesional, idSede, fechaCita, horaInicio, horaFin, precio, color, idEspecialidad, nota, estado, tipoCita, cita_id } = req.body;

//     const auxFechaCita = new Date(fechaCita);

//     const data = {
//       idProfesional,
//       idSede,
//       fechaCita,
//       horaInicio,
//       horaFin,
//       precio,
//       color,
//       idEspecialidad,
//       nota,
//       estado,
//       tipoCita,
//       cita_id,
//       dia: auxFechaCita.getDay()
//     }
//     const result = await ReprogramarCitaService.save(data);

//     return res.json({
//       ok: true,
//       msg: 'Cita reprogramada correctamente',
//       data,
//       id: result
//     })

//   } catch (error) {
//     return catchError(res, error);
//   }
// });

module.exports = router
