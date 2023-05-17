const { Router } = require("express"), router = Router();
const ServiceSQL = require('../../../services/services')

const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers');

const {EspecialidadController, SedeController} = require('../../../controllers/modulo-tv/modulo-clinica/clinica.controller');
const { service: EspecialidadService } = EspecialidadController;
const { service: SedeService} = SedeController;
const { body, validationResult, oneOf, check, buildCheckFunction } = require('express-validator');
const { EVResult } = require('../../../middlewares/EVResult.middleware');
const { isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin')


router.get('/datatable/:id?',
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, EspecialidadController.datatable);

router.get('/items', EspecialidadController.index);
router.post('/items', 
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('codigoexterno').optional().isString().withMessage('El campo codigoexterno debe ser un string'),
check('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
check('activado').optional().isNumeric().withMessage('El campo activado debe ser un número'),
check('estado').optional().isNumeric().withMessage('El campo estado debe ser un número'),
check('sede').optional().isNumeric().withMessage('El campo sede debe ser un número'),
check('categoria').optional().isNumeric().withMessage('El campo categoria debe ser un número'),
check('descripcioncorta').optional().isString().withMessage('El campo descripcioncorta debe ser un string'),
check('descriptionlarga').optional().isString().withMessage('El campo descriptionlarga debe ser un string'),
check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult,
EspecialidadController.save);

router.get('/items/:id', 
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
EspecialidadController.show);

router.put('/items/:id', 
check('id').isNumeric().withMessage('El campo id debe ser un número'),
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('codigoexterno').optional().isString().withMessage('El campo codigoexterno debe ser un string'),
check('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
check('activado').optional().isNumeric().withMessage('El campo activado debe ser un número'),
check('estado').optional().isNumeric().withMessage('El campo estado debe ser un número'),
check('sede').optional().isNumeric().withMessage('El campo sede debe ser un número'),
check('categoria').optional().isNumeric().withMessage('El campo categoria debe ser un número'),
check('descripcioncorta').optional().isString().withMessage('El campo descripcioncorta debe ser un string'),
check('descriptionlarga').optional().isString().withMessage('El campo descriptionlarga debe ser un string'),
check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult,
EspecialidadController.update);


router.delete('/items/:id', 
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
EspecialidadController.delete);

router.get('/', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role === 1) {
      return res.render('modulo-tv/modulo-clinica/especialidad/superadmin', {
        dataSession,
        dataSistema
      });
    }

    const sedes = await SedeService.getTable().select(['id', 'nombre']).where('empresa_id', token);

    return res.render('modulo-tv/modulo-clinica/especialidad', {
      dataSession,
      dataSistema,
      empresa_id: token,
      sedes
    })

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id',
isAdminSuperAdminMiddleware,
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
async (req, res) => {
  try {
    const id = req.params.id;

    if (typeof parseInt(id) !== 'number') return notAuthorize(res);

    const { dataSession, dataSistema } = await getAllDataSession(req);

    const sedes = await SedeService.getTable().select(['id', 'nombre']).where('empresa_id', id);

    return res.render('modulo-tv/modulo-clinica/especialidad', {
      dataSession,
      dataSistema,
      empresa_id: id,
      // data: datos,
      sedes
    });
  } catch (error) {
    return catchError(res, error);
  }
});

module.exports = router