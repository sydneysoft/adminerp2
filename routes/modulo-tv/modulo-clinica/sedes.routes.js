const { Router } = require("express"), router = Router();
const ServiceSQL = require('../../../services/services')

const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers');

const {SedeController} = require('../../../controllers/modulo-tv/modulo-clinica/clinica.controller');
const {HorarioController} = require('../../../controllers/modulo-tv/modulo-ha/horarios.controller');
const { service: SedeService } = SedeController;
const { service: HorarioService } = HorarioController;

const { body, validationResult, oneOf, check, buildCheckFunction } = require('express-validator');
const checkBodyAndQuery = buildCheckFunction(['body', 'query']);
const { EVResult } = require('../../../middlewares/EVResult.middleware');

router.get('/datatable/:id', 
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, SedeController.datatable);

router.get('/items', SedeController.index);

router.post('/items', 
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
check('googlemap').optional().isString().withMessage('El campo googlemap debe ser un string'),
check('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
check('link').optional().isString().withMessage('El campo link debe ser un string'),
check('telefono').optional().isString().withMessage('El campo telefono debe ser un string'),
check('atencion').optional().isString().withMessage('El campo atencion debe ser un string'),
check('horario_atencion').optional().isJSON().withMessage('El campo horario_atencion debe ser un JSON'),
check('Categoria').optional().isString().withMessage('El campo Categoria debe ser un string'),
check('estado').optional().isNumeric().withMessage('El campo estado debe ser un numero'),
check('activado').optional().isNumeric().withMessage('El campo activado debe ser un numero'),
check('empresa_id').optional().isString().withMessage('El campo empresa_id debe ser un string'),
EVResult, SedeController.save);

router.get('/items/:id', 
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
SedeController.show);

router.put('/items/:id',
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
check('googlemap').optional().isString().withMessage('El campo googlemap debe ser un string'),
check('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
check('link').optional().isString().withMessage('El campo link debe ser un string'),
check('telefono').optional().isString().withMessage('El campo telefono debe ser un string'),
check('atencion').optional().isString().withMessage('El campo atencion debe ser un string'),
check('horario_atencion').optional().isJSON().withMessage('El campo horario_atencion debe ser un JSON'),
check('Categoria').optional().isString().withMessage('El campo Categoria debe ser un string'),
check('estado').optional().isNumeric().withMessage('El campo estado debe ser un numero'),
check('activado').optional().isNumeric().withMessage('El campo activado debe ser un numero'),
check('empresa_id').optional().isString().withMessage('El campo empresa_id debe ser un string'),
EVResult, SedeController.update);

router.delete('/items/:id', 
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
SedeController.delete);

router.get('/', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role === 1) {
      return res.render('modulo-tv/modulo-clinica/sede/superadmin', {
        dataSession,
        dataSistema
      });
    }

    const horarios = await HorarioService.getbyCompany(token);

    return res.render('modulo-tv/modulo-clinica/sede', {
      dataSession,
      dataSistema,
      empresa_id: token,
      horarios
    })

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', 
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
async (req, res) => {
  try {
    const id = req.params.id;

    if (typeof parseInt(id) !== 'number') return notAuthorize(res);

    const { dataSession, dataSistema } = await getAllDataSession(req);

    const auxHorarios = await HorarioService.getbyCompany(id);

    const horarios = auxHorarios.map((item) => {
      return {
        id: item.id,
        text: item.dia_de +'-'+ item.dia_a + ', ' + item.hora_de + '-'+ item.hora_a,
      }
    })

    return res.render('modulo-tv/modulo-clinica/sede', {
      dataSession,
      dataSistema,
      empresa_id: id,
      horarios
    });
  } catch (error) {
    return catchError(res, error);
  }
});

module.exports = router