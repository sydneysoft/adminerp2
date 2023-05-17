const { Router } = require("express"), router = Router();

const { NavbarController } = require('../../../controllers/modulo-tv/modulo-navbar/navbar.controller');

const {  isSuperAdminMiddleware, isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { check } = require("express-validator");

const { service: NavbarService } = NavbarController


// campos	
// empresa_id

router.post('/items',
check('nombre').optional().isJSON().withMessage('El campo nombre debe ser un JSON'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, NavbarController.save);

router.put('/items/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
check('nombre').optional().isJSON().withMessage('El campo nombre debe ser un JSON'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, NavbarController.update);

router.delete('/items/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, NavbarController.delete);

router.get('/items/:id',
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, NavbarController.show);

router.get('/items',  NavbarController.index);


// router.get('/datatable/:id?', NavbarController.datatable);
let auxNavbar = {
  el: 'ul',
  class: 'navbar-nav mr-auto',
  'data-name': 'Menu 1',
  'data-identifier': 'menu-1',
  children: [
    {
      el: 'li',
      class: 'nav-item active',
      'data-name': 'Home',
      'data-identifier': 'item-1',
      children: [
        {
          el: 'a',
          class: 'nav-link',
          href: '/',
          text: 'Home',
          'data-name': 'Home',
          'data-identifier': 'item-1.link-1'
        }
      ]
    },
    {
      el: 'li',
      class: 'nav-item',
      'data-name': 'Link',
      'data-identifier': 'item-2',
      children: [
        {
          el: 'a',
          class: 'nav-link',
          href: '/contacto',
          text: 'Contacto',
          'data-name': 'Link',
          'data-identifier': 'item-2.link-1'
        }
      ]
    },
    {
      el: 'li',
      class: 'nav-item',
      'data-name': 'Link',
      'data-identifier': 'item-3',
      children: [
        {
          el: 'a',
          class: 'nav-link',
          href: '/nosotros',
          text: 'Nosotros',
          'data-name': 'Link',
          'data-identifier': 'item-3.link-1'
        }
      ]
    }
  ]
}

router.get('/', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-navbar/navbar/superadmin', {
        dataSession,
        dataSistema,
      })
    }

    let navbar = await NavbarService.getbyCompany(token);

    if (Array.isArray(navbar) && navbar.length == 0) {
      await NavbarService.save({ 
        empresa_id: token,
        campos: JSON.stringify([auxNavbar])
      });
      navbar = await NavbarService.getbyCompany(token);
      navbar[0].campos = JSON.parse(navbar[0].campos);
    }

    res.render('modulo-tv/modulo-navbar/navbar', {
      dataSession,
      dataSistema,
      navbar
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', isAdminSuperAdminMiddleware, async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);
    const { id } = req.params;

    let navbar = await NavbarService.getbyCompany(id);

    if (Array.isArray(navbar) && navbar.length == 0) {
      await NavbarService.save({ 
        empresa_id: id,
        campos: JSON.stringify([auxNavbar])
      });
      navbar = await NavbarService.getbyCompany(id);
      navbar[0].campos = JSON.parse(navbar[0].campos);
    }

    res.render('modulo-tv/modulo-navbar/navbar', {
      dataSession,
      dataSistema,
      empresa_id: id,
      navbar
    })
  } catch (error) {
    return catchError(res, error);
  }
});


module.exports = router
