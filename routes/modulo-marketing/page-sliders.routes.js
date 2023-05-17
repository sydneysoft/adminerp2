const { Router } = require("express"), router = Router();

const { buildCheckFunction, check, body, query, param } = require('express-validator');
const checkBodyAndQuery = buildCheckFunction(['body', 'query']);
const { isAdminSuperAdminMiddleware } = require('../../middlewares/modulo-tv/isAdmin');
const { PageSliderController } = require('../../controllers/modulo-marketing/page-slider.controller');
const { EVResult, EVResultView } = require("../../middlewares/EVResult.middleware");

const PageSlider = new PageSliderController();

router.get('/datatable/:id?',
  checkBodyAndQuery('draw').isInt({ min: 1 }),
  checkBodyAndQuery('start').isInt({ min: 0 }),
  checkBodyAndQuery('length').isInt({ min: 1 }),
  checkBodyAndQuery('order').isArray({ min: 1 }),
  PageSlider.datatable);

router.get("/", PageSlider.renderHomeView);
router.get("/empresa/:id",
  param('id').isNumeric().withMessage('El id debe ser un número'),
  EVResultView, PageSlider.renderSuperadminHomeView);

router.get('/slider/crear', PageSlider.createView);

router.get('/slider/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResultView, PageSlider.showView);

router.get('/slider/editar/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResultView, PageSlider.editeView);
// router.get('/', SliderController.indexView);

router.get('/sliders', PageSlider.index);


router.post('/sliders',
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
  check('url').optional().isString().withMessage('El campo url debe ser un string'),
  check('alt').optional().isString().withMessage('El campo alt debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, PageSlider.save);

router.get('/sliders/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, PageSlider.show);

router.put('/sliders/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
  check('url').optional().isString().withMessage('El campo url debe ser un string'),
  check('alt').optional().isString().withMessage('El campo alt debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, PageSlider.update);

router.delete('/sliders/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, PageSlider.delete);

router.get('/empresa/:empresa_id/editar/:id', isAdminSuperAdminMiddleware,
  param('empresa_id').isNumeric().withMessage('El id debe ser un número'),
  param('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, PageSlider.renderEditBySuperadmin);

router.get('/empresa/:empresa_id/crear', isAdminSuperAdminMiddleware,
  check('empresa_id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, PageSlider.renderCreateBySuperadmin);

module.exports = router
