const { Router } = require("express"),
  router = Router(),
  AccionesMasivasController = require("../../controllers/modulo-soporte/acciones-masivas.controller.js");

router.delete("/", new AccionesMasivasController().eliminar);
router.put("/borrador", new AccionesMasivasController().borrador);
router.put("/publicar", new AccionesMasivasController().publicar);
module.exports = router;
