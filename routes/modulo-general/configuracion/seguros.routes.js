const { Router } = require("express"), router = Router();

const { oneOf, check, body, param, query } = require('express-validator');

const { SeguroController } = require('../../../controllers/modulo-generales/configuracion/seguros.controller');
const { isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const { EVResult, EVResultView } = require("../../../middlewares/EVResult.middleware");

const Seguro = new SeguroController();

router.get('/datatable/:id?',
  check('draw').isInt({ min: 1 }),
  check('start').isInt({ min: 0 }),
  check('length').isInt({ min: 1 }),
  check('order').isArray({ min: 1 }),
  EVResult, Seguro.datatable);

router.get("/select2/:id?", Seguro.select2);


router.get('/', Seguro.renderHomeView);

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
  param('id').isNumeric().withMessage('El id debe ser un número'),
  EVResultView, Seguro.renderSuperadminHomeView);


router.get('/todo', Seguro.index);

router.post('/',
  body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  body('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  body('abreviatura').not().isEmpty().isString().withMessage('El campo abreviatura debe ser un string'),
  body('pais').optional().isString().withMessage('El campo pais debe ser un string'),
  EVResult, Seguro.save);

router.get('/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Seguro.show);

router.put('/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  body('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  body('abreviatura').not().isEmpty().isString().withMessage('El campo abreviatura debe ser un string'),
  body('pais').optional().isString().withMessage('El campo pais debe ser un string'),
  EVResult, Seguro.update);

router.delete('/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Seguro.delete);



module.exports = router
