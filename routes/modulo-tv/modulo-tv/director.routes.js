const { Router } = require("express"),
    router = Router();

const {
  DirectorController
} = require('../../../controllers/modulo-tv/modulo-tv/tv.controller');
const {  isAnyAuth, isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const {check} = require("express-validator");
router.get('/items',  DirectorController.index);

router.post('/items',
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('nacionalidad').optional().isString().withMessage('El campo nacionalidad debe ser un string'),
check('biografia').optional().isString().withMessage('El campo biografia debe ser un string'),
check('fecha_nacimiento').optional(),
check('genero').optional().isString().withMessage('El campo genero debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, DirectorController.save);

router.get('/items/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, DirectorController.show);

router.put('/items/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('nacionalidad').optional().isString().withMessage('El campo nacionalidad debe ser un string'),
check('biografia').optional().isString().withMessage('El campo biografia debe ser un string'),
check('fecha_nacimiento').optional(),
check('genero').optional().isString().withMessage('El campo genero debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, DirectorController.update);

router.delete('/items/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, DirectorController.delete);

router.get('/datatable/:id?', DirectorController.datatable);

router.get('/', async (req, res) => {
  try {
    const { token, role, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-tv/director/superadmin', {
        dataSession,
        dataSistema
      });
    }

    return res.render('modulo-tv/modulo-tv/director', {
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

    return res.render('modulo-tv/modulo-tv/director', {
      dataSession,
      dataSistema,
      empresa_id
    });
  } catch (error) {
    return catchError(res, error)
  }
});

module.exports = router