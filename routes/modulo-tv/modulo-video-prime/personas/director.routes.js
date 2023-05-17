const { Router } = require("express"),
    router = Router();

const {catchError, getAllDataSession, notAuthorize} = require('../../../../helpers/modulo-tv/basicrequest.helpers');
const {DirectorController} = require('../../../../controllers/modulo-tv/modulo-video-prime/persona/director.controller');
const ServiceSQL = require('../../../../services/services');
const { isAdminMiddleware } = require('../../../../middlewares/modulo-tv/isAdmin');

const empresaService = new ServiceSQL('usuarios');
const { service: directorService } = DirectorController


router.get('/crear', DirectorController.createView)


/** Rutas que pueden ser usadas por el admin y usuario */
router.get('/director/:id', DirectorController.show)
router.put('/director/:id', DirectorController.update)
router.delete('/director/:id', DirectorController.delete)
router.get('/editar/:id', DirectorController.editeView)
router.get('/mostrar/:id', DirectorController.showView)
router.post('/', DirectorController.save)


/**
 * Ruta para la vista principal
 */
router.get('/', async (req, res) => {
  try {
    let view = 'modulo-tv/modulo-video-prime/director/index'
    let empresas = [];
    let data = [];
    const { role, dataSession, dataSistema, token } = await getAllDataSession(req);
    
    if(role == 1 || role == 2) {
      view = 'modulo-video-prime/director/admin'
      empresas = await empresaService.getAll();
    } else if(role == 3) {
      data = await directorService.getbyCompany(token);
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
    
    const data = await directorService.getbyCompany(id);
    return res.render('modulo-tv/modulo-video-prime/director/admin-usuario', {
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
 * Ruta para poder crear un director a la empresa seleccionada
 */
router.get('/empresa/:id/crear', isAdminMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const empresa = await empresaService.getById(id);
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    if(empresa.length === 1) {
      res.render('modulo-tv/modulo-video-prime/director/admin-crear', {
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