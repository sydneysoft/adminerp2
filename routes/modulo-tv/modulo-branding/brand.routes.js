const { Router } = require("express"), router = Router();

const { BrandController } = require('../../../controllers/modulo-tv/modulo-branding/brand.controller');
const {  isSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require('../../../middlewares/EVResult.middleware');
const { service: BrandService } = BrandController
const {check} = require('express-validator');

router.get('/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, BrandController.datatable);

router.get('/select2/:id?', BrandController.select2);


// brands	
// width	
// height	
// empresa_id

router.put('/brand/:id', 
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('brands').isJSON().withMessage('El brands debe ser un JSON'),
  check('width').optional().isNumeric().withMessage('El width debe ser un número'),
  check('height').optional().isNumeric().withMessage('El height debe ser un número'),
  check('empresa_id').optional().isNumeric().withMessage('El empresa_id debe ser un número'),
  EVResult, BrandController.update);

router.get('/',  async (req, res) => {
  try {
    let view = 'modulo-tv/modulo-branding/brand';
    let empresa_id = undefined;
    let data = [];

    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      view = 'modulo-tv/modulo-branding/brand/superadmin'
    } else if (role === 3) {
      view = 'modulo-tv/modulo-branding/brand'
      empresa_id = token;
      data = await BrandService.getbyCompany(empresa_id);
    }

    if (Array.isArray(data) && data.length === 0 && role !== 1) {
      await BrandService.save({ empresa_id });
      data = await BrandService.getbyCompany(empresa_id);
    }

    res.render(view, {
      dataSession,
      dataSistema,
      empresa_id,
      data
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', isSuperAdminMiddleware,
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);
    const { id } = req.params;

    if (typeof parseInt(id) !== 'number') return notAuthorize(res, 'No se ha encontrado la empresa');

    let datos = [];
    datos = await BrandService.getbyCompany(id);

    if (Array.isArray(datos) && datos.length === 0) {
      await BrandService.save({ empresa_id: id });
      datos = await BrandService.getbyCompany(id);
    }

    res.render('modulo-tv/modulo-branding/brand', {
      dataSession,
      dataSistema,
      empresa_id: id,
      data: datos
    })
  } catch (error) {
    return catchError(res, error);
  }
});


module.exports = router
