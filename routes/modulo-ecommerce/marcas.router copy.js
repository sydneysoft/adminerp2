const { Router } = require("express");
const MarcasController = require("../../controllers/modulo-ecommerce/marcas.controller"),
    router = Router()

router.get("/", new MarcasController().getBrands);
router.post("/", new MarcasController().postBrands);
router.delete("/", new MarcasController().deleteBrands);


module.exports = router;

