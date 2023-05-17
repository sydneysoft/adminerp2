const { Router } = require("express"), router = Router();

const { ServicioController } = require('../../../controllers/modulo-tv/modulo-ceservicios/servicios.controller');
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { oneOf, check } = require('express-validator');

const { isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin')
const { service: ServicioService } = ServicioController;
const { EVResult } = require('../../../middlewares/EVResult.middleware')

router.get('/servicio/crear', ServicioController.createView);
router.get('/servicio/:id', ServicioController.showView);
router.get('/servicio/editar/:id', ServicioController.editeView);
// router.get('/', ServicioController.indexView);

router.get('/servicios', ServicioController.index);

router.post('/servicios',
  check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  check('estracto').optional().isString().withMessage('El campo estracto debe ser un string'),
  check('body').optional().isString().withMessage('El campo body debe ser un string'),
  check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
  check('icono_imagen').optional().isString().withMessage('El campo icono_imagen debe ser un string'),
  check('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, ServicioController.save);

router.get('/servicios/:id', ServicioController.show);

router.put('/servicios/:id',
  check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  check('estracto').optional().isString().withMessage('El campo estracto debe ser un string'),
  check('body').optional().isString().withMessage('El campo body debe ser un string'),
  check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
  check('icono_imagen').optional().isString().withMessage('El campo icono_imagen debe ser un string'),
  check('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, ServicioController.update);
router.delete('/servicios/:id', ServicioController.delete);

router.get('/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, ServicioController.datatable);


router.get('/', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-ceservicio/servicio/superadmin', {
        dataSession,
        dataSistema,
      });
    }

    return res.render('modulo-tv/modulo-ceservicio/servicio', {
      dataSession,
      dataSistema,
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', isAdminSuperAdminMiddleware, async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    const empresa_id = req.params.id;

    let data = []

    data = await ServicioService.getbyCompany(empresa_id);

    return res.render('modulo-tv/modulo-ceservicio/servicio', {
      dataSession,
      dataSistema,
      data,
      empresa_id
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id/crear', isAdminSuperAdminMiddleware, async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    const empresa_id = req.params.id;

    return res.render('modulo-tv/modulo-ceservicio/servicio/empresa-crear', {
      dataSession,
      dataSistema,
      empresa_id
    });
  } catch (error) {
    return catchError(res, error);
  }
});

module.exports = router
