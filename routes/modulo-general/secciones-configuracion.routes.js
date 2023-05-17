const { Router } = require("express");
const router = Router();

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { oneOf, check, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

const {SeccionConfiguracionController} = require('../../controllers/modulo-generales/configuracion/secciones-configuracion.controller');
const {service: SeccionConfiguracionService} = SeccionConfiguracionController;

router.get("/get/:empresa_id?", async (req, res) => {
  try {
    console.log("test")

    const {role, token} = await getAllDataSession(req);
    let empresa_id = null;
    if (role == 1 || role == 2) {
      empresa_id = req.params.empresa_id;
    } else if(role == 3) {
      empresa_id = token;
    }
    console.log("empresa_id:"+empresa_id)

    let result = await SeccionConfiguracionService.getbyCompany(empresa_id);

    if (Array.isArray(result) && result.length == 0) {
      await SeccionConfiguracionService.save({
        empresa_id,
        estado: "",
        nombre: ""
      });

      result = await SeccionConfiguracionService.getbyCompany(empresa_id);
    }

    return res.json(result[0]);

  } catch (error) {
    return catchError(res, error);
  }
});

router.get("/:id", SeccionConfiguracionController.show);
router.put("/:id", SeccionConfiguracionController.update);
router.post("/", SeccionConfiguracionController.save);
router.delete("/:id", SeccionConfiguracionController.delete);

module.exports = router;
