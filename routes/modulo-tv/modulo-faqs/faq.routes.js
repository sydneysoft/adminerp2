const { Router } = require("express"),
    router = Router();

const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers');
const {check} = require('express-validator');
const {FAQController} = require('../../../controllers/modulo-tv/modulo-faqs/faqs/faqs.controller');
const ServiceSQL = require('../../../services/services');
const { isSuperAdminMiddleware, isAdminSuperAdminMiddleware, isAnyAuth } = require('../../../middlewares/modulo-tv/isAdmin');
const { EVResult } = require('../../../middlewares/EVResult.middleware');

const empresaService = new ServiceSQL('empresas_marketplace');
const { service: faqService } = FAQController

router.get('/crear',  FAQController.createView)


/** Rutas que pueden ser usadas por el admin y usuario */
router.get('/faq/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, FAQController.show)

router.put('/faq/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
check('pregunta').optional().isString().withMessage('El campo pregunta debe ser un string'),
check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
check('respuesta').optional().isString().withMessage('El campo respuesta debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, FAQController.update)

router.delete('/faq/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, FAQController.delete)

router.get('/editar/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, FAQController.editeView)

router.get('/mostrar/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, FAQController.showView)

router.post('/',
check('pregunta').optional().isString().withMessage('El campo pregunta debe ser un string'),
check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
check('respuesta').optional().isString().withMessage('El campo respuesta debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, FAQController.save)

router.get('/datatable/:id?', 
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, FAQController.datatable);

/**
 * @caeher
 * Ruta para la vista principal
 */
router.get('/',  async (req, res) => {
  try {
    const { role, dataSession, dataSistema, token } = await getAllDataSession(req);
    if(role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-faq/faq/superadmin', {
        dataSession,
        dataSistema
      });
    }
    return res.render('modulo-tv/modulo-faq/faq', {
      dataSession,
      dataSistema,
    })

  } catch (error) {
    return catchError(res, error);
  }
})

/** Rutas que solo el administrador tiene acceso */

/**
 * @caeher
 * Ruta para mostrar todos los datos de la empresa seleccionada
 */
router.get('/empresa/:id',  isAdminSuperAdminMiddleware,
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, async (req, res) => {
  try {
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    const id = req.params.id; 
    
    return res.render('modulo-tv/modulo-faq/faq', {
      dataSession, 
      dataSistema,
      empresa_id: id
    });

  } catch (error) {
    return catchError(res, error);
  }
});


module.exports = router