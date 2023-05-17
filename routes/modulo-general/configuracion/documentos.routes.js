const { Router } = require("express"), router = Router();

const { oneOf, check, body, param, query } = require('express-validator');

const { DocumentoController } = require('../../../controllers/modulo-generales/configuracion/documentos.controller');
const { isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const { EVResult, EVResultView } = require("../../../middlewares/EVResult.middleware");

const Documento = new DocumentoController();

router.get('/datatable/:id?',
  check('draw').isInt({ min: 1 }),
  check('start').isInt({ min: 0 }),
  check('length').isInt({ min: 1 }),
  check('order').isArray({ min: 1 }),
  EVResult, Documento.datatable);

router.get("/select2/:id?", Documento.select2);


router.get('/', Documento.renderHomeView);

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
  param('id').isNumeric().withMessage('El id debe ser un número'),
  EVResultView, Documento.renderSuperadminHomeView);


router.get('/todo', Documento.index);

router.post('/',
  body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  body('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  body('abreviatura').not().isEmpty().isString().withMessage('El campo abreviatura debe ser un string'),
  body('pais').optional().isString().withMessage('El campo pais debe ser un string'),
  EVResult, Documento.save);

router.get('/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Documento.show);

router.put('/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  body('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  body('abreviatura').not().isEmpty().isString().withMessage('El campo abreviatura debe ser un string'),
  body('pais').optional().isString().withMessage('El campo pais debe ser un string'),
  EVResult, Documento.update);

router.delete('/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Documento.delete);



module.exports = router
