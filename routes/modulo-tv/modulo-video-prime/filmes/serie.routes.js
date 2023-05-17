const { Router } = require("express"),
    router = Router();

const {catchError, getAllDataSession, notAuthorize} = require('../../../../helpers/modulo-tv/basicrequest.helpers');
const {SerieController} = require('../../../../controllers/modulo-tv/modulo-video-prime/filmes/serie.controller');
const ServiceSQL = require('../../../../services/services');
const { isAdminMiddleware } = require('../../../../middlewares/modulo-tv/isAdmin');

const empresaService = new ServiceSQL('usuarios');
const { service: serieService } = SerieController


router.get('/crear', SerieController.createView)


/** Rutas que pueden ser usadas por el admin y usuario */
router.get('/serie/:id', SerieController.show)
router.put('/serie/:id', SerieController.update)
router.delete('/serie/:id', SerieController.delete)
router.get('/editar/:id', SerieController.editeView)
router.get('/mostrar/:id', SerieController.showView)
router.post('/', SerieController.save)


/**
 * Ruta para la vista principal
 */
router.get('/', async (req, res) => {
  try {
    let view = 'modulo-tv/modulo-video-prime/serie/index'
    let empresas = [];
    let data = [];
    const { role, dataSession, dataSistema, token } = await getAllDataSession(req);
    
    if(role == 1 || role == 2) {
      view = 'modulo-tv/modulo-video-prime/serie/admin'
      empresas = await empresaService.getAll();
    } else if(role == 3) {
      data = await serieService.getbyCompany(token);
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
    
    const data = await serieService.getbyCompany(id);
    return res.render('modulo-tv/modulo-video-prime/serie/admin-usuario', {
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
 * Ruta para poder crear un serie a la empresa seleccionada
 */
router.get('/empresa/:id/crear', isAdminMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const empresa = await empresaService.getById(id);
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    if(empresa.length === 1) {
      res.render('modulo-tv/modulo-video-prime/serie/admin-crear', {
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