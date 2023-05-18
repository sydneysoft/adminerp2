const { Router } = require("express"),
  router = Router();

const { SitioWebController } = require("../../controllers/modulo-generales/sitios-web.controller");

const SitioWeb = new SitioWebController();

// const { SitioWebController } = require('../../../controllers/modulo-tv/modulo-sitios-web/sitios-web.controller');
const { isAdminSuperAdminMiddleware } = require('../../middlewares/modulo-tv/isAdmin');
const { EVResult, EVResultView } = require("../../middlewares/EVResult.middleware");
const { check, param, body, oneOf } = require("express-validator");

// router.get('/crear',  SitioWebController.createView);


/** Rutas que pueden ser usadas por el admin y usuario */
router.get('/web/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResult, SitioWeb.show);

router.put('/web/:id', oneOf([
  check('nombre').not().isEmpty().withMessage('El nombre es requerido.'),
  check('logo').not().isEmpty().withMessage('El logo es requerido.'),
  check('eslogan').not().isEmpty().withMessage('El eslogan es requerido.'),
  // body('empresa_id').optional().isNumeric().withMessage('El id de la empresa debe ser un número.')
]), SitioWeb.update);


/**
 * Ruta para la vista principal
 */
router.get('/', SitioWeb.renderHomeView)

/** Rutas que solo el administrador tiene acceso */

/**
 * Ruta para mostrar todos los datos de la empresa seleccionada
 */
router.get('/empresa/:id',
  isAdminSuperAdminMiddleware,
  param('id').isNumeric().withMessage('El id de la empresa debe ser un número'),
  EVResultView, SitioWeb.renderSuperadminHomeView);

module.exports = router