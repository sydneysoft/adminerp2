const { Router } = require("express"), router = Router();

const {ContactoController} = require('../../../controllers/modulo-tv/modulo-contacto/contacto.controller')
const { isAdminSuperAdminMiddleware} = require('../../../middlewares/modulo-tv/isAdmin');
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require('../../../middlewares/EVResult.middleware');
const {check} = require('express-validator');

const { service: ContactoService } = ContactoController
router.get('/contacto/crear',  ContactoController.createView);
router.get('/contacto/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, ContactoController.showView);
router.get('/contacto/editar/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, ContactoController.editeView);

router.get("/datatable/:id?", 
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult,ContactoController.datatable);

router.get('/contactos',  ContactoController.index);


router.post('/contactos',
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
check('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
check('ubicacion').optional().isString().withMessage('El campo ubicacion debe ser un string'),
check('correo').optional().isEmail().withMessage('El campo correo debe ser un email'),
check('telefono').optional().isString().withMessage('El campo telefono debe ser un string'),
check('horario_id').optional().isJSON().withMessage('El campo horario_id debe ser un JSON'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, ContactoController.save);

router.get('/contactos/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, ContactoController.show);

router.put('/contactos/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
check('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
check('ubicacion').optional().isString().withMessage('El campo ubicacion debe ser un string'),
check('correo').optional().isEmail().withMessage('El campo correo debe ser un email'),
check('telefono').optional().isString().withMessage('El campo telefono debe ser un string'),
check('horario_id').optional().isJSON().withMessage('El campo horario_id debe ser un JSON'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, ContactoController.update);

router.delete('/contactos/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, ContactoController.delete);

router.get('/',  async (req, res) => {
  try {
    let view = 'modulo-tv/modulo-contacto/contacto';
    let empresa_id = undefined;
    let data = [];
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      view = 'modulo-tv/modulo-contacto/contacto/superadmin'
    } else if( role === 3) {
      view = 'modulo-tv/modulo-contacto/contacto/index'
      empresa_id = token;
      data = await ContactoService.getbyCompany(empresa_id);
    }

    res.render(view, {
      dataSession,
      dataSistema,
      empresa_id,
      data
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', isAdminSuperAdminMiddleware, async(req, res) => {
  try {
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    const { id } = req.params;
    let datos = [];
    datos = await ContactoService.getbyCompany(id);
    console.log(datos);
    res.render('modulo-tv/modulo-contacto/contacto/empresa', {
      dataSession,
      dataSistema,
      empresa_id: id,
      data: datos
    })
  } catch (error) {
    return catchError(res, error);
  }
});


router.get('/empresa/:id/crear',isAdminSuperAdminMiddleware, async (req, res) => {
  try {
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    const { id } = req.params;
    res.render('modulo-tv/modulo-contacto/contacto/empresa-crear', {
      dataSession,
      dataSistema,
      empresa_id: id
    })
  } catch (error) {
    return catchError(res, error);
  }
});


module.exports = router
