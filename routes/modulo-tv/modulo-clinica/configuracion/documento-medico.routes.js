const { Router } = require("express"), router = Router();
const { catchError, getAllDataSession, notAuthorize } = require('../../../../helpers/modulo-tv/basicrequest.helpers');
const ServiceSQL = require('../../../../services/services')
const { body, validationResult, oneOf, check } = require('express-validator');
const { EVResult } = require('../../../../middlewares/EVResult.middleware');
const {  isAdminSuperAdminMiddleware } = require('../../../../middlewares/modulo-tv/isAdmin')
const { DocumentoController } = require('../../../../controllers/modulo-tv/modulo-clinica/clinica.controller');


router.get('/items',
   DocumentoController.index);
  
  
// nombre_documento	
// empresa_id
router.post('/items',
  check('nombre_documento').optional().isString().withMessage('El campo nombre_documento debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, DocumentoController.save);
  
router.get('/items/:id',
  
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, DocumentoController.show);

router.put('/items/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('nombre_documento').optional().isString().withMessage('El campo nombre_documento debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, DocumentoController.update);

router.delete('/items/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, DocumentoController.delete)

// id	nombre	apellido_paterno	apellido_materno	identificador	dni	numero_documento	tipo_documento	celular	correo	clave	Tag_VieneDeApp	token	status	empresa_id
router.get('/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, DocumentoController.datatable);

router.get('/',  async (req, res) => {
  try {

    const { role, token, dataSistema, dataSession } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-clinica/configuracion/documento-medico/superadmin', {
        dataSession,
        dataSistema
      });
    }

    return res.render('modulo-tv/modulo-clinica/configuracion/documento-medico', {
      dataSession,
      dataSistema
    });

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id',
  isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult,
  async (req, res) => {
    try {

      const { role, token, dataSistema, dataSession } = await getAllDataSession(req);
      const id = req.params.id;

      return res.render('modulo-tv/modulo-clinica/configuracion/documento-medico', {
        dataSession,
        dataSistema,
        empresa_id: id
      })

    } catch (error) {
      return catchError(res, error);
    }
  });

module.exports = router