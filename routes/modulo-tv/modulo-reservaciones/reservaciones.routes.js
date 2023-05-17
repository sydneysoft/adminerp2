const { Router } = require("express"), router = Router();
const ServiceSQL = require('../../../services/services')

const { body, validationResult, oneOf, check, buildCheckFunction } = require('express-validator');
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');

const { ReservacionController } = require('../../../controllers/modulo-tv/modulo-reservaciones/reservaciones.controller');
const { FullCalendarController } = require('../../../controllers/modulo-tv/modulo-calendar/fullcalendar.controller');
const { isAdminSuperAdminMiddleware } = require("../../../middlewares/modulo-tv/isAdmin");
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { service: ReservacionService } = ReservacionController;
const { service: FullCalendarService } = FullCalendarController;
const checkBodyAndQuery = buildCheckFunction(['body', 'query']);

router.get('/items', ReservacionController.index);


router.post('/items',
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('usuario_id').optional().isNumeric().withMessage('El campo usuario_id debe ser un número'),
  check('correo').optional().isEmail().withMessage('El campo correo debe ser un email'),
  check('celular').optional().isString().withMessage('El campo celular debe ser un string'),
  check('start').optional(),
  check('end').optional(),
  check('color').optional().isString().withMessage('El campo color debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, ReservacionController.save);

router.get('/items/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResult, ReservacionController.show);

router.put('/items/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('usuario_id').optional().isNumeric().withMessage('El campo usuario_id debe ser un número'),
  check('correo').optional().isEmail().withMessage('El campo correo debe ser un email'),
  check('celular').optional().isString().withMessage('El campo celular debe ser un string'),
  check('start').optional(),
  check('end').optional(),
  check('color').optional().isString().withMessage('El campo color debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, ReservacionController.update);

router.delete('/items/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResult, ReservacionController.delete);

router.get('/datatable/:id?',
  checkBodyAndQuery('draw').isInt({ min: 1 }),
  checkBodyAndQuery('start').isInt({ min: 0 }),
  checkBodyAndQuery('length').isInt({ min: 1 }),
  checkBodyAndQuery('order').isArray({ min: 1 }),
  ReservacionController.datatable);

router.get('/', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role === 1 || role === 2) {
      return res.render('modulo-tv/modulo-reservaciones/reservacion/superadmin', {
        dataSession,
        dataSistema
      });
    }

    let data = []
    data = await ReservacionService.getbyCompany(token);

    let configuracion = [];
    configuracion = await FullCalendarService.getbyCompany(token);
    if (data.length == 0) {
      await FullCalendarService.save({ empresa_id: token });
      configuracion = await FullCalendarService.getbyCompany(token);
    }
    return res.render('modulo-tv/modulo-reservaciones/reservacion', {
      dataSession,
      dataSistema,
      empresa_id: token,
      data,
      configuracion
    })

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResult, async (req, res) => {
    try {
      const id = req.params.id;

      if (typeof parseInt(id) !== 'number') return notAuthorize(res);

      const { dataSession, dataSistema } = await getAllDataSession(req);

      let data = []
      data = await ReservacionService.getbyCompany(id);

      let configuracion = [];
      configuracion = await FullCalendarService.getbyCompany(id);
      if (configuracion.length == 0) {
        await FullCalendarService.save({ empresa_id: id });
        configuracion = await FullCalendarService.getbyCompany(id);
      }

      return res.render('modulo-tv/modulo-reservaciones/reservacion', {
        dataSession,
        dataSistema,
        empresa_id: id || 0,
        data,
        configuracion
      });
    } catch (error) {
      return catchError(res, error);
    }
  });


router.get('/calendario/:id?',
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
EVResult, async (req, res) => {
  try {
    let data = [];
    const { role, token } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      if (req.params.id) {
        data = await ReservacionService.getbyCompany(req.params.id);
      } else {
        data = await ReservacionService.getAll();
      }
    } else if (role == 3) {
      data = await ReservacionService.getbyCompany(token);
    }

    // bloque para los eventos en el calendario
    let calendar = []
    if (Array.isArray(data)) {
      calendar = data.map(item => {
        // console.log(item)
        return ({
          id: item.id,
          title: item.nombre,
          start: new Date(item.start),
          end: new Date(item.end),
          color: item.color,
          data: item
        });
      })
    }
    return res.json({
      ok: true,
      data: calendar
    })
  } catch (error) {
    return catchError(res, error);
  }
});


module.exports = router