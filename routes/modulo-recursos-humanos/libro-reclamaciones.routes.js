const { Router } = require("express");
const router = Router()

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');

const { EVResult } = require('../../middlewares/EVResult.middleware');
const { check, oneOf, matchedData } = require('express-validator');

const {LibroReclamacionController} = require("../../controllers/modulo-recursos-humanos/libro-reclamaciones.controller");

router.get("/datatable/:id?", LibroReclamacionController.datatable);
router.get("/select2/:id?", LibroReclamacionController.select2);

router.get("/", async (req, res) => {
  try {

    let { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.render("modulo-recursos-humanos/libro-reclamos/superadmin", {
        dataSession,
        dataSistema
      });
    }

    return res.render("modulo-recursos-humanos/libro-reclamos", {
      dataSession,
      dataSistema
    });

  } catch (error) {
    return catchError(res, error);
  }
});

router.get("/empresa/:id", async (req, res) => {
  try {
    const {dataSession, dataSistema} = await getAllDataSession(req);

    return res.render("modulo-recursos-humanos/libro-reclamos", {
      dataSession,
      dataSistema,
      empresa_id: req.params.id
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get("/:id", LibroReclamacionController.show);

module.exports = router;
