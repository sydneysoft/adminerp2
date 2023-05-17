const { Router } = require("express"), router = Router();

const { CeRedesController } = require('../../controllers/modulo-marketing/ce-redes.controller');
const { check,  param, body, query } = require('express-validator');

const { isAdminSuperAdminMiddleware } = require('../../middlewares/modulo-tv/isAdmin')
const { EVResult, EVResultView } = require('../../middlewares/EVResult.middleware')

const CeRedes = new CeRedesController();


router.get('/datatable/:id?', check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, CeRedes.datatable);



router.get('/', CeRedes.renderHomeView);

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
  param('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, CeRedes.renderSuperadminHomeView);


router.get('/redess', CeRedes.index);


router.post('/redes',
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
  check('url').optional().isString().withMessage('El campo url debe ser un string'),
  check('identificador').optional().isString().withMessage('El campo identificador debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, CeRedes.save);

router.get('/redes/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),

  EVResult, CeRedes.show);

router.put('/redes/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
  check('url').optional().isString().withMessage('El campo url debe ser un string'),
  check('identificador').optional().isString().withMessage('El campo identificador debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, CeRedes.update);

router.delete('/redes/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, CeRedes.delete);


module.exports = router
