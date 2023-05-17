const { Router } = require("express"),
    router = Router(),
    UsuarioController = require("../../controllers/modulo-usuarios/usuario.controller");

router.get("/", new UsuarioController().render);
router.get("/tablas/:id", new UsuarioController().getTables);
router.get("/data/:id", new UsuarioController().obtenerDatos);
router.get("/categoria/:id", new UsuarioController().obtenerCategorias);
// router.post("/", new RegistroController().save);
// router.post("/categoria", new RegistroController().saveCategoria);
router.put("/datos/:id", new UsuarioController().actualizar);
router.post("/categoria/:id", new UsuarioController().actualizarCategorias);
// router.delete("/:id", new StockController().deleteById);

module.exports = router;
