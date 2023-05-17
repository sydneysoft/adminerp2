const { Router } = require("express"), router = Router();

const {ItemListController} = require('../../../controllers/modulo-tv/modulo-itemlist/itemlist.controller');

const { isAdminSuperAdminMiddleware} = require('../../../middlewares/modulo-tv/isAdmin');
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { check } = require("express-validator");

const { service: ItemListService } = ItemListController

router.get('/datatable/:id?', ItemListController.datatable);

router.post('/items',
check('campos').isJSON().withMessage('El campo campos debe ser un JSON'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, ItemListController.save);

router.put('/items/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
check('campos').isJSON().withMessage('El campo campos debe ser un JSON'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, ItemListController.update);

router.delete('/items/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, ItemListController.delete);

router.get('/items/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, ItemListController.show);

router.get('/items',  ItemListController.index);


router.get('/',  async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-itemlist/list/superadmin', {
        dataSession,
        dataSistema,
      })
    } 

    let itemlists = await ItemListService.getbyCompany(token);
    
    if (Array.isArray(itemlists) && itemlists.length == 0) {
      await ItemListService.save({empresa_id: token});
      itemlists = await ItemListService.getbyCompany(token);
    }

    res.render('modulo-tv/modulo-itemlist/list', {
      dataSession,
      dataSistema,
      itemlists
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, async(req, res) => {
  try {
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    const { id } = req.params;

    let itemlists = await ItemListService.getbyCompany(id);
    
    if (Array.isArray(itemlists) && itemlists.length == 0) {
      await ItemListService.save({empresa_id: id});
      itemlists = await ItemListService.getbyCompany(id);
    }

    res.render('modulo-tv/modulo-itemlist/list', {
      dataSession,
      dataSistema,
      empresa_id: id,
      itemlists
    })
  } catch (error) {
    return catchError(res, error);
  }
});


module.exports = router
