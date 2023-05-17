const { Router } = require("express"),
  router = Router(),
  StoreController = require("../../controllers/modulo-financiero/banco-trash.controller");

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require('../../middlewares/EVResult.middleware');

let Country = require("country-state-city").Country;

const { check, oneOf, matchedData, body, param } = require('express-validator');

// const { EmpresaMarketplaceController, MarketplaceController } = require('../../controllers/modulo-marketplace');
const {BancoController} = require("../../controllers/modulo-financiero/banco.controller");

// const { service: BancoService }= BancoController;
// const { service: EmpresaMarketplaceService } = EmpresaMarketplaceController;
// const { service: MarketplaceService } = MarketplaceController;

const Banco = new BancoController();

router.get('/datatable/:id?',
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, Banco.datatable);

router.get('/select2/:id?', Banco.select2);

router.get("/", Banco.renderHomeView);

router.get("/empresa/:id",
param('id').isNumeric().withMessage("Id es requerido"),
EVResult, Banco.renderSuperadminHomeView);

// router.get("/banco/:id", 
//   check('id').isNumeric().withMessage("Id es requerido"),  
//   EVResult, async (req, res) => {
//   try {
//     const banco_id = req.params.id;

//     const almacenes = await Banco.service.getTable().where({id: banco_id})
    
//     return res.json({
//       ok: true,
//       almacenes
//     })

//   } catch (error) {
//     return catchError(res, error);
//   }
// });

router.get("/todos", Banco.index);
// router.get("/:id", Banco.show);

// router.get("/empresa/:id", new StoreController().getByCompany);

router.get('/:id', 
  param('id').isNumeric().withMessage("Id es requerido"),
  EVResult, Banco.show);

router.delete('/:id', 
  check('id').isNumeric().withMessage("Id es requerido"),
  EVResult, Banco.delete);

router.post("/", 
check('empresa_id').optional().isNumeric().withMessage("Empresa es requerida"),
check('nombre').isString().withMessage("Nombre es requerido"),
check('direccion').isString().withMessage("Direccion es requerida"),
check('provincia').optional(),
check('pais').optional(),
body('sitio_web').optional().isURL().withMessage("Sitio web no es valido"),
body('telefono').optional().isMobilePhone().withMessage("Telefono no es valido"),
EVResult, Banco.save);

router.put('/:id', 
  check('id').isNumeric().withMessage("Id es requerido"),
  check('empresa_id').optional().isNumeric().withMessage("Empresa es requerida"),
  check('nombre').isString().withMessage("Nombre es requerido"),
  check('direccion').isString().withMessage("Direccion es requerida"),
  check('provincia').optional(),
  check('pais').optional(),
  body('sitio_web').optional().isURL().withMessage("Sitio web no es valido"),
  body('telefono').optional().isMobilePhone().withMessage("Telefono no es valido"),
  EVResult, Banco.update);

//   /**
// //  * @caeher
// //  */
// // router.get("/", async (req, res) => {
// //   try {
// //     let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
// //     let stores;
// //     let countries;
// //     let empresas;
// //     let activo_marketplace;

// //     if (role == 1 || role == 2) {
// //       activo_marketplace = await MarketplaceService.getById(1);
// //       activo_marketplace = activo_marketplace[0].habilitado
// //       stores = await BancoService.getAll();
// //       empresas = await EmpresaMarketplaceService.getAll();
// //       token = 0
// //     } else if (role == 3) {

// //       activo_marketplace = 0
// //       stores = await BancoService.getbyCompany(token);
// //       empresas = null

// //     }
// //     countries = Country.getAllCountries();

// //     res.render("modulo-financiero/bancos/admin-bancos", {
// //       stores,
// //       dataSession,
// //       dataSistema,
// //       empresas,
// //       activo_marketplace,
// //       countries,
// //       token
// //     });

// //   } catch (error) {
// //     return catchError(res, error);
// //   }
// // });




module.exports = router;
