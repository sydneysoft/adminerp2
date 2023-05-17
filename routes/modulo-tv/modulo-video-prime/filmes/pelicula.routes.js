const { Router } = require("express"),
    router = Router();

const {catchError, getAllDataSession, notAuthorize} = require('../../../../helpers/modulo-tv/basicrequest.helpers');
const {PeliculaController} = require('../../../../controllers/modulo-tv/modulo-video-prime/filmes/pelicula.controller');
const ServiceSQL = require('../../../../services/services');
const { isAdminMiddleware } = require('../../../../middlewares/modulo-tv/isAdmin');

const empresaService = new ServiceSQL('usuarios');
const { service: peliculaService } = PeliculaController


router.get('/crear', PeliculaController.createView)


/** Rutas que pueden ser usadas por el admin y usuario */
router.get('/pelicula/:id', PeliculaController.show)
router.put('/pelicula/:id', PeliculaController.update)
router.delete('/pelicula/:id', PeliculaController.delete)
router.get('/editar/:id', PeliculaController.editeView)
router.get('/mostrar/:id', PeliculaController.showView)
router.post('/', PeliculaController.save)


/**
 * Ruta para la vista principal
 */
router.get('/', async (req, res) => {
  try {
    let view = 'modulo-tv/modulo-video-prime/pelicula/index'
    let empresas = [];
    let data = [];
    const { role, dataSession, dataSistema, token } = await getAllDataSession(req);
    
    if(role == 1 || role == 2) {
      view = 'modulo-video-prime/pelicula/admin'
      empresas = await empresaService.getAll();
    } else if(role == 3) {
      data = await peliculaService.getbyCompany(token);
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
    
    const data = await peliculaService.getbyCompany(id);
    return res.render('modulo-tv/modulo-video-prime/pelicula/admin-usuario', {
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
 * Ruta para poder crear un pelicula a la empresa seleccionada
 */
router.get('/empresa/:id/crear', isAdminMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const empresa = await empresaService.getById(id);
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    if(empresa.length === 1) {
      res.render('modulo-tv/modulo-video-prime/pelicula/admin-crear', {
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