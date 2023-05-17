const { Router } = require("express"), router = Router();
const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers');
const ServiceSQL = require('../../../services/services')
const { body, validationResult, oneOf, check } = require('express-validator');

const {SeguroController} = require('../../../controllers/modulo-tv/modulo-clinica/clinica.controller');

const {EVResult} = require('../../../middlewares/EVResult.middleware');
const {isAdminSuperAdminMiddleware} = require('../../../middlewares/modulo-tv/isAdmin');

router.get('/datatable/:id?',
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, SeguroController.datatable);

router.get('/items', SeguroController.index);

router.post('/items', 
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('numero_identificacion').optional().isString().withMessage('El campo numero_identificacion debe ser un string'),
check('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
check('tipo_seguro').optional().isString().withMessage('El campo tipo_seguro debe ser un string'),
check('cobertura').optional().isString().withMessage('El campo cobertura debe ser un string'),
check('correo').optional().isEmail().withMessage('El campo correo debe ser un string'),
check('celular').optional().isString().withMessage('El campo celular debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult,
SeguroController.save);

router.get('/items/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult,
SeguroController.show);

router.put('/items/:id', 
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('numero_identificacion').optional().isString().withMessage('El campo numero_identificacion debe ser un string'),
check('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
check('tipo_seguro').optional().isString().withMessage('El campo tipo_seguro debe ser un string'),
check('cobertura').optional().isString().withMessage('El campo cobertura debe ser un string'),
check('correo').optional().isEmail().withMessage('El campo correo debe ser un string'),
check('celular').optional().isString().withMessage('El campo celular debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, SeguroController.update);

router.delete('/items/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult,
SeguroController.delete)


router.get('/', async (req, res) => {
  try {

    const {role, token, dataSistema, dataSession } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-clinica/empresa-seguros/superadmin', {
        dataSession,
        dataSistema
      });
    }

    return res.render('modulo-tv/modulo-clinica/empresa-seguros', {
      dataSession,
      dataSistema
    });
  
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', 
isAdminSuperAdminMiddleware, 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult,
async (req, res) => {
  try {
    
    const {role, token, dataSistema, dataSession } = await getAllDataSession(req);
    const id = req.params.id;

    return res.render('modulo-tv/modulo-clinica/empresa-seguros', {
      dataSession,
      dataSistema,
      empresa_id: id
    })

  } catch (error) {
    return catchError(res, error);
  }
});

module.exports = router