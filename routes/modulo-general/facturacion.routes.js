const { Router } = require("express"),
    router = Router(),
    SeccionesController = require("../../controllers/secciones.controller");
const {  access_mod_finanzas } = require("../../middlewares/jwt")


 

//finanzas
router.get("/admin-metodos-facturacion", access_mod_finanzas, new SeccionesController().getMetodoFact)
router.get("/admin-metodos-facturacion-datos", access_mod_finanzas, new SeccionesController().getMetodoFactData)
router.post("/admin-metodos-facturacion", access_mod_finanzas, new SeccionesController().postMetodoFact)

router.get("/admin-facturacion", access_mod_finanzas, new SeccionesController().getBilling)
router.post("/admin-facturacion", access_mod_finanzas, new SeccionesController().postBilling)
router.post("/data-invoice-cancel", access_mod_finanzas, new SeccionesController().cancelInvoice)




module.exports = router;
