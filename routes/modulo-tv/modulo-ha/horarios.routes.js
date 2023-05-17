const { Router } = require("express"), router = Router();
const { body, oneOf, check } = require('express-validator');

const { EVResult } = require('../../../middlewares/EVResult.middleware');

const { HorarioController } = require('../../../controllers/modulo-tv/modulo-ha/horarios.controller')

const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');

const { isSuperAdminMiddleware, isAdminSuperAdminMiddleware } = require("../../../middlewares/modulo-tv/isAdmin");
// router.get('/', HorarioController.indexView);

router.get('/datatable/:id?', HorarioController.datatable);
router.get('/select2/:id?', HorarioController.select2);

router.get('/horarios', HorarioController.index);
router.post('/horarios',
  body('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
  body('descripcion').optional().isString().withMessage('La descripcion debe ser un texto'),
  body('dia_de').not().isEmpty().escape().withMessage('El dia de inicio es requerido'),
  body('dia_a').not().isEmpty().escape().withMessage('El dia de fin es requerido'),
  body('hora_de').not().isEmpty().escape().withMessage('La hora de inicio es requerida'),
  body('hora_a').not().isEmpty().escape().withMessage('La hora de fin es requerida'),
  body('empresa_id').optional().isInt().withMessage('El id de la empresa debe ser un numero'),
  HorarioController.save);
router.get('/horarios/:id', HorarioController.show);

router.put('/horarios/:id',
  body('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
  body('descripcion').optional().isString().withMessage('La descripcion debe ser un texto'),
  body('dia_de').not().isEmpty().escape().withMessage('El dia de inicio es requerido'),
  body('dia_a').not().isEmpty().escape().withMessage('El dia de fin es requerido'),
  body('hora_de').not().isEmpty().escape().withMessage('La hora de inicio es requerida'),
  body('hora_a').not().isEmpty().escape().withMessage('La hora de fin es requerida'),
  body('empresa_id').optional().isInt().withMessage('El id de la empresa debe ser un numero'),
  HorarioController.update);

router.delete('/horarios/:id', HorarioController.delete);


const { service: horarioService } = HorarioController


/**
 * Esta ruta sirve para poder dar todos los resultados para una empresa en concrero
 * Usar para peticiones de empresas
 */
router.get('/for', async (req, res, next) => {
  const { token, role } = await getAllDataSession(req);
  try {
    let data = []
    if (role == 1 || role == 2) {
      data = await horarioService.getAll();
    } else if (role == 3) {
      data = await horarioService.getbyCompany(token)
    }
    return res.json({
      ok: true,
      data
    })
  } catch (error) {
    return catchError(req, error);
  }
})


/**
 * Esta ruta sirve para poder dar todos los resultados para una empresa en concrero
 * Usar para peticiones de administrados indicando una empresa
 */
router.get('/for/:id',
  check('id').isNumeric().withMessage('El id de la empresa debe ser un número'),
  EVResult, async (req, res, next) => {
    const { token, role } = await getAllDataSession(req);
    try {
      let data = []
      const empresa_id = req.params.id
      data = await horarioService.getbyCompany(empresa_id)
      return res.json({
        ok: true,
        data
      })
    } catch (error) {
      return catchError(req, error);
    }
  });

router.get('/', async (req, res) => {
  try {
    const { dataSession, dataSistema, role } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render("modulo-tv/modulo-ha/horario/superadmin", {
        dataSistema,
        dataSession
      });
    }
    res.render("modulo-tv/modulo-ha/horario", {
      dataSistema,
      dataSession
    })
  } catch (error) {
    catchError(res, error);
  }
});

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id de la empresa debe ser un número'),
  EVResult, async (req, res) => {
    try {
      const { token, dataSession, dataSistema, role } = await getAllDataSession(req);

      const empresa_id = req.params.id
      res.render('modulo-tv/modulo-ha/horario', {
        dataSistema,
        dataSession,
        empresa_id
      })

    } catch (error) {
      catchError(res, error);
    }
  })
module.exports = router
