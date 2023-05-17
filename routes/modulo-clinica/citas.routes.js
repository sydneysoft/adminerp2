const { Router} = require("express"), router = Router();

const { body, validationResult, oneOf, check, param, query } = require('express-validator');
const { CitaMedicaController } = require("../../controllers/modulo-clinica/citas.controller");

const CitaMedica = new CitaMedicaController();

const { EVResult, EVResultView } = require('../../middlewares/EVResult.middleware');
const { isAdminSuperAdminMiddleware } = require("../../middlewares/modulo-tv/isAdmin");

router.get("/datatable/:id?",
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, CitaMedica.datatable);

router.get("/select2/:id?", CitaMedica.select2);

router.get('/citas', CitaMedica.index);

router.post('/citas',
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
  EVResult, CitaMedica.save);

router.get('/citas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult,
  CitaMedica.show);

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
  EVResult, CitaMedica.update);

router.delete('/citas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult,CitaMedica.delete);


router.get('/', EVResultView, CitaMedica.renderHomeView);


router.get('/empresa/:id', isAdminSuperAdminMiddleware, 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResultView, CitaMedica.renderSuperadminHomeView);


module.exports = router
