const { Router } = require("express"), router = Router();

const { ProductoCaracteristicaController } = require('../../../controllers/modulo-tv/modulo-paquetes/producto-caracteristicas.controller')
const { isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { check } = require("express-validator");

const { service: ProductoCaracteristicaService } = ProductoCaracteristicaController

router.post('/items',
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, ProductoCaracteristicaController.save);

router.put('/items/:id',
  check('id').optional().isNumeric().withMessage('El id debe ser un número'),
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, ProductoCaracteristicaController.update);

router.delete('/items/:id',
  check('id').optional().isNumeric().withMessage('El id debe ser un número'),
  EVResult, ProductoCaracteristicaController.delete);

router.get('/items/:id',
  check('id').optional().isNumeric().withMessage('El id debe ser un número'),
  EVResult, ProductoCaracteristicaController.show);

router.get('/items', ProductoCaracteristicaController.index);


router.get('/datatable/:id?', ProductoCaracteristicaController.datatable);

router.get('/', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-paquetes/caracteristicas/superadmin', {
        dataSession,
        dataSistema,
      })
    }

    res.render('modulo-tv/modulo-paquetes/caracteristicas', {
      dataSession,
      dataSistema,
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', isAdminSuperAdminMiddleware, 
check('id').optional().isNumeric().withMessage('El id debe ser un número'),
EVResult, async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);
    const { id } = req.params;


    res.render('modulo-tv/modulo-paquetes/caracteristicas', {
      dataSession,
      dataSistema,
      empresa_id: id,
    })
  } catch (error) {
    return catchError(res, error);
  }
});


module.exports = router
