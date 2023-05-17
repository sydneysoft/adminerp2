const { Router } = require("express"), router = Router();

const { CompaniaSeguroController } = require('../../controllers/modulo-clinica/companias-seguros.controller');

const { oneOf, check, body, param, query } = require('express-validator');
const { isAdminSuperAdminMiddleware } = require('../../middlewares/modulo-tv/isAdmin');
const { EVResult, EVResultView } = require("../../middlewares/EVResult.middleware");

const CompaniaSeguro = new CompaniaSeguroController();

router.get('/datatable/:id?',
  check('draw').isInt({ min: 1 }),
  check('start').isInt({ min: 0 }),
  check('length').isInt({ min: 1 }),
  check('order').isArray({ min: 1 }),
  EVResult, CompaniaSeguro.datatable);

router.get("/select2/:id?", CompaniaSeguro.select2);


router.get('/', CompaniaSeguro.renderHomeView);

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
  param('id').isNumeric().withMessage('El id debe ser un número'),
  EVResultView, CompaniaSeguro.renderSuperadminHomeView);


router.get('/todo', CompaniaSeguro.index);

router.post('/',
  body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  body('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  body('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
  body('pais').optional().isString().withMessage('El campo pais debe ser un string'),
  body('provincia').optional().isString().withMessage('El campo provincia debe ser un string'),
  body('correo').optional().isString().withMessage('El campo correo debe ser un string'),
  body('telefono').optional().isString().withMessage('El campo telefono debe ser un string'),
  body('sitio_web').optional().isString().withMessage('El campo sitio_web debe ser un string'),
  EVResult, CompaniaSeguro.save);

router.get('/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, CompaniaSeguro.show);

router.put('/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  body('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  body('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
  body('pais').optional().isString().withMessage('El campo pais debe ser un string'),
  body('provincia').optional().isString().withMessage('El campo provincia debe ser un string'),
  body('correo').optional().isString().withMessage('El campo correo debe ser un string'),
  body('telefono').optional().isString().withMessage('El campo telefono debe ser un string'),
  body('sitio_web').optional().isString().withMessage('El campo sitio_web debe ser un string'),
  EVResult, CompaniaSeguro.update);

router.delete('/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, CompaniaSeguro.delete);



module.exports = router
