const { Router } = require("express"),
    router = Router(),
    ProductosController = require("../../controllers/modulo-ecommerce/productos.controller");

router.get("/", new ProductosController().adminProductos);
router.post("/galeria", new ProductosController().postGaleria);

router.get("/get-galery-data/:id", new ProductosController().getGaleria);
router.post("/update-producto-galeria", new ProductosController().updateGaleria);
router.post("/delete-picture-data/:id", new ProductosController().deletePicture);
module.exports = router;


