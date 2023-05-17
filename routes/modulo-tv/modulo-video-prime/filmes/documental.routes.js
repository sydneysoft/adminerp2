const { Router } = require("express"),
    router = Router();

const {catchError, getAllDataSession, notAuthorize} = require('../../../../helpers/modulo-tv/basicrequest.helpers');
const {DocumentalController} = require('../../../../controllers/modulo-tv/modulo-video-prime/filmes/documental.controller');
const ServiceSQL = require('../../../../services/services');
const { isAdminMiddleware } = require('../../../../middlewares/modulo-tv/isAdmin');
const { EVResult } = require("../../../../middlewares/EVResult.middleware");
const { check } = require("express-validator");
const empresaService = new ServiceSQL('usuarios');
const { service: documentalService } = DocumentalController


router.get('/crear', DocumentalController.createView)


/** Rutas que pueden ser usadas por el admin y usuario */
router.get('/documental/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, DocumentalController.show);

router.put('/documental/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, DocumentalController.update);

router.delete('/documental/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, DocumentalController.delete);

router.get('/editar/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, DocumentalController.editeView);

router.get('/mostrar/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, DocumentalController.showView);

router.post('/', DocumentalController.save);


/**
 * Ruta para la vista principal
 */
router.get('/', async (req, res) => {
  try {
    let view = 'modulo-tv/modulo-video-prime/documental/index'
    let empresas = [];
    let data = [];
    const { role, dataSession, dataSistema, token } = await getAllDataSession(req);
    
    if(role == 1 || role == 2) {
      view = 'modulo-tv/modulo-video-prime/documental/admin'
      empresas = await empresaService.getAll();
    } else if(role == 3) {
      data = await documentalService.getbyCompany(token);
    }

    return res.render(view, {
      dataSession,
      dataSistema,
      empresas,
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
router.get('/empresa/:id', isAdminMiddleware, async (req, res) => {
  try {
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    const id = req.params.id; 
    
    const data = await documentalService.getbyCompany(id);
    return res.render('modulo-video-prime/documental/admin-usuario', {
      dataSession, 
      dataSistema,
      data,
      empresa_id: id
    });

  } catch (error) {
    return catchError(res, error);
  }
});
/**
 * Ruta para poder crear un documental a la empresa seleccionada
 */
router.get('/empresa/:id/crear', isAdminMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const empresa = await empresaService.getById(id);
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    if(empresa.length === 1) {
      res.render('modulo-tv/modulo-video-prime/documental/admin-crear', {
        dataSession,
        dataSistema,
        empresa: empresa[0]
      })
    } else {

    }
  } catch (error) {
    return catchError(res, error);
  }
})

module.exports = router