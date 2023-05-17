const { Router } = require("express"),
  router = Router(),
  StoreController = require("../../controllers/modulo-ecommerce/almacenes-trash.controller");

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require('../../middlewares/EVResult.middleware');

let Country = require("country-state-city").Country;

const { check, oneOf, matchedData } = require('express-validator');

const { AlmacenController } = require('../../controllers/modulo-ecommerce/almacenes.controller'); // builder cambiar al finalizar
const { EmpresaMarketplaceController, MarketplaceController } = require('../../controllers/modulo-marketplace');
const {StockController} = require("../../controllers/modulo-ecommerce/stocks.controller");


const { service: AlmacenService } = AlmacenController;
const { service: EmpresaMarketplaceService } = EmpresaMarketplaceController;
const { service: MarketplaceService } = MarketplaceController;
const { service: StockService } = StockController;

router.get('/datatable/:id?',
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, AlmacenController.datatable);

router.get('/select2/:id?', AlmacenController.select2);

router.get("/", async (req, res) => {
 
  try {
    let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    let countries;
  
    if (role == 1 || role == 2) {
      return res.render("modulo-ecommerce/almacenes/superadmin", {
        dataSession,
        dataSistema
      });
    } else if (role == 3) {
    }
    
    const stores = await AlmacenService.getbyCompany(token);
    countries = Country.getAllCountries();

    return res.render("modulo-ecommerce/almacenes/admin-almacenes", {
      dataSession,
      dataSistema,
      stores,
      countries
    });

  } catch (error) {
    return catchError(req, error);
  }
});

router.get("/empresa/:id", async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);
    const stores = await AlmacenService.getbyCompany(req.params.id);
    countries = Country.getAllCountries();
    return res.render("modulo-ecommerce/almacenes/index", {
      dataSession,
      dataSistema,
      empresa_id: req.params.id,
      stores,
      countries
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get("/producto/:id", 
  // check('id').isNumeric().withMessage("Id es requerido"),  
  check('id').isNumeric().withMessage((value, { req }) => {
    return req.i18n_texts.CLOSE;
  }),
  EVResult, async (req, res) => {

  try {
    const produco_id = req.params.id;

    const almacenes = await StockService.getTable().where({producto_id: produco_id})
      .select(['stock.stock', 'almacenes.nombre', 'almacenes.id'])
      .leftJoin('almacenes', 'stock.almacen_id', 'almacenes.id');
    
    return res.json({
      ok: true,
      almacenes
    })

  } catch (error) {
    return catchError(res, error);
  }
});

router.get("/todos", AlmacenController.index);
router.get("/:id", AlmacenController.show);
router.get("/empresa/:id", new StoreController().getByCompany);
router.get("/state/:id", new StoreController().getState);

router.get('/:id', 
  check('id').isNumeric().withMessage("Id es requerido"),
  EVResult, AlmacenController.show);
router.delete('/:id', 
  check('id').isNumeric().withMessage("Id es requerido"),
  EVResult, AlmacenController.delete);

router.post("/", 
check('empresa_id').optional().isNumeric().withMessage("Empresa es requerida"),
check('nombre').isString().withMessage("Nombre es requerido"),
check('direccion').isString().withMessage("Direccion es requerida"),
check('provincia').optional(),
check('pais').optional(),
EVResult, AlmacenController.save);

router.put('/:id', 
  check('id').isNumeric().withMessage("Id es requerido"),
  check('empresa_id').optional().isNumeric().withMessage("Empresa es requerida"),
  check('nombre').isString().withMessage("Nombre es requerido"),
  check('direccion').isString().withMessage("Direccion es requerida"),
  check('provincia').optional(),
  check('pais').optional(),
  EVResult, AlmacenController.update);
/**
 * @caeher
 */
router.get("/", async (req, res) => {
  try {
    let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    let stores;
    let countries;
    let empresas;
    let activo_marketplace;

    if (role == 1 || role == 2) {
      activo_marketplace = await MarketplaceService.getById(1);
      activo_marketplace = activo_marketplace[0].habilitado
      stores = await AlmacenService.getAll();
      empresas = await EmpresaMarketplaceService.getAll();
      token = 0
    } else if (role == 3) {

      activo_marketplace = 0
      stores = await AlmacenService.getbyCompany(token);
      empresas = null

    }
    countries = Country.getAllCountries();

    res.render("modulo-ecommerce/almacenes/admin-almacenes", {
      stores,
      dataSession,
      dataSistema,
      empresas,
      activo_marketplace,
      countries,
      token
    });

  } catch (error) {
    return catchError(res, error);
  }
});




module.exports = router;
