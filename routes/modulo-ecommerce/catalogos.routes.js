const { Router } = require("express"),
  router = Router(),
  StoreController = require("../../controllers/modulo-ecommerce/almacenes-trash.controller");

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require('../../middlewares/EVResult.middleware');
const { check, oneOf, matchedData } = require('express-validator');

const {CatalogoController} = require("../../controllers/modulo-ecommerce/catalogos.controller");

const Catalogo = new CatalogoController();

router.get('/datatable/:id?',
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, Catalogo.datatable);

router.get('/select2/:id?', Catalogo.select2);

router.get("/", async (req, res) => {
 
  try {
    let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
  
    if (role == 1 || role == 2) {
      return res.render("modulo-ecommerce/catalogos/superadmin", {
        dataSession,
        dataSistema
      });
    } 
    return res.render("modulo-ecommerce/catalogos/admin-almacenes", {
      dataSession,
      dataSistema
    });

  } catch (error) {
    return catchError(req, error);
  }
});

router.get("/empresa/:id", async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);
    return res.render("modulo-ecommerce/catalogos/index", {
      dataSession,
      dataSistema,
      empresa_id: req.params.id
    });
  } catch (error) {
    return catchError(res, error);
  }
});




module.exports = router;
