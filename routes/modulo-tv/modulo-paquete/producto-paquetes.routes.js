const { Router } = require("express"), router = Router();

const {ProductoPaqueteController} = require('../../../controllers/modulo-tv/modulo-paquetes/producto-paquetes.controller');
const {ProductoCaracteristicaController} = require('../../../controllers/modulo-tv/modulo-paquetes/producto-caracteristicas.controller');

const { isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require("../../../middlewares/EVResult.middleware");

const { service: ProductoPaqueteService } = ProductoPaqueteController
const { service: ProductoCaracteristicaService } = ProductoCaracteristicaController

const { check } = require("express-validator");

router.post('/items', 
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
check('precio').optional().isNumeric().withMessage('El campo precio debe ser un número'),
check('caracteristicas').optional().isJSON().withMessage('El campo caracteristicas debe ser un JSON'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, ProductoPaqueteController.save);

router.put('/items/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
check('precio').optional().isNumeric().withMessage('El campo precio debe ser un número'),
check('caracteristicas').optional().isJSON().withMessage('El campo caracteristicas debe ser un JSON'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, ProductoPaqueteController.update);

router.delete('/items/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult,  ProductoPaqueteController.delete);

router.get('/items/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult,  ProductoPaqueteController.show);

router.get('/items',  ProductoPaqueteController.index);


router.get('/datatable/:id?', ProductoPaqueteController.datatable);


router.get('/',  async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-paquetes/paquetes/superadmin', {
        dataSession,
        dataSistema,
      })
    } 

    const caracteristicas = await ProductoCaracteristicaService.getbyCompany(token);
    console.log(caracteristicas);
    res.render('modulo-tv/modulo-paquetes/paquetes', {
      dataSession,
      dataSistema,
      caracteristicas
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id',isAdminSuperAdminMiddleware,
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, async(req, res) => {
  try {
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    const { id } = req.params;

    const caracteristicas = await ProductoCaracteristicaService.getbyCompany(id);
    console.log(caracteristicas);

    res.render('modulo-tv/modulo-paquetes/paquetes', {
      dataSession,
      dataSistema,
      empresa_id: id,
      caracteristicas
    })
  } catch (error) {
    return catchError(res, error);
  }
});


module.exports = router
