const { Router } = require("express"), router = Router();

const { TratamientoController } = require('../../controllers/modulo-clinica/ce-tratamientos.controller');

const { check, body, param, query } = require('express-validator');

const { EVResult, EVResultView } = require('../../middlewares/EVResult.middleware');
const { isAdminSuperAdminMiddleware } = require("../../middlewares/modulo-tv/isAdmin");

const Tratamiento = new TratamientoController();


router.get('/', EVResultView, Tratamiento.renderHomeView);

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResultView, Tratamiento.renderSuperadminHomeView);


router.get('/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, Tratamiento.datatable);

router.get('/items',
  Tratamiento.index);

router.post('/items',
  body('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  body('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
  body('costo').optional().isNumeric().withMessage('El campo costo debe ser un número'),
  body('duracion').optional().isNumeric().withMessage('El campo duracion debe ser un número'),
  body('frecuencia').optional().isNumeric().withMessage('El campo frecuencia debe ser un número'),
  body('modo_aplicacion').optional().isString().withMessage('El campo modo_aplicacion debe ser un string'),
  body('dosificacion').optional().isNumeric().withMessage('El campo dosificacion debe ser un string'),
  body('precauciones').optional().isString().withMessage('El campo precauciones debe ser un string'),
  body('efectos_secundarios').optional().isString().withMessage('El campo efectos_secundarios debe ser un string'),
  body('recomendaciones').optional().isString().withMessage('El campo recomendaciones debe ser un string'),
  body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult,
  Tratamiento.save);

router.get('/items/:id',
  param('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Tratamiento.show);

router.put('/items/:id',
  param('id').isNumeric().withMessage('El id debe ser un número'),
  body('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  body('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
  body('costo').optional().isNumeric().withMessage('El campo costo debe ser un número'),
  body('duracion').optional().isNumeric().withMessage('El campo duracion debe ser un número'),
  body('frecuencia').optional().isNumeric().withMessage('El campo frecuencia debe ser un número'),
  body('modo_aplicacion').optional().isString().withMessage('El campo modo_aplicacion debe ser un string'),
  body('dosificacion').optional().isNumeric().withMessage('El campo dosificacion debe ser un string'),
  body('precauciones').optional().isString().withMessage('El campo precauciones debe ser un string'),
  body('efectos_secundarios').optional().isString().withMessage('El campo efectos_secundarios debe ser un string'),
  body('recomendaciones').optional().isString().withMessage('El campo recomendaciones debe ser un string'),
  body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, Tratamiento.update);

router.delete('/items/:id',
  param('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Tratamiento.delete);


module.exports = router