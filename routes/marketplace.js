const { Router } = require("express"),
  router = Router(),
  MarketController = require("../controllers/market.controller");

router.get("/", new MarketController().getModule);
router.get("/data", new MarketController().getData);
router.post("/", new MarketController().save);
 

module.exports = router;
