const { Router } = require("express"), router = Router();
const ServiceSQL = require('../../../services/services')

const { body, validationResult, oneOf, check, buildCheckFunction } = require('express-validator');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');

const { FormularioContactoController } = require('../../../controllers/modulo-tv/modulo-formulario-contacto/formulario-contacto.controller');
const { isAdminSuperAdminMiddleware } = require("../../../middlewares/modulo-tv/isAdmin");
const { service: FormularioContactoService } = FormularioContactoController;


// Formulario contactos

router.get('/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, FormularioContactoController.datatable);

// nombre	
// descripcion	
// campos	
// estado	
// empresa_id

router.get('/forms', FormularioContactoController.index);

router.post('/forms',
  check('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
  check('descripcion').optional().isString().withMessage('La descripción debe ser un texto'),
  check('campos').optional().isJSON().withMessage('Los campos deben ser un texto'),
  check('estado').optional(),
  check('empresa_id').optional().isNumeric().withMessage('El id de la empresa debe ser un número'),
  EVResult, FormularioContactoController.save);

router.get('/forms/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, FormularioContactoController.show);

router.put('/forms/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
  check('descripcion').optional().isString().withMessage('La descripción debe ser un texto'),
  check('campos').optional().isJSON().withMessage('Los campos deben ser un texto'),
  check('estado').optional(),
  check('empresa_id').optional().isNumeric().withMessage('El id de la empresa debe ser un número'),
  EVResult, FormularioContactoController.update);

router.delete('/forms/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, FormularioContactoController.delete);


router.get('/', async (req, res) => {
  try {

    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role === 1 || role === 2) {
      return res.render('modulo-tv/modulo-formulario-contacto/formulario/superadmin', {
        dataSession,
        dataSistema
      });
    }

    let data = []
    data = await FormularioContactoService.getbyCompany(token);

    if (Array.isArray(data) && data.length === 0) {
      await FormularioContactoService.save({ empresa_id: token });
      data = await FormularioContactoService.getbyCompany(token);
    }


    res.render('modulo-tv/modulo-formulario-contacto/formulario', {
      dataSession,
      dataSistema,
      data
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, async (req, res) => {
    try {
      const id = req.params.id;

      if (typeof parseInt(id) !== 'number') return notAuthorize(res);

      const { dataSession, dataSistema } = await getAllDataSession(req);

      let data = [];
      data = await FormularioContactoService.getbyCompany(id);
      if (Array.isArray(data) && data.length === 0) {
        await FormularioContactoService.save({ empresa_id: id });
        data = await FormularioContactoService.getbyCompany(id);
      }
      // const datos = await InfoContactoService.getbyCompany(id);

      return res.render('modulo-tv/modulo-formulario-contacto/formulario', {
        dataSession,
        dataSistema,
        // empresa_id: id,
        data
      });
    } catch (error) {
      return catchError(res, error);
    }
  });

module.exports = router