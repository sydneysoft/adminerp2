const { Router } = require("express");
const router = Router();


router.use("/", require('./metodos.routes'));

// Verificar los metodos de pago
router.use("/", require('./braintree.routes'));
router.use("/", require("./culqi.routes"));
router.use("/", require("./mercado-pago.routes"));
router.use("/", require("./niubiz.routes"));
router.use("/", require("./pago-contra-entrega.routes"));
router.use("/", require("./pago-efectivo.routes"));
router.use("/", require("./paypal.routes"));
router.use("/", require("./payu.routes"));
router.use("/", require("./stripe.routes"));

module.exports = router;