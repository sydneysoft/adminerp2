const { Router } = require("express"),
  router = Router();

router.use("/", require("./cortes.routes"));

module.exports = router