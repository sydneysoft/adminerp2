const { Router } = require("express"),
  router = Router();

const { check, oneOf, matchedData, param } = require('express-validator');
const { EVResult,EVResultView  } = require('../../middlewares/EVResult.middleware');

const { CorteController } = require('../../controllers/modulo-peluqueria/cortes.controller');

const Corte = new CorteController();


router.get('/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, Corte.datatable);



router.get("/", EVResultView, Corte.homeView);

router.get("/empresa/:id", 
  param('id').isNumeric().withMessage('El campo id debe ser un número'), 
  EVResultView, Corte.superadminHomeView);


/** Rutas que pueden ser usadas por el admin y usuario */
router.get('/corte/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResult, Corte.show);

router.put('/corte/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
  check('precio').optional().isNumeric().withMessage('El campo precio debe ser un número'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, Corte.update);

router.delete('/corte/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResult, Corte.delete);

router.post('/corte',
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
  check('precio').optional().isNumeric().withMessage('El campo precio debe ser un número'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, Corte.save);


module.exports = router