const { Router } = require("express"),
    router = Router();

    const SeccionesController = require("../../controllers/secciones.controller");

    const { getSidebarData } = require('../../controllers/ui');

// router.get('/footer', require('./footer.router'));
// router.get('/galeria', require('./galeria.router'));

// router.get("/admin-prendas", new SeccionesController().adminPrendas);
// router.get("/admin-productos", new SeccionesController().adminProductos);

// router.get("/admin-categorias", new SeccionesController().adminCategorias);
// router.get("/admin-subcategorias", new SeccionesController().adminSubCategorias);
// router.get("/get-categories", new SeccionesController().getCategories);

// router.get("/admin-sistema", new SeccionesController().adminConfiguracion);
// router.post("/admin-sistema", new SeccionesController().saveConfiguration);
// router.post("/admin-icon", new SeccionesController().saveFavicom);
// router.post("/admin-seo", new SeccionesController().saveSEO);
// router.get("/admin-sistema-general", new SeccionesController().getConfiguration);

// router.get("/admin-banners", new SeccionesController().getAdminBanner);
// router.post("/admin-banners", new SeccionesController().saveAdminBanner);
// router.put("/update-admin-banners", new SeccionesController().updateAdminBanner);
// router.delete("/delete-admin-banners", new SeccionesController().deleteAdminBanner);


// router.get("/admin-portadas", new SeccionesController().getAdminPortadas);

// router.get("/admin-metodos-pago", new SeccionesController().getMethodPayment);
// router.post("/update-method-payment", new SeccionesController().postMethodPayment);

// router.get("/admin-ventanas-emergentes", new SeccionesController().getPopUp);
// router.post("/admin-ventanas-emergentes", new SeccionesController().postPopUp);
// router.delete("/admin-ventanas-emergentes", new SeccionesController().deletePopUp);

// router.get("/admin-marcas", new SeccionesController().getBrands)
// router.post("/admin-marcas", new SeccionesController().postBrands)
// router.delete("/admin-marcas", new SeccionesController().deleteBrands)


router.get("/get-modulos", new SeccionesController().getModulos)

router.get('/get-sidebar-data', getSidebarData)


module.exports = router;
