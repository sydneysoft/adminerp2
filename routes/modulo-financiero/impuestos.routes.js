const { Router } = require("express"),
  router = Router();

const { EVResult, EVResultView } = require('../../middlewares/EVResult.middleware');

const { check, oneOf, matchedData, body, param } = require('express-validator');

const { ImpuestoController } = require("../../controllers/modulo-financiero/impuestos.controller");

const Impuesto = new ImpuestoController();

router.get('/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, Impuesto.datatable);

router.get('/select2/:id?', Impuesto.select2);

router.get("/", Impuesto.renderHomeView);

router.get("/empresa/:id",
  param('id').isNumeric().withMessage("Id es requerido"),
  EVResult, Impuesto.renderSuperadminHomeView);

router.get("/todos", Impuesto.index);
// router.get("/:id", Impuesto.show);

// router.get("/empresa/:id", new StoreController().getByCompany);

router.get('/:id',
  param('id').isNumeric().withMessage("Id es requerido"),
  EVResult, Impuesto.show);

router.delete('/:id',
  check('id').isNumeric().withMessage("Id es requerido"),
  EVResult, Impuesto.delete);

router.post("/",
  body('nombre').isString().withMessage("Nombre es requerido"), 
  body('pais').isString().withMessage("Pais es requerido"),
  body('tasa').isNumeric().withMessage("Tasa es requerida"),
  body('descripcion').isString().withMessage("Descripcion es requerida"),
  body('codigo').isString().withMessage("Codigo es requerido"),
  body('empresa_id').optional().isNumeric().withMessage("Empresa es requerida"),
  EVResult, Impuesto.save);

router.put('/:id',
  check('id').isNumeric().withMessage("Id es requerido"),
  body('nombre').isString().withMessage("Nombre es requerido"), 
  body('pais').isString().withMessage("Pais es requerido"),
  body('tasa').isNumeric().withMessage("Tasa es requerida"),
  body('descripcion').isString().withMessage("Descripcion es requerida"),
  body('codigo').isString().withMessage("Codigo es requerido"),
  check('empresa_id').optional().isNumeric().withMessage("Empresa es requerida"),
  EVResult, Impuesto.update);


module.exports = router;
