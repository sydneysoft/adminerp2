const { Router } = require("express"), router = Router();

const { PaginaController } = require('../../../controllers/modulo-tv/modulo-paginas/paginas.controller');
const { FormularioContactoController } = require('../../../controllers/modulo-tv/modulo-formulario-contacto/formulario-contacto.controller');

const { oneOf, check, buildCheckFunction } = require('express-validator');
const checkBodyAndQuery = buildCheckFunction(['body', 'query']);

const { catchError, getAllDataSession } = require('../../../helpers/modulo-tv/basicrequest.helpers');

const { service: PaginaService } = PaginaController;
const { service: FormularioContactoService } = FormularioContactoController;
const { isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const { EVResult } = require("../../../middlewares/EVResult.middleware");

router.get('/pagina/crear', PaginaController.createView);
router.get('/pagina/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, PaginaController.showView);

router.get('/paginas', PaginaController.index);

router.post('/paginas',
  check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  check('estracto').optional().isString().withMessage('El campo estracto debe ser un string'),
  check('body').optional().isString().withMessage('El campo body debe ser un string'),
  check('tipo').optional().isString().withMessage('El campo tipo debe ser un string'),
  check('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
  check('identificador').optional().isString().withMessage('El campo identificador debe ser un string'),
  check('campos').optional().isJSON().withMessage('El campo campos debe ser un JSON'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, PaginaController.save);

router.get('/paginas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, PaginaController.show);

router.put('/paginas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  check('estracto').optional().isString().withMessage('El campo estracto debe ser un string'),
  check('body').optional().isString().withMessage('El campo body debe ser un string'),
  check('tipo').optional().isString().withMessage('El campo tipo debe ser un string'),
  check('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
  check('identificador').optional().isString().withMessage('El campo identificador debe ser un string'),
  check('campos').optional().isJSON().withMessage('El campo campos debe ser un JSON'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  EVResult, PaginaController.update);

router.delete('/paginas/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, PaginaController.delete);

router.get('/pagina/editar/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, async (req, res) => {
    try {
      const { token, dataSession, dataSistema, role } = await getAllDataSession(req);

      const id = req.params.id
      const data = await PaginaService.getById(id);

      let formulario_contactos = [];
      if (Array.isArray(data) && data.length > 0) {
        formulario_contactos = await FormularioContactoService.getbyCompany(data[0].empresa_id);
      }

      return res.render('modulo-tv/modulo-paginas/pagina/edite', {
        dataSession,
        dataSistema,
        data: data[0],
        formulario_contactos
      });

    } catch (error) {
      catchError(res, error)
    }
  });

router.get('/datatable',
  checkBodyAndQuery('draw').isInt({ min: 1 }),
  checkBodyAndQuery('start').isInt({ min: 0 }),
  checkBodyAndQuery('length').isInt({ min: 1 }),
  checkBodyAndQuery('order').isArray({ min: 1 }),
  async (req, res) => {
    try {
      const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
      let data = []
      if (role === 2 || role === 1) {
        data = await PaginaService.getAll();
      } else if (role === 3) {
        data = await PaginaService.getbyCompany(token);
      }

      res.json({
        ok: true,
        msg: 'Datos obtenidos correctamente',
        data
      })
    } catch (error) {
      return catchError(res, error);
    }
  });

router.get('/', async (req, res) => {
  try {
    view = 'modulo-tv/modulo-paginas/pagina';
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role === 1 || role === 2) {
      view = 'modulo-tv/modulo-paginas/pagina/superadmin';
    }

    res.render(view, {
      dataSession,
      dataSistema
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, async (req, res) => {
    try {
      const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
      const empresa_id = req.params.id;

      const data = await PaginaService.getbyCompany(empresa_id);

      return res.render('modulo-tv/modulo-paginas/pagina/empresa', {
        dataSession,
        dataSistema,
        data,
        empresa_id
      })
    } catch (error) {
      return catchError(res, error);
    }
  });

router.get('/empresa/:id/crear', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, async (req, res) => {
    try {
      const { dataSession, dataSistema } = await getAllDataSession(req);
      const empresa_id = req.params.id;
      let formulario_contactos;
      formulario_contactos = await FormularioContactoService.getbyCompany(empresa_id);
      return res.render('modulo-tv/modulo-paginas/pagina/empresa-crear', {
        dataSession,
        dataSistema,
        empresa_id,
        formulario_contactos
      })
    } catch (error) {
      return catchError(res, error);
    }
  });

router.get('/contacto', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-paginas/contacto/superadmin', {
        dataSession,
        dataSistema
      });
    }

    let pagina = [];
    pagina = await PaginaService.getTable().where('empresa_id', token).where('identificador', 'contacto');
    if (Array.isArray(pagina) && pagina.length == 0) {
      await PaginaService.save({ identificador: 'contacto', empresa_id: token });
      pagina = await PaginaService.getTable().where('empresa_id', token).where('identificador', 'contacto');
    }

    let formulario_contactos = await FormularioContactoService.getbyCompany(token);
    return res.render('modulo-tv/modulo-paginas/contacto', {
      dataSession,
      dataSistema,
      pagina: pagina[0],
      empresa_id: token,
      formulario_contactos
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/pasos', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-paginas/pasos/superadmin', {
        dataSession,
        dataSistema
      });
    }

    let pagina = [];
    pagina = await PaginaService.getTable().where('empresa_id', token);
    if (Array.isArray(pagina) && pagina.length == 0) {
      await PaginaService.save({ identificador: 'pasos', empresa_id: token });
      pagina = await PaginaService.getTable().where('empresa_id', token);
    }

    let formulario_contactos = await FormularioContactoService.getbyCompany(token);
    return res.render('modulo-tv/modulo-paginas/pasos', {
      dataSession,
      dataSistema,
      pagina: pagina[0],
      empresa_id: token,
      formulario_contactos
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/contacto/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, async (req, res) => {
    try {

      const { dataSession, dataSistema } = await getAllDataSession(req);
      const empresa_id = req.params.id;
      let pagina = [];

      pagina = await PaginaService.getTable().where('empresa_id', empresa_id).where('identificador', 'contacto');
      if (Array.isArray(pagina) && pagina.length == 0) {
        await PaginaService.save({ identificador: 'contacto', empresa_id });
        pagina = await PaginaService.getTable().where('empresa_id', empresa_id).where('identificador', 'contacto');
      }

      let formulario_contactos = await FormularioContactoService.getbyCompany(empresa_id);

      return res.render('modulo-tv/modulo-paginas/contacto', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id,
        formulario_contactos
      });

    } catch (error) {
      return catchError(res, error);
    }
  });


router.get('/nosotros', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-paginas/nosotros/superadmin', {
        dataSession,
        dataSistema
      });
    }
    if (token == null || token == undefined) {
      return res.redirect('/');
    }
    let pagina = [];
    pagina = await PaginaService.getTable().where('empresa_id', token).where('identificador', 'nosotros');
    if (Array.isArray(pagina) && pagina.length == 0) {
      await PaginaService.save({ identificador: 'nosotros', empresa_id: token });
      pagina = await PaginaService.getTable().where('empresa_id', token).where('identificador', 'nosotros');
    }

    let formulario_contactos = await FormularioContactoService.getbyCompany(token);

    return res.render('modulo-tv/modulo-paginas/paginas', {
      dataSession,
      dataSistema,
      pagina: pagina[0],
      empresa_id: token,
      formulario_contactos
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/nosotros/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, async (req, res) => {
    try {

      const { dataSession, dataSistema } = await getAllDataSession(req);
      const empresa_id = req.params.id;
      let pagina = [];

      pagina = await PaginaService.getTable().where('empresa_id', empresa_id).where('identificador', 'nosotros');

      if (Array.isArray(pagina) && pagina.length == 0) {
        await PaginaService.save({ identificador: 'nosotros', empresa_id });
        pagina = await PaginaService.getTable().where('empresa_id', empresa_id).where('identificador', 'nosotros');
      }

      let formulario_contactos = await FormularioContactoService.getbyCompany(empresa_id);

      return res.render('modulo-tv/modulo-paginas/paginas', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id,
        formulario_contactos
      });

    } catch (error) {
      return catchError(res, error);
    }
  });

router.get('/politica', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-paginas/politica/superadmin', {
        dataSession,
        dataSistema
      });
    }

    if (token == null || token == undefined) {
      return res.redirect('/');
    }

    let pagina = [];
    pagina = await PaginaService.getTable().where('empresa_id', token).where('identificador', 'politica');
    if (Array.isArray(pagina) && pagina.length == 0) {
      await PaginaService.save({ identificador: 'politica', empresa_id: token });
      pagina = await PaginaService.getTable().where('empresa_id', token).where('identificador', 'politica');
    }

    let formulario_contactos = await FormularioContactoService.getbyCompany(token);


    return res.render('modulo-tv/modulo-paginas/paginas', {
      dataSession,
      dataSistema,
      pagina: pagina[0],
      empresa_id: token,
      formulario_contactos
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/politica/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, async (req, res) => {
    try {

      const { dataSession, dataSistema } = await getAllDataSession(req);
      const empresa_id = req.params.id;
      let pagina = [];

      pagina = await PaginaService.getTable().where('empresa_id', empresa_id).where('identificador', 'politica');
      if (Array.isArray(pagina) && pagina.length == 0) {
        await PaginaService.save({ identificador: 'politica', empresa_id });
        pagina = await PaginaService.getTable().where('empresa_id', empresa_id).where('identificador', 'politica');
      }

      let formulario_contactos = await FormularioContactoService.getbyCompany(empresa_id);

      return res.render('modulo-tv/modulo-paginas/paginas', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id,
        formulario_contactos
      });

    } catch (error) {
      return catchError(res, error);
    }
  });

router.get('/cookie', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-paginas/cookie/superadmin', {
        dataSession,
        dataSistema
      });
    }

    if (token == null || token == undefined) {
      return res.redirect('/');
    }

    let pagina = [];
    pagina = await PaginaService.getTable().where('empresa_id', token).where('identificador', 'cookie');
    if (Array.isArray(pagina) && pagina.length == 0) {
      await PaginaService.save({ identificador: 'cookie', empresa_id: token });
      pagina = await PaginaService.getTable().where('empresa_id', token).where('identificador', 'cookie');
    }

    let formulario_contactos = await FormularioContactoService.getbyCompany(token);


    return res.render('modulo-tv/modulo-paginas/paginas', {
      dataSession,
      dataSistema,
      pagina: pagina[0],
      empresa_id: token,
      formulario_contactos
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/cookie/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, async (req, res) => {
    try {

      const { dataSession, dataSistema } = await getAllDataSession(req);
      const empresa_id = req.params.id;
      let pagina = [];

      pagina = await PaginaService.getTable().where('empresa_id', empresa_id).where('identificador', 'cookie');
      if (Array.isArray(pagina) && pagina.length == 0) {
        await PaginaService.save({ identificador: 'cookie', empresa_id });
        pagina = await PaginaService.getTable().where('empresa_id', empresa_id).where('identificador', 'cookie');
      }

      let formulario_contactos = await FormularioContactoService.getbyCompany(empresa_id);

      return res.render('modulo-tv/modulo-paginas/paginas', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id,
        formulario_contactos
      });

    } catch (error) {
      return catchError(res, error);
    }
  });

router.get('/mision', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-paginas/mision/superadmin', {
        dataSession,
        dataSistema
      });
    }

    if (token == null || token == undefined) {
      return res.redirect('/');
    }

    let pagina = [];
    pagina = await PaginaService.getTable().where('empresa_id', token).where('identificador', 'mision');
    if (Array.isArray(pagina) && pagina.length == 0) {
      await PaginaService.save({ identificador: 'mision', empresa_id: token });
      pagina = await PaginaService.getTable().where('empresa_id', token).where('identificador', 'mision');
    }

    let formulario_contactos = await FormularioContactoService.getbyCompany(token);


    return res.render('modulo-tv/modulo-paginas/paginas', {
      dataSession,
      dataSistema,
      pagina: pagina[0],
      empresa_id: token,
      formulario_contactos
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/mision/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, async (req, res) => {
    try {

      const { dataSession, dataSistema } = await getAllDataSession(req);
      const empresa_id = req.params.id;
      let pagina = [];

      pagina = await PaginaService.getTable().where('empresa_id', empresa_id).where('identificador', 'mision');
      if (Array.isArray(pagina) && pagina.length == 0) {
        await PaginaService.save({ identificador: 'mision', empresa_id });
        pagina = await PaginaService.getTable().where('empresa_id', empresa_id).where('identificador', 'mision');
      }

      let formulario_contactos = await FormularioContactoService.getbyCompany(empresa_id);
      console.log(pagina);
      return res.render('modulo-tv/modulo-paginas/paginas', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id,
        formulario_contactos
      });

    } catch (error) {
      return catchError(res, error);
    }
  });


module.exports = router
