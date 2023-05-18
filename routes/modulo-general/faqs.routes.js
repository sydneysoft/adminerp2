const { Router } = require("express"),
  router = Router();

const {check, body, param, query} = require('express-validator');
const {catchError, getAllDataSession, notAuthorize} = require('../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult,EVResultView } = require('../../middlewares/EVResult.middleware');
const { isAdminSuperAdminMiddleware } = require('../../middlewares/modulo-tv/isAdmin');

const {FaqController } = require("../../controllers/modulo-generales/faqs.controller");
const Faq = new FaqController();


router.get('/datatable/:id?', 
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, Faq.datatable);


/** Rutas que pueden ser usadas por el admin y usuario */
router.get('/faq/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, Faq.show)

router.put('/faq/:id',
param('id').isNumeric().withMessage('El campo id debe ser un número'),
body('pregunta').optional().isString().withMessage('El campo pregunta debe ser un string'),
body('icono').optional().isString().withMessage('El campo icono debe ser un string'),
body('respuesta').optional().isString().withMessage('El campo respuesta debe ser un string'),
body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, Faq.update)

router.delete('/faq/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, Faq.delete)

router.post('/',
body('pregunta').optional().isString().withMessage('El campo pregunta debe ser un string'),
body('icono').optional().isString().withMessage('El campo icono debe ser un string'),
body('respuesta').optional().isString().withMessage('El campo respuesta debe ser un string'),
body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, Faq.save)

/**
 * Ruta para la vista principal
 */
router.get('/',  Faq.renderHomeView)

/** Rutas que solo el administrador tiene acceso */

/**
 * Ruta para mostrar todos los datos de la empresa seleccionada
 */
router.get('/empresa/:id',  isAdminSuperAdminMiddleware,
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, Faq.renderSuperadminHomeView);


module.exports = router