const { Router } = require("express"),
    router = Router(),
    GaleriaController = require("../../controllers/modulo-generales/galeria.controller");
const { upload } = require('../../middlewares/cloudinary');
router.get("/", new GaleriaController().getAll);
router.post("/", upload.any(), new GaleriaController().post);

router.get("/selectImages", new GaleriaController().selectImages);
router.get("/selectImages/:id", new GaleriaController().selectImagesByCount);
router.post("/:id", new GaleriaController().deleteImage);

router.get('/images', new GaleriaController().getImages);


module.exports = router;
