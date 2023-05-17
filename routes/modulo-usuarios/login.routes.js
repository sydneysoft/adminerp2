const { Router } = require("express"),
    router = Router(),
    LoginController = require("../../controllers/modulo-usuarios/login.controller");

router.post("/", new LoginController().authLogin);
// router.get("/:id", new StockController().getById);

// router.put("/:id", new StockController().update);
// router.delete("/:id", new StockController().deleteById);

module.exports = router;
