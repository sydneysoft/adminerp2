const { Router } = require("express");
const router = Router();

router.use("/metodos-envio", require("./metodos-envio.routes"));
router.use("/regiones", require("./regiones.routes"));
router.use("/servicios-entrega", require("./servicios.routes"));

module.exports = router;