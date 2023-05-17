const { Router } = require("express"),
    router = Router();



const { body, validationResult, oneOf, check } = require('express-validator');
const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { SitioWebController } = require('../../../controllers/modulo-tv/modulo-sitios-web/sitios-web.controller');
const ServiceSQL = require('../../../services/services');
const {  isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const { EVResult } = require("../../../middlewares/EVResult.middleware");

const empresaService = new ServiceSQL('empresas_marketplace');

const { service: webService } = SitioWebController;


router.get('/crear',  SitioWebController.createView);


/** Rutas que pueden ser usadas por el admin y usuario */
router.get('/web/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, SitioWebController.show);

router.put('/web/:id',   oneOf([
  check('nombre').not().isEmpty().withMessage('El nombre es requerido.'),
  check('logo').not().isEmpty().withMessage('El logo es requerido.'),
  check('eslogan').not().isEmpty().withMessage('El eslogan es requerido.'),
]), SitioWebController.update);

router.post('/',  oneOf([
  check('nombre').not().isEmpty().withMessage('El nombre es requerido.'),
  check('logo').not().isEmpty().withMessage('El logo es requerido.'),
  check('eslogan').not().isEmpty().withMessage('El eslogan es requerido.'),
]) ,SitioWebController.save);



/**
 * Ruta para la vista principal
 */
router.get('/',  async (req, res) => {
  try {
    let view = 'modulo-tv/modulo-sitios-web/web/index'
    // let empresas = [];
    let data = [];
    const { role, dataSession, dataSistema, token } = await getAllDataSession(req);
    
    if(role == 1 || role === 2) {
      view = 'modulo-tv/modulo-sitios-web/web/superadmin'
      return res.render(view, {
        dataSession,
        dataSistema,
      })
    } else if(role == 3) {
      data = await webService.getbyCompany(token);
    }

    if (Array.isArray(data) && data.length == 0) {
      await webService.save({ empresa_id: token });
      data = await webService.getbyCompany(token);
    }

    return res.render(view, {
      dataSession,
      dataSistema,
      data
    })

  } catch (error) {
    return catchError(res, error);
  }
})

/** Rutas que solo el administrador tiene acceso */

/**
 * Ruta para mostrar todos los datos de la empresa seleccionada
 */
router.get('/empresa/:id', isAdminSuperAdminMiddleware,
check('id').isNumeric().withMessage('El id debe ser un numero'),
EVResult, async (req, res) => {
  try {
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    const id = req.params.id; 
    let data = []
    data = await webService.getbyCompany(id);

    if (Array.isArray(data) && data.length == 0) {
      await webService.save({ empresa_id: id });
      data = await webService.getbyCompany(id);
    }

    return res.render('modulo-tv/modulo-sitios-web/web/empresa', {
      dataSession, 
      dataSistema,
      data,
      empresa_id: id
    });

  } catch (error) {
    return catchError(res, error);
  }
});

module.exports = router