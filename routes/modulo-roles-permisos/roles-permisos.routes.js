const { Router } = require("express"), router = Router();

// const {ProductoPaqueteController} = require('../../../controllers/modulo-tv/modulo-paquetes/producto-paquetes.controller');
// const {ProductoCaracteristicaController} = require('../../../controllers/modulo-tv/modulo-paquetes/producto-caracteristicas.controller');
// const { service: ProductoPaqueteService } = ProductoPaqueteController
// const { service: ProductoCaracteristicaService } = ProductoCaracteristicaController

const RolesController = require('../../controllers/modulo-roles-permisos/roles.controller');
const {PermisosController} = require('../../controllers/modulo-roles-permisos/permisos.controller');

const { roles: RoleService,rol_permisos: RolPermisoService } = new RolesController();

const {isAnyAuth, isSuperAdminMiddleware} = require('../../middlewares/modulo-tv/isAdmin');
const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');

router.post('/create/:id?', new RolesController().createRol); // nombre, identificador, id -> empresa_id

router.put('/update', new RolesController().updateRol); //enviar {identificador, nombre}

router.delete('/delete', new RolesController().deleteRol); // enviar {identificador}

router.put('/assign', new RolesController().asignarPermisos); // enviar identificador -> rol.identificador, permisos -> array de permisos [{identificador, 'id'}]

router.get('/permisos', new RolesController().getPermisos); // enviar {identificador} -> rol.identificador

router.get('/roles/:id?', new RolesController().getRoles); // id -> empresa_id

router.get('/role/:identificador', new RolesController().getRol); // identificador -> rol.identificador

router.get('/modelo/rol/:modelo_id', new RolesController().getRolByModelo); // modelo_id -> {modelo}.id modelo can be empresas, sucursales, usuarios...

router.put('/assign-modelo', new RolesController().asignarRolModelo); // enviar {modelo, modelo_id, rol_id} -> {modelo}.id, rol.id

router.delete('/assign-modelo', new RolesController().deleteRolModelo); // enviar {modelo, modelo_id, rol_id} -> {modelo}.id, rol.id

router.get('/datatable/:id?', new RolesController().datatable); // id -> empresa_id

router.get('/', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1) { }

    res.render('modulo-roles-permisos/roles-permisos/superadmin', {
      dataSession,
      dataSistema,
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);
    const { id } = req.params;

    res.render('modulo-roles-permisos/roles-permisos', {
      dataSession,
      dataSistema,
      empresa_id: id,
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/allpermisos', new PermisosController().getPermisos);

router.get('/empresa/:empresa_id/rol/:rol_id', async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);
    const { empresa_id, rol_id } = req.params;

    const rol = await RoleService.getTable().where({ id: rol_id }).first();
    // const permisos_ids = await RolPermisoService.getTable().where({ rol_id }).select('permiso_id');
    // const permisos = new PermisosController().getPermisosByIds(permisos_ids.map(p => p.permiso_id));

    res.render('modulo-roles-permisos/roles-permisos/rol', {
      dataSession,
      dataSistema,
      empresa_id,
      rol_id,
      rol,
      // permisos
    });
  } catch (error) {
    return catchError(res, error);
  }
});

module.exports = router
