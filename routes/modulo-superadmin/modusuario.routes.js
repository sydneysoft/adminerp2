const { Router } = require("express"),
    router = Router();

const {isAdminMiddleware, isAdminSuperAdminMiddleware} = require('../../middlewares/modulo-tv/isAdmin');
const {UsuarioController: ModUsuario} = require('../../controllers/modulo-tv/modulo-superadmin/modusuarios.controller');

router.get('/', isAdminSuperAdminMiddleware, new ModUsuario().indexShow);
router.put('/:id', isAdminSuperAdminMiddleware, new ModUsuario().update);
router.get('/:id', isAdminSuperAdminMiddleware, new ModUsuario().userShow);

module.exports = router;
