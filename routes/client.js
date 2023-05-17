const { Router } = require("express");
const ClientController = require("../controllers/client.controller"),
    router = Router()


router.get("/get-data-home/:id", new ClientController().getHome);
router.get("/get-product/:id", new ClientController().getProduct);
router.get("/get-product-oferta/:id", new ClientController().getProductOferta);
router.get("/get-products-relationated/:id", new ClientController().getProductRelationated);


module.exports = router;
