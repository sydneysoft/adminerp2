const { Router } = require("express"),
  router = Router(),
  StockController = require("../../controllers/modulo-ecommerce/stock.controller");

router.get("/", new StockController().getAll);
router.get("/:id", new StockController().getById);
router.post("/", new StockController().save);
router.put("/:id", new StockController().update);
router.delete("/:id", new StockController().deleteById);

module.exports = router;
