const { Router } = require("express"),
  router = Router(),
  { MenuItemController, MenuListController, FooterController } = require("../../../controllers/modulo-tv/modulo-ft/footer.controller");
const ServiceSQL = require('../../../services/services');
const { getAllDataSession, catchError, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers')
const { isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { check } = require("express-validator");

// Menu

router.get('/menu',
  EVResult, MenuListController.index);

router.post('/menu',
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('url').optional().isString().withMessage('El campo url debe ser un string'),
  check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
  check('menu_id').optional().isNumeric().withMessage('El campo menu_id debe ser un número'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, MenuListController.save);



router.get('/menu/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, MenuListController.show);

router.put('/menu/:id',
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('url').optional().isString().withMessage('El campo url debe ser un string'),
  check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
  check('menu_id').optional().isNumeric().withMessage('El campo menu_id debe ser un número'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, MenuListController.update);

router.delete('/menu/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, MenuListController.delete);

// Los items
router.get('/menu/item', MenuItemController.index);

router.get('/menu/item/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, MenuItemController.show);

router.put('/menu/item/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('url').optional().isString().withMessage('El campo url debe ser un string'),
  check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
  check('menu_id').optional().isNumeric().withMessage('El campo menu_id debe ser un número'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, MenuItemController.update);

router.post('/menu/item',
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('url').optional().isString().withMessage('El campo url debe ser un string'),
  check('icono').optional().isString().withMessage('El campo icono debe ser un string'),
  check('menu_id').optional().isNumeric().withMessage('El campo menu_id debe ser un número'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, MenuItemController.save);

router.delete('/menu/item/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, MenuItemController.delete);

router.get('/', async (req, res, next) => {
  // Servicio de usuarios
  try {
    const { dataSession, dataSistema, role, token } = await getAllDataSession(req)
    let view = 'modulo-tv/modulo-general/footer/usuario';
    let empresa_id = 0;
    if (role == 1 || role == 2) {
      view = 'modulo-tv/modulo-general/footer/superadmin';
    } else if (role == 3) {
      view = 'modulo-tv/modulo-general/footer/admin-usuario';
      empresa_id = token;
    }

    res.render(view, {
      dataSession,
      dataSistema,
      empresa_id
    })
  } catch (error) {
    return catchError(res, error);
  }

});

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, async (req, res, next) => {
  try {
    const { dataSession, dataSistema, role } = await getAllDataSession(req)
    const empresa_id = req.params.id
    res.render('modulo-tv/modulo-general/footer/admin-usuario', {
      dataSession,
      dataSistema,
      empresa_id
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/menus/:id',
check('id').isNumeric().withMessage('El id debe ser un número'), 
EVResult, async (req, res, next) => {
  try {

    const { dataSession, dataSistema, role } = await getAllDataSession(req)
    const empresa_id = req.params.id
    if (role == 1 || role == 2) {
      res.render('modulo-tv/modulo-general/footer/admin-usuario', {
        dataSession,
        dataSistema,
        empresa_id
      })
    } else {
      return res.redirect('/admin-footer');
    }
  } catch (error) {
    return catchError(res, error);
  }
})


router.get('/menus', new FooterController().getMenu);

router.get('/menus-admin/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, new FooterController().getMenuBy);

module.exports = router;
