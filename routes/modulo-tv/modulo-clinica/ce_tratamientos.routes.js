const { Router } = require("express"), router = Router();
const ServiceSQL = require('../../../services/services')

const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');

const { TratamientoController } = require('../../../controllers/modulo-tv/modulo-clinica/tratamiento.controller');
const { service: TratamientoService } = TratamientoController;

const { check } = require('express-validator');

const { EVResult } = require('../../../middlewares/EVResult.middleware');

const { isAdminSuperAdminMiddleware } = require("../../../middlewares/modulo-tv/isAdmin");

router.get('/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, TratamientoController.datatable);

router.get('/items',
  TratamientoController.index);

router.post('/items',
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
  check('costo').optional().isNumeric().withMessage('El campo costo debe ser un número'),
  check('duracion').optional().isNumeric().withMessage('El campo duracion debe ser un número'),
  check('frecuencia').optional().isNumeric().withMessage('El campo frecuencia debe ser un número'),
  check('modo_aplicacion').optional().isString().withMessage('El campo modo_aplicacion debe ser un string'),
  check('dosificacion').optional().isNumeric().withMessage('El campo dosificacion debe ser un string'),
  check('precauciones').optional().isString().withMessage('El campo precauciones debe ser un string'),
  check('efectos_secundarios').optional().isString().withMessage('El campo efectos_secundarios debe ser un string'),
  check('recomendaciones').optional().isString().withMessage('El campo recomendaciones debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult,
  TratamientoController.save);

router.get('/items/:id',

  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, TratamientoController.show);

router.put('/items/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
  check('costo').optional().isNumeric().withMessage('El campo costo debe ser un número'),
  check('duracion').optional().isNumeric().withMessage('El campo duracion debe ser un número'),
  check('frecuencia').optional().isNumeric().withMessage('El campo frecuencia debe ser un número'),
  check('modo_aplicacion').optional().isString().withMessage('El campo modo_aplicacion debe ser un string'),
  check('dosificacion').optional().isNumeric().withMessage('El campo dosificacion debe ser un string'),
  check('precauciones').optional().isString().withMessage('El campo precauciones debe ser un string'),
  check('efectos_secundarios').optional().isString().withMessage('El campo efectos_secundarios debe ser un string'),
  check('recomendaciones').optional().isString().withMessage('El campo recomendaciones debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, TratamientoController.update);

router.delete('/items/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, TratamientoController.delete);


router.get('/', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role === 1) {
      return res.render('modulo-tv/modulo-clinica/ce_tratamiento/superadmin', {
        dataSession,
        dataSistema
      });
    }

    let data = []
    data = await TratamientoService.getbyCompany(token);
    return res.render('modulo-tv/modulo-clinica/ce_tratamiento', {
      dataSession,
      dataSistema,
      empresa_id: token,
      data
    })

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult,
  async (req, res) => {
    try {
      const id = req.params.id;

      if (typeof parseInt(id) !== 'number') return notAuthorize(res);

      const { dataSession, dataSistema } = await getAllDataSession(req);

      const datos = await TratamientoService.getbyCompany(id);

      return res.render('modulo-tv/modulo-clinica/ce_tratamiento', {
        dataSession,
        dataSistema,
        empresa_id: id,
        data: datos
      });
    } catch (error) {
      return catchError(res, error);
    }
  });

module.exports = router