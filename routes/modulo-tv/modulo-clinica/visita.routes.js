const { Router } = require("express"), router = Router();
const ServiceSQL = require('../../../services/services')

const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');

const { VisitaController } = require('../../../controllers/modulo-tv/modulo-clinica/clinica.controller');
const { service: VisitaService } = VisitaController;

const { body, validationResult, oneOf, check, buildCheckFunction } = require('express-validator');
const checkBodyAndQuery = buildCheckFunction(['body', 'query']);
const { EVResult } = require('../../../middlewares/EVResult.middleware');

const PacienteService = new ServiceSQL('ce_pacientes');

router.get('/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, VisitaController.datatable);


router.get('/items', VisitaController.index);

router.post('/items',
  check('paciente_id').optional().isNumeric().withMessage('El campo paciente_id debe ser un número'),
  check('medico_id').optional().isNumeric().withMessage('El campo medico_id debe ser un número'),
  check('fecha').optional(),
  check('hora').optional(),
  check('motivo').optional().isString().withMessage('El campo motivo debe ser un texto'),
  check('anotaciones').optional().isString().withMessage('El campo anotaciones debe ser un texto'),
  check('resultado').optional().isString().withMessage('El campo resultado debe ser un texto'),
  check('diagnostico').optional().isString().withMessage('El campo diagnostico debe ser un texto'),
  check('recetas').optional().isString().withMessage('El campo recetas debe ser un texto'),
  check('estado').optional().isNumeric().withMessage('El campo estado debe ser un número'),
  check('costo').optional().isNumeric().withMessage('El campo costo debe ser un número'),
  check('clinica_id').optional().isNumeric().withMessage('El campo clinica_id debe ser un número'),
  check('referencias').optional().isString().withMessage('El campo referencias debe ser un texto'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, VisitaController.save);

router.get('/items/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResult, VisitaController.show);

router.put('/items/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  check('paciente_id').optional().isNumeric().withMessage('El campo paciente_id debe ser un número'),
  check('medico_id').optional().isNumeric().withMessage('El campo medico_id debe ser un número'),
  check('fecha').optional(),
  check('hora').optional(),
  check('motivo').optional().isString().withMessage('El campo motivo debe ser un texto'),
  check('anotaciones').optional().isString().withMessage('El campo anotaciones debe ser un texto'),
  check('resultado').optional().isString().withMessage('El campo resultado debe ser un texto'),
  check('diagnostico').optional().isString().withMessage('El campo diagnostico debe ser un texto'),
  check('recetas').optional().isString().withMessage('El campo recetas debe ser un texto'),
  check('estado').optional().isNumeric().withMessage('El campo estado debe ser un número'),
  check('costo').optional().isNumeric().withMessage('El campo costo debe ser un número'),
  check('clinica_id').optional().isNumeric().withMessage('El campo clinica_id debe ser un número'),
  check('referencias').optional().isString().withMessage('El campo referencias debe ser un texto'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, VisitaController.update);

router.delete('/items/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResult, VisitaController.delete);


router.get('/', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role === 1) {
      return res.render('modulo-tv/modulo-clinica/visita/superadmin', {
        dataSession,
        dataSistema
      });
    }

    let data = []
    data = await VisitaService.getbyCompany(token);
    return res.render('modulo-tv/modulo-clinica/visita', {
      dataSession,
      dataSistema,
      empresa_id: token,
      data
    })

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResult, async (req, res) => {
    try {
      const id = req.params.id;

      if (typeof parseInt(id) !== 'number') return notAuthorize(res);

      const { dataSession, dataSistema } = await getAllDataSession(req);

      let datos = []
      datos = await PacienteService.getbyCompany(id);

      return res.render('modulo-tv/modulo-clinica/visita/empresa', {
        dataSession,
        dataSistema,
        empresa_id: id,
        data: datos
      });
    } catch (error) {
      return catchError(res, error);
    }
  });

router.get('/empresa/:id/paciente/:paciente_id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  check('paciente_id').isNumeric().withMessage('El campo paciente_id debe ser un número'),
  EVResult, async (req, res) => {
    try {
      const empresa_id = req.params.id;
      const paciente_id = req.params.paciente_id;

      if (typeof parseInt(empresa_id) !== 'number' || typeof parseInt(paciente_id) !== 'number') return notAuthorize(res);

      const { dataSession, dataSistema } = await getAllDataSession(req);

      let datos = []

      datos = await VisitaService.getTable().where('paciente_id', paciente_id).andWhere('empresa_id', empresa_id).orderBy('id', 'desc');
      console.log(datos);
      return res.render('modulo-tv/modulo-clinica/visita/paciente', {
        dataSession,
        dataSistema,
        empresa_id,
        paciente_id,
        data: datos
      });
    } catch (error) {
      return catchError(res, error);
    }
  });

module.exports = router