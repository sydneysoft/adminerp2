const { Router } = require("express");
const BannerController = require("../../controllers/modulo-marketing/banner.controller"),
    router = Router();

const {BannerController: BannersController} = require('../../controllers/modulo-marketing/banners.controller');

router.get('/datatable/:id?', BannersController.datatable);
router.get('/select2/:id?', BannersController.select2);

router.get("/", new BannerController().getAdminBanner);
router.post("/", new BannerController().saveAdminBanner);
router.put("/update-admin-banners", new BannerController().updateAdminBanner);
router.delete("/", new BannerController().deleteAdminBanner);



module.exports = router;
