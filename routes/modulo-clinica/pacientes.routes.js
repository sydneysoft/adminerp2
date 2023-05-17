const { Router } = require("express"), router = Router();

const { body, validationResult, param, check } = require('express-validator');

const {PacienteController} = require('../../controllers/modulo-clinica/ce-pacientes.controller');

const Paciente = new PacienteController();

const { EVResult, EVResultView } = require('../../middlewares/EVResult.middleware');


router.get('/datatable/:id?',
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, Paciente.datatable);

router.get("/select2/:id?", Paciente.select2);


router.get("/", Paciente.renderHomeView);

router.get('/empresa/:id', 
param('id').isNumeric().withMessage('El id debe ser un número'),
EVResultView, Paciente.renderSuperadminHomeView);


router.get('/pacientes', Paciente.index);

router.post('/pacientes', 
body('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
body('apellido_paterno').optional().isString().withMessage('El campo apellido_paterno debe ser un string'),
body('apellido_materno').optional().isString().withMessage('El campo apellido_materno debe ser un string'),
body('fecha_nacimiento').optional().isDate().withMessage('El campo fecha_nacimiento debe ser una fecha'),
body('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
body('nota').optional().isString().withMessage('El campo nota debe ser un string'),
body('diagnostico').optional().isString().withMessage('El campo diagnostico debe ser un string'),
body('identificador').optional().isString().withMessage('El campo identificador debe ser un string'),
body('dni').optional().isString().withMessage('El campo dni debe ser un string'),
body('numero_documento').optional().isString().withMessage('El campo numero_documento debe ser un string'),
body('tipo_documento').optional().isString().withMessage('El campo tipo_documento debe ser un string'),
body('tipo_seguro').optional().isString().withMessage('El campo tipo_seguro debe ser un string'),
body('nombre_seguro').optional().isString().withMessage('El campo nombre_seguro debe ser un string'),
body('numero_seguro').optional().isString().withMessage('El campo numero_seguro debe ser un string'),
body('sexo').optional().isString().withMessage('El campo sexo debe ser un string'),
body('estado_civil').optional().isString().withMessage('El campo estado_civil debe ser un string'),
body('celular').optional().isString().withMessage('El campo celular debe ser un string'),
body('pais').optional().isString().withMessage('El campo pais debe ser un string'),
body('correo').optional().isEmail().withMessage('El campo correo debe ser un email'),
body('clave').optional().isString().withMessage('El campo clave debe ser un string'),
body('Tag_VieneDeApp').optional().isNumeric().withMessage('El campo Tag_VieneDeApp debe ser un numero'),
body('token').optional().isString().withMessage('El campo token debe ser un string'),
body('status').optional().isString().withMessage('El campo status debe ser un string'),
body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un entero'),
EVResult,
Paciente.save);

router.get('/pacientes/:id', 
param('id').isNumeric().withMessage('El campo id debe ser un entero'),
EVResult,
Paciente.show);

router.put('/pacientes/:id', 
param('id').isNumeric().withMessage('El campo id debe ser un entero'),
body('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
body('apellido_paterno').optional().isString().withMessage('El campo apellido_paterno debe ser un string'),
body('apellido_materno').optional().isString().withMessage('El campo apellido_materno debe ser un string'),
body('fecha_nacimiento').optional().isDate().withMessage('El campo fecha_nacimiento debe ser una fecha'),
body('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
body('nota').optional().isString().withMessage('El campo nota debe ser un string'),
body('diagnostico').optional().isString().withMessage('El campo diagnostico debe ser un string'),
body('identificador').optional().isString().withMessage('El campo identificador debe ser un string'),
body('dni').optional().isString().withMessage('El campo dni debe ser un string'),
body('numero_documento').optional().isString().withMessage('El campo numero_documento debe ser un string'),
body('tipo_documento').optional().isString().withMessage('El campo tipo_documento debe ser un string'),
body('tipo_seguro').optional().isString().withMessage('El campo tipo_seguro debe ser un string'),
body('nombre_seguro').optional().isString().withMessage('El campo nombre_seguro debe ser un string'),
body('numero_seguro').optional().isString().withMessage('El campo numero_seguro debe ser un string'),
body('sexo').optional().isString().withMessage('El campo sexo debe ser un string'),
body('estado_civil').optional().isString().withMessage('El campo estado_civil debe ser un string'),
body('celular').optional().isString().withMessage('El campo celular debe ser un string'),
body('pais').optional().isString().withMessage('El campo pais debe ser un string'),
body('correo').optional().isEmail().withMessage('El campo correo debe ser un email'),
body('clave').optional().isString().withMessage('El campo clave debe ser un string'),
body('Tag_VieneDeApp').optional().isNumeric().withMessage('El campo Tag_VieneDeApp debe ser un numero'),
body('token').optional().isString().withMessage('El campo token debe ser un string'),
body('status').optional().isString().withMessage('El campo status debe ser un string'),
body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un entero'),
EVResult,Paciente.update);

router.delete('/pacientes/:id', 
param('id').isNumeric().withMessage('El campo id debe ser un entero'),
EVResult,
Paciente.delete);

router.get('/historial/:id', 
check('id').isNumeric().withMessage('El campo id debe ser un entero'),
EVResult, Paciente.renderHistorialPaciente);

module.exports = router