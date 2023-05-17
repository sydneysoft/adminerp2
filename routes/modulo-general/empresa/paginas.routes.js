const { Router } = require("express"), router = Router();

const { PaginaController } = require('../../../controllers/modulo-generales/empresas/paginas.controller');
const { FormularioContactoController } = require('../../../controllers/modulo-tv/modulo-formulario-contacto/formulario-contacto.controller');

const { oneOf, check, body, param, query } = require('express-validator');
const { isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const { EVResult, EVResultView } = require("../../../middlewares/EVResult.middleware");

// const { service: PaginaService } = PaginaController;
// const { service: FormularioContactoService } = FormularioContactoController;

const Pagina = new PaginaController();

router.get('/datatable/:id?',
  checkBodyAndQuery('draw').isInt({ min: 1 }),
  checkBodyAndQuery('start').isInt({ min: 0 }),
  checkBodyAndQuery('length').isInt({ min: 1 }),
  checkBodyAndQuery('order').isArray({ min: 1 }),
  EVResult, Pagina.datatable);


router.get('/', Pagina.renderHomeView);

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
  param('id').isNumeric().withMessage('El id debe ser un número'),
  EVResultView, Pagina.renderSuperadminHomeView);

router.get('/pagina/crear', Pagina.createView);
router.get('/pagina/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Pagina.showView);

router.get('/paginas', Pagina.index);

router.post('/paginas',
  check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  check('estracto').optional().isString().withMessage('El campo estracto debe ser un string'),
  check('body').optional().isString().withMessage('El campo body debe ser un string'),
  check('tipo').optional().isString().withMessage('El campo tipo debe ser un string'),
  check('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
  check('identificador').optional().isString().withMessage('El campo identificador debe ser un string'),
  check('campos').optional().isJSON().withMessage('El campo campos debe ser un JSON'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, Pagina.save);

router.get('/paginas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Pagina.show);

router.put('/paginas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  check('estracto').optional().isString().withMessage('El campo estracto debe ser un string'),
  check('body').optional().isString().withMessage('El campo body debe ser un string'),
  check('tipo').optional().isString().withMessage('El campo tipo debe ser un string'),
  check('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
  check('identificador').optional().isString().withMessage('El campo identificador debe ser un string'),
  check('campos').optional().isJSON().withMessage('El campo campos debe ser un JSON'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  EVResult, Pagina.update);

router.delete('/paginas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Pagina.delete);

router.get('/pagina/editar/:id',
  param('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Pagina.renderPaginaEditar);


router.get('/empresa/:id/crear', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Pagina.renderSuperadminCreatePagina);

router.get('/contacto', Pagina.renderContactoPagina);

router.get('/contacto/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Pagina.renderSuperadminContactoPagina);


router.get('/nosotros', Pagina.renderNosotrosPagina);

router.get('/nosotros/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Pagina.renderSuperadminNosotrosPagina);

router.get('/politica', Pagina.renderPoliticaPagina);

router.get('/politica/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Pagina.renderSuperadminPoliticaPagina);


router.get('/cookie', Pagina.renderCookiePagina);

router.get('/cookie/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Pagina.renderSuperadminCookiePagina);

router.get('/mision', Pagina.renderMisionPagina);

router.get('/mision/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, Pagina.renderSuperadminMisionPagina);


module.exports = router
