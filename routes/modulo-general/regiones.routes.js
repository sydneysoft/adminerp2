const { Router } = require("express"),
    router = Router(),
    RegionesController = require("../../controllers/modulo-generales/regiones.controller");

router.get("/", new RegionesController().getRegiones);

router.get("/ciudades/:id", new RegionesController().getDistritos);


router.get("/distritos/:id", new RegionesController().getByCity);

router.get("/obtener-ciudades/:id", new RegionesController().getByGroup);

router.get("/envio", new RegionesController().getRegionesJson);

router.post("/", new RegionesController().postRegiones);

router.delete("/:id", new RegionesController().deleteRegiones);

module.exports = router;