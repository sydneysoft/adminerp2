const { Router } = require("express");
const router = Router()
const { EstiloController } = require("../../controllers/modulo-generales/estilos.controller")

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

const { service: EstiloService } = EstiloController;

router.get("/", async (req, res) => {
  try {
    let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      token = 0;
      return res.render("modulo-generales/estilos/superadmin", {
        dataSession,
        dataSistema
      });
    }

    let css = await EstiloService.getbyCompany(token);
    if (Array.isArray(css) && css.length == 0) {
      await EstiloService.save({ empresa_id: token });
      css = await EstiloService.getbyCompany(token);
    }
    return res.render("modulo-generales/estilos", {
      dataSession,
      dataSistema,
      css
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get("/empresa/:id",
  check('id').isNumeric().withMessage('El id de la empresa debe ser un número'),
  EVResult, async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);

    let css = await EstiloService.getbyCompany(req.params.id);
    if (Array.isArray(css) && css.length == 0) {
      await EstiloService.save({ empresa_id: req.params.id });
      css = await EstiloService.getbyCompany(req.params.id);
    }

    return res.render("modulo-generales/estilos", {
      dataSession,
      dataSistema,
      empresa_id: req.params.id,
      css
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.put("/:id",
  check('style').isString().withMessage('El estilo debe ser un texto'),
  check('empresa_id').optional().isNumeric().withMessage('El id de la empresa debe ser un número'),
  EVResult, EstiloController.update);


module.exports = router;

