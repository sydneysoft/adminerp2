const { Router } = require("express");
const VentanasController = require("../../controllers/modulo-marketing/ventanas-emergentes.controller"),
    router = Router()

router.get("/", new VentanasController().getPopUp);
router.post("/", new VentanasController().postPopUp);
router.delete("/", new VentanasController().deletePopUp);



module.exports = router;
