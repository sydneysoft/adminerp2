const { Router } = require("express"),
    router = Router();

// ModulosController = require("../../controllers/modulo-generales/modulos-trash.controller");

const {RolController, RoleController, RoleModeloController, RolePermisoController} = require('../../controllers/modulo-generales/roles');

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');

const { oneOf, check, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

// DATATABLE AND SELECT2 ROUTES

router.get('/admin-roles/rol/datatable', RolController.datatable);
router.get('/admin-roles/rol/select2', RolController.select2);

router.get('/admin-roles/role/datatable', RoleController.datatable);
router.get('/admin-roles/role/select2', RoleController.select2);

router.get('/admin-roles/role-modelo/datatable', RoleModeloController.datatable);
router.get('/admin-roles/role-modelo/select2', RoleModeloController.select2);

router.get('/admin-roles/role-permiso/datatable', RolePermisoController.datatable);
router.get('/admin-roles/role-permiso/select2', RolePermisoController.select2);


// INDEX ROUTES
router.get('/admin-roles/rol/index', RolController.index);
router.get('/admin-roles/role/index', RoleController.index);
router.get('/admin-roles/role-modelo/index', RoleModeloController.index);
router.get('/admin-roles/role-permiso/index', RolePermisoController.index);

module.exports = router;
