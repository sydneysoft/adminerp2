const { Router } = require("express"),
    router = Router();

const {catchError, getAllDataSession} = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { MapController } = require('../../../controllers/modulo-tv/modulo-gmaps/map.controller');
const { isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { check } = require("express-validator");

const { service: mapService } = MapController


/** Rutas que pueden ser usadas por el admin y usuario */
router.put('/map/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('embed').optional().isString().withMessage('El campo embed debe ser un string'),
check('activo').optional().isNumeric().withMessage('El campo activo debe ser un número'),
check('sede_id').optional().isNumeric().withMessage('El campo sede_id debe ser un número'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult,  MapController.update);

router.delete('/map/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult,  MapController.delete);


/**
 * Ruta para la vista principal
 */
router.get('/', async (req, res) => {
  try {
    let view = 'modulo-tv/modulo-gmaps/map/index'
    let data = [];
    const { role, dataSession, dataSistema, token } = await getAllDataSession(req);
    
    if(role == 1 || role == 2) {
      view = 'modulo-tv/modulo-gmaps/map/superadmin'
    } else if(role == 3) {
      data = await mapService.getbyCompany(token);
    }

    if (Array.isArray(data) && data.length === 0 && role != 1) {
      await mapService.save({ empresa_id: token });
      data = await mapService.getbyCompany(token);
    }

    return res.render(view, {
      dataSession,
      dataSistema,
      data,
      empresa_id: token
    })

  } catch (error) {
    return catchError(res, error);
  }
})

/** Rutas que solo el administrador tiene acceso */

/**
 * Ruta para mostrar todos los datos de la empresa seleccionada
 */
router.get('/empresa/:id', isAdminSuperAdminMiddleware,
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, async (req, res) => {
  try {
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    const id = req.params.id; 
    let data = [];
    data = await mapService.getbyCompany(id);

    if (Array.isArray(data) && data.length === 0) {
      await mapService.save({ empresa_id: id });
      data = await mapService.getbyCompany(id);
    }

    return res.render('modulo-tv/modulo-gmaps/map/admin-usuario', {
      dataSession, 
      dataSistema,
      data,
      empresa_id: id
    });

  } catch (error) {
    return catchError(res, error);
  }
});

module.exports = router