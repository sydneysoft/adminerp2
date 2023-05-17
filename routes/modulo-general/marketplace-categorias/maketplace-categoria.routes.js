const { Router } = require("express"), router = Router();
const ServiceSQL = require('../../../services/services')
const {MarketplaceCategoriaController} = require('../../../controllers/modulo-tv/modulo-marketplace-categorias/marketplace-categorias.controller');
const {EmpresaMarketplaceController} = require('../../../controllers/modulo-tv/modulo-marketplace-categorias/empresa-marketplace.controller');

const { isAdminSuperAdminMiddleware} = require('../../../middlewares/modulo-tv/isAdmin');
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { check } = require("express-validator");

const {service: MarketplaceCategoriaService} = MarketplaceCategoriaController;
const {service: EmpresaMarketplaceService} = EmpresaMarketplaceController;
const EmpresaService = new ServiceSQL('empresas_marketplace');

router.get('/datatable/:id?', MarketplaceCategoriaController.datatable);


router.post('/items',
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('token').optional().isString().withMessage('El campo token debe ser un string'),
check('repository').optional().isString().withMessage('El campo repository debe ser un string'),
check('logo').optional().isString().withMessage('El campo logo debe ser un string'),
check('favicon').optional().isString().withMessage('El campo favicon debe ser un string'),
check('eslogan').optional().isString().withMessage('El campo eslogan debe ser un string'),
check('tipo_telefono').optional().isString().withMessage('El campo tipo_telefono debe ser un string'),
check('telefono').optional().isString().withMessage('El campo telefono debe ser un string'),
check('url_telefono').optional().isString().withMessage('El campo url_telefono debe ser un string'),
check('brands').optional().isJSON().withMessage('El campo brands debe ser un JSON'),
check('navbar').optional().isJSON().withMessage('El campo navbar debe ser un JSON'),
check('footer').optional().isJSON().withMessage('El campo footer debe ser un JSON'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, MarketplaceCategoriaController.save);

router.put('/items/:id',
check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
check('token').optional().isString().withMessage('El campo token debe ser un string'),
check('repository').optional().isString().withMessage('El campo repository debe ser un string'),
check('logo').optional().isString().withMessage('El campo logo debe ser un string'),
check('favicon').optional().isString().withMessage('El campo favicon debe ser un string'),
check('eslogan').optional().isString().withMessage('El campo eslogan debe ser un string'),
check('tipo_telefono').optional().isString().withMessage('El campo tipo_telefono debe ser un string'),
check('telefono').optional().isString().withMessage('El campo telefono debe ser un string'),
check('url_telefono').optional().isString().withMessage('El campo url_telefono debe ser un string'),
check('brands').optional().isJSON().withMessage('El campo brands debe ser un JSON'),
check('navbar').optional().isJSON().withMessage('El campo navbar debe ser un JSON'),
check('footer').optional().isJSON().withMessage('El campo footer debe ser un JSON'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, MarketplaceCategoriaController.update);

router.delete('/items/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, MarketplaceCategoriaController.delete);

router.get('/items/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, MarketplaceCategoriaController.show);

router.get('/items',  MarketplaceCategoriaController.index);


router.get('/',  async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    res.render('modulo-generales/marketplace-categorias/marketplace-categorias', {
      dataSession,
      dataSistema
      // caracteristicas
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.post('/categorias',  EmpresaMarketplaceController.save);

router.delete('/categorias/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, EmpresaMarketplaceController.delete);

router.get('/categoria/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    const { id } = req.params;


    const categoriable = await EmpresaMarketplaceService.getAll(); // relacion
    const categoria = await MarketplaceCategoriaService.getById(id); // categorias
    const empresas = await EmpresaService.getTable().select(['id', 'nombre']);

    if (Array.isArray(empresas) && Array.isArray(categoriable)) {
      empresas.forEach(empresa => {
        let cat = categoriable.filter(categoria => {
          return categoria.marketplace_id === empresa.id && categoria.marketplace_categoria_id == id
        });
        if (Array.isArray(cat) && cat.length > 0) empresa.categorias = cat;
      });
    }

    return res.render('modulo-generales/marketplace-categorias/categoria', {
      dataSession,
      dataSistema,
      categoriable,
      categoria,
      empresas
    });

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    const marketplace = await MarketplaceCategoriaService.getById(id); 

    return res.render('modulo-generales/marketplace-categorias/marketplace-categorias/edit', {
      dataSession,
      dataSistema,
      marketplace,
    });
  } catch (error) {
    return catchError(res, error);
  }
});




module.exports = router
