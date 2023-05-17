const { Router } = require("express");
const router = Router();

const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { check } = require("express-validator");

const { ServicioController, ServicioMetodoController, MetodoEnvioController } = require("../../../controllers/modulo-generales/shipping");

const Servicio = new ServicioController();


router.get("/datatable/:id?", Servicio.datatable);
router.get("/select2/:id?", Servicio.select2);
router.get("/select-pure/:id?", Servicio.selectPure);


router.get("/", async (req, res) => {

  try {
    let { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.render("modulo-generales/shipping/servicios-entrega/superadmin", {
        dataSession,
        dataSistema
      });
    }


    return res.render("modulo-generales/shipping/servicios-entrega", {
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

    return res.render("modulo-generales/shipping/servicios-entrega", {
      dataSession,
      dataSistema,
      empresa_id: req.params.id
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.post("/", Servicio.saveDelivery);
router.purge("/:id", Servicio.update);
router.delete("/:id", Servicio.deleteDelivery);


module.exports = router;