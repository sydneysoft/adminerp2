const { Router } = require("express"), router = Router();
const ServiceSQL = require('../../../services/services')

const { body, validationResult, oneOf, check, buildCheckFunction } = require('express-validator');
const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require('../../../middlewares/EVResult.middleware');
const { InfoContactoController } = require('../../../controllers/modulo-tv/modulo-formulario-contacto/informacion-contacto.controller')
const { isAdminSuperAdminMiddleware } = require("../../../middlewares/modulo-tv/isAdmin");
const { service: InfoContactoService } = InfoContactoController;


router.get('/items',  InfoContactoController.index);
router.post('/items',
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('compania').optional().isString().withMessage('El campo compania debe ser un string'),
check('email').optional().isEmail().withMessage('El campo email debe ser un email'),
check('telefono').optional().isString().withMessage('El campo telefono debe ser un string'),
check('mensaje').optional().isString().withMessage('El campo mensaje debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, InfoContactoController.save);

router.get('/items/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, InfoContactoController.show);

router.put('/items/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('compania').optional().isString().withMessage('El campo compania debe ser un string'),
check('email').optional().isEmail().withMessage('El campo email debe ser un email'),
check('telefono').optional().isString().withMessage('El campo telefono debe ser un string'),
check('mensaje').optional().isString().withMessage('El campo mensaje debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, InfoContactoController.update);

router.delete('/items/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, InfoContactoController.delete);

router.get('/datatable/:id?', 
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult,InfoContactoController.datatable);

router.get('/',  async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role === 1 || role === 2) {
      return res.render('modulo-tv/modulo-formulario-contacto/informacion/superadmin', {
        dataSession,
        dataSistema
      });
    }

    let data = []
    data = await InfoContactoService.getbyCompany(token);

    return res.render('modulo-tv/modulo-formulario-contacto/informacion', {
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
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, async (req, res) => {
  try {
    const id = req.params.id;

    if (typeof parseInt(id) !== 'number') return notAuthorize(res);

    const { dataSession, dataSistema } = await getAllDataSession(req);

    const datos = await InfoContactoService.getbyCompany(id);

    return res.render('modulo-tv/modulo-formulario-contacto/informacion/empresa', {
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