const { Router } = require("express");
const FiltrosController = require("../../controllers/modulo-ecommerce/filtros.controller"),
    router = Router()

router.get("/", new FiltrosController().getFilters);
 

module.exports = router;

