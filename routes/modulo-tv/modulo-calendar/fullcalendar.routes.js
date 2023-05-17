const { Router } = require("express"), router = Router();
const ServiceSQL = require('../../../services/services')

const { body, validationResult, oneOf, check, buildCheckFunction } = require('express-validator');
const { EVResult } = require('../../../middlewares/EVResult.middleware');
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');

const { FullCalendarController } = require('../../../controllers/modulo-tv/modulo-calendar/fullcalendar.controller');
const {  isSuperAdminMiddleware } = require("../../../middlewares/modulo-tv/isAdmin");
const { service: FullCalendarService } = FullCalendarController;

router.get('/settings',  FullCalendarController.index);

router.post('/settings', 
  check('campos').isJSON().withMessage('El campo campos debe ser un JSON'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult,
  FullCalendarController.save);

router.get('/settings/:id', 
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, FullCalendarController.show);

router.put('/settings/:id', 
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('campos').isJSON().withMessage('El campo campos debe ser un JSON'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, FullCalendarController.update);

router.get('/',  async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role === 1 || role === 2) {
      return res.render('modulo-tv/modulo-calendar/fullcalendar/superadmin', {
        dataSession,
        dataSistema
      });
    }

    let data = []
    data = await FullCalendarService.getbyCompany(token);

    if (Array.isArray(data) && data.length === 0) {
      await FullCalendarService.save({ empresa_id: token });
      data = await FullCalendarService.getbyCompany(token);
    }

    return res.render('modulo-tv/modulo-calendar/fullcalendar', {
      dataSession,
      dataSistema,
      empresa_id: token,
      data
    })

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, async (req, res) => {
    try {
      const id = req.params.id;

      if (typeof parseInt(id) !== 'number') return notAuthorize(res);

      const { dataSession, dataSistema } = await getAllDataSession(req);

      let data = [];
      data = await FullCalendarService.getbyCompany(id);

      if (Array.isArray(data) && data.length === 0) {
        await FullCalendarService.save({ empresa_id: id });
        data = await FullCalendarService.getbyCompany(id);
      }
      console.log(data);

      return res.render('modulo-tv/modulo-calendar/fullcalendar', {
        dataSession,
        dataSistema,
        data
      });
    } catch (error) {
      return catchError(res, error);
    }
  });


module.exports = router