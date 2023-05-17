const { Router } = require("express");
const DeliveryController = require("../../controllers/modulo-generales/delivery.controller"),
    router = Router()

router.get("/", new DeliveryController().getDelivery);
router.post("/", new DeliveryController().postDelivery);
router.post("/:id", new DeliveryController().deleteDelivery);

 

module.exports = router;
