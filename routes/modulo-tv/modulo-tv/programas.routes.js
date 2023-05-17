const { Router } = require("express"),
    router = Router();

const {
    ProgramaController,
    DirectorController,
    ActorController,
    ProductorController,
    GeneroController
} = require('../../../controllers/modulo-tv/modulo-tv/tv.controller');
const {  isAnyAuth, isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { check } = require("express-validator");

const {service: ProgramaService} = ProgramaController;

const { service: DirectorService } = DirectorController;
const { service: ActorService } = ActorController;
const { service: ProductorService } = ProductorController;
const { service: GeneroService } = GeneroController;


router.get('/items',  ProgramaController.index);

router.post('/items', 
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('slogan').optional().isString().withMessage('El campo slogan debe ser un string'),
check('estracto').optional().isString().withMessage('El campo estracto debe ser un string'),
check('foto_portada').optional().isString().withMessage('El campo foto_portada debe ser un string'),
check('num_temporadas').optional().isNumeric().withMessage('El campo num_temporadas debe ser un número'),
check('genero').optional().isJSON().withMessage('El campo genero debe ser un JSON'),
check('productor').optional().isJSON().withMessage('El campo productor debe ser un JSON'),
check('director').optional().isJSON().withMessage('El campo director debe ser un JSON'),
check('fecha_lanzamiento').optional(),
check('fecha').optional(),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, ProgramaController.save);

router.get('/items/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, ProgramaController.show);

router.put('/items/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('slogan').optional().isString().withMessage('El campo slogan debe ser un string'),
check('estracto').optional().isString().withMessage('El campo estracto debe ser un string'),
check('foto_portada').optional().isString().withMessage('El campo foto_portada debe ser un string'),
check('num_temporadas').optional().isNumeric().withMessage('El campo num_temporadas debe ser un número'),
check('genero').optional().isJSON().withMessage('El campo genero debe ser un JSON'),
check('productor').optional().isJSON().withMessage('El campo productor debe ser un JSON'),
check('director').optional().isJSON().withMessage('El campo director debe ser un JSON'),
check('fecha_lanzamiento').optional(),
check('fecha').optional(),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, ProgramaController.update);

router.delete('/items/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, ProgramaController.delete);

router.get('/datatable/:id?', ProgramaController.datatable);

router.get('/', async (req, res) => {
  try {
    const { token, role, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-tv/programa/superadmin', {
        dataSession,
        dataSistema
      });
    }

    return res.render('modulo-tv/modulo-tv/programa/index', {
      dataSession,
      dataSistema
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, async (req, res) => {
  try {
    const { token, role, dataSession, dataSistema } = await getAllDataSession(req);

    const empresa_id = req.params.id;

    return res.render('modulo-tv/modulo-tv/programa/index', {
      dataSession,
      dataSistema,
      empresa_id
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/crear', async (req, res) => {
  try {
    const { token, role, dataSession, dataSistema } = await getAllDataSession(req);
    const empresa_id = token;
    const directores = await DirectorService.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);
    const actores = await ActorService.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);
    const productores = await ProductorService.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);
    const generos = await GeneroService.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);

    return res.render('modulo-tv/modulo-tv/programa/crear', {
      dataSession,
      dataSistema,
      directores,
      actores,
      productores,
      generos
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id/crear', isAdminSuperAdminMiddleware,
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, async (req,res) => {
  try {
    const { token, role, dataSession, dataSistema } = await getAllDataSession(req);
    const empresa_id = req.params.id;

    const directores = await DirectorService.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);
    const actores = await ActorService.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);
    const productores = await ProductorService.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);
    const generos = await GeneroService.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);

    return res.render('modulo-tv/modulo-tv/programa/crear', {
      dataSession,
      dataSistema,
      empresa_id,
      directores,
      actores,
      productores,
      generos
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/editar/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, async (req, res) => {
  try {
    const { token, role, dataSession, dataSistema } = await getAllDataSession(req);
    const id = req.params.id;
    
    const programa = await ProgramaService.getById(id);

    const empresa_id = programa[0].empresa_id;

    const directores = await DirectorService.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);
    const actores = await ActorService.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);
    const productores = await ProductorService.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);
    const generos = await GeneroService.getTable().select(['id', 'nombre']).where('empresa_id', empresa_id);

    return res.render('modulo-tv/modulo-tv/programa/editar', {
      dataSession,
      dataSistema,
      empresa_id,
      programa,
      directores,
      actores,
      productores,
      generos
    });

  } catch (error) {
    return catchError(res, error);
  }
});


module.exports = router