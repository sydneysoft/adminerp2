const { Router } = require("express"),
  router = Router(),
  EmailController = require("../../controllers/modulo-soporte/email.controller");

router.post("/", new EmailController().postEmail);


module.exports = router;
