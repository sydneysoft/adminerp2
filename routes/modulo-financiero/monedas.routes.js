const { Router } = require("express"),
  router = Router();

const { EVResult, EVResultView } = require('../../middlewares/EVResult.middleware');

const { check, oneOf, matchedData, body, param } = require('express-validator');

// const { EmpresaMarketplaceController, MarketplaceController } = require('../../controllers/modulo-marketplace');
const { MonedaController } = require("../../controllers/modulo-financiero/moneda.controller");

// const { service: BancoService }= BancoController;
// const { service: EmpresaMarketplaceService } = EmpresaMarketplaceController;
// const { service: MarketplaceService } = MarketplaceController;

const Moneda = new MonedaController();

router.get('/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, Moneda.datatable);

router.get('/select2/:id?', Moneda.select2);

router.get("/", Moneda.renderHomeView);

router.get("/empresa/:id",
  param('id').isNumeric().withMessage("Id es requerido"),
  EVResult, Moneda.renderSuperadminHomeView);

router.get("/todos", Moneda.index);
// router.get("/:id", Moneda.show);

// router.get("/empresa/:id", new StoreController().getByCompany);

router.get('/:id',
  param('id').isNumeric().withMessage("Id es requerido"),
  EVResult, Moneda.show);

router.delete('/:id',
  check('id').isNumeric().withMessage("Id es requerido"),
  EVResult, Moneda.delete);

router.post("/",
  check('empresa_id').optional().isNumeric().withMessage("Empresa es requerida"),
  body('nombre').isString().withMessage("Nombre es requerido"),
  body('simbolo').isString().withMessage("Simbolo es requerido"),
  body('codigo').isString().withMessage("Codigo es requerido"),
  body('pais').isString().withMessage("Pais es requerido"),
  body('empresa_id').optional().isNumeric().withMessage("Empresa es requerida"),
  EVResult, Moneda.save);

router.put('/:id',
  check('id').isNumeric().withMessage("Id es requerido"),
  check('empresa_id').optional().isNumeric().withMessage("Empresa es requerida"),
  body('nombre').isString().withMessage("Nombre es requerido"),
  body('simbolo').isString().withMessage("Simbolo es requerido"),
  body('codigo').isString().withMessage("Codigo es requerido"),
  body('pais').isString().withMessage("Pais es requerido"),
  EVResult, Moneda.update);


module.exports = router;
