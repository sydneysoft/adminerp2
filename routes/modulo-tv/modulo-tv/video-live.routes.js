const { Router } = require("express"),
    router = Router();

const { check } = require("express-validator");
const {VideoLiveController} = require('../../../controllers/modulo-tv/modulo-tv/video-live.controller');
const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const ServiceSQL = require("../../../services/services");

router.post('/',
check('url').optional().isString().withMessage('El campo url debe ser un string'),
check('recurso').optional().isString().withMessage('El campo recurso debe ser un string'),
check('embed').optional().isString().withMessage('El campo embed debe ser un string'),
check('seleccionado').optional().isNumeric().withMessage('El campo seleccionado debe ser un número'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, VideoLiveController.save);

router.put('/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
check('url').optional().isString().withMessage('El campo url debe ser un string'),
check('recurso').optional().isString().withMessage('El campo recurso debe ser un string'),
check('embed').optional().isString().withMessage('El campo embed debe ser un string'),
check('seleccionado').optional().isNumeric().withMessage('El campo seleccionado debe ser un número'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, VideoLiveController.update);

router.delete('/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, VideoLiveController.delete);

const { service: VideoService } = VideoLiveController
const empresaService = new ServiceSQL('usuarios');

/**
 * Ruta para la vista principal
 */
 router.get('/',  async (req, res) => {
  try {
    let empresas = [];
    let data = [];
    const { role, dataSession, dataSistema, token } = await getAllDataSession(req);
    
    if(role == 1 || role == 2) {

      return res.render('modulo-tv/modulo-tv/video-live/superadmin', {
        dataSession,
        dataSistema
      });

    }

    data = await VideoService.getbyCompany(token);

    if (data.length == 0) {
      await VideoService.save({empresa_id: token });
      data = await VideoService.getbyCompany(token);
    }

    return res.render('modulo-tv/modulo-tv/video-live', {
      dataSession,
      dataSistema,
      empresas,
      data
    })

  } catch (error) {
    return catchError(res, error);
  }
})

/**
 * Ruta para mostrar todos los datos de la empresa seleccionada
 */
 router.get('/empresa/:id', isAdminSuperAdminMiddleware,
 check('id').isNumeric().withMessage('El id debe ser un número'),
 EVResult, async (req, res) => {
  try {
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    const id = req.params.id; 
    
    let data = await VideoService.getbyCompany(id);

    if (data.length == 0) {
      await VideoService.save({empresa_id: id });
      data = await VideoService.getbyCompany(id);
    }

    return res.render('modulo-tv/modulo-tv/video-live', {
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