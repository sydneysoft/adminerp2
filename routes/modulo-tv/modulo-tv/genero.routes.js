const { Router } = require("express"),
    router = Router();

const {
    GeneroController
} = require('../../../controllers/modulo-tv/modulo-tv/tv.controller');
const {  isAnyAuth, isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { check } = require("express-validator");


router.get('/items',  GeneroController.index);

router.post('/items', 
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('estracto').optional().isString().withMessage('El campo estracto debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, GeneroController.save);

router.get('/items/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, GeneroController.show);

router.put('/items/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('estracto').optional().isString().withMessage('El campo estracto debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, GeneroController.update);

router.delete('/items/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, GeneroController.delete);

router.get('/datatable/:id?', GeneroController.datatable);

router.get('/', async (req, res) => {
  try {
    const { token, role, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-tv/genero/superadmin', {
        dataSession,
        dataSistema
      });
    }

    return res.render('modulo-tv/modulo-tv/genero/index', {
      dataSession,
      dataSistema
    });
  } catch (error) {
    return catchError(res, error)
  }
});

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, async (req, res) => {
  try {
    const { token, role, dataSession, dataSistema } = await getAllDataSession(req);

    const empresa_id = req.params.id;

    return res.render('modulo-tv/modulo-tv/genero/index', {
      dataSession,
      dataSistema,
      empresa_id
    });
  } catch (error) {
    return catchError(res, error)
  }
});

module.exports = router