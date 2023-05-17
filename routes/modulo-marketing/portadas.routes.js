const { Router } = require("express");
const PortadasController = require("../../controllers/modulo-marketing/portadas.controller"),
    router = Router()
const {PortadaPageController} = require('../../controllers/modulo-marketing/portada-pages.controller');

router.get('/datatable/:id?', PortadaPageController.datatable);
router.get('/select2/:id?', PortadaPageController.select2);

router.get("/", new PortadasController().getAdminPortadas);
router.post("/editar", new PortadasController().editAdminPortadas);
module.exports = router;
