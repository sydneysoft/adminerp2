const { Router } = require("express"), router = Router();

const {VisitaMedicaController} = require("../../controllers/modulo-clinica/visitas-medicas.controller");

const { body, check, param, query } = require('express-validator');
const { EVResult, EVResultView } = require('../../middlewares/EVResult.middleware');


const VisitaMedica = new VisitaMedicaController();

router.get('/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, VisitaMedica.datatable);


router.get('/items', VisitaMedica.index);

router.post('/items',
  body('paciente_id').optional().isNumeric().withMessage('El campo paciente_id debe ser un número'),
  body('medico_id').optional().isNumeric().withMessage('El campo medico_id debe ser un número'),
  body('fecha').optional(),
  body('hora').optional(),
  body('motivo').optional().isString().withMessage('El campo motivo debe ser un texto'),
  body('anotaciones').optional().isString().withMessage('El campo anotaciones debe ser un texto'),
  body('resultado').optional().isString().withMessage('El campo resultado debe ser un texto'),
  body('diagnostico').optional().isString().withMessage('El campo diagnostico debe ser un texto'),
  body('recetas').optional().isString().withMessage('El campo recetas debe ser un texto'),
  body('estado').optional().isNumeric().withMessage('El campo estado debe ser un número'),
  body('costo').optional().isNumeric().withMessage('El campo costo debe ser un número'),
  body('clinica_id').optional().isNumeric().withMessage('El campo clinica_id debe ser un número'),
  body('referencias').optional().isString().withMessage('El campo referencias debe ser un texto'),
  body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, VisitaMedica.save);

router.get('/items/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResult, VisitaMedica.show);

router.put('/items/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  body('paciente_id').optional().isNumeric().withMessage('El campo paciente_id debe ser un número'),
  body('medico_id').optional().isNumeric().withMessage('El campo medico_id debe ser un número'),
  body('fecha').optional(),
  body('hora').optional(),
  body('motivo').optional().isString().withMessage('El campo motivo debe ser un texto'),
  body('anotaciones').optional().isString().withMessage('El campo anotaciones debe ser un texto'),
  body('resultado').optional().isString().withMessage('El campo resultado debe ser un texto'),
  body('diagnostico').optional().isString().withMessage('El campo diagnostico debe ser un texto'),
  body('recetas').optional().isString().withMessage('El campo recetas debe ser un texto'),
  body('estado').optional().isNumeric().withMessage('El campo estado debe ser un número'),
  body('costo').optional().isNumeric().withMessage('El campo costo debe ser un número'),
  body('clinica_id').optional().isNumeric().withMessage('El campo clinica_id debe ser un número'),
  body('referencias').optional().isString().withMessage('El campo referencias debe ser un texto'),
  body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, VisitaMedica.update);

router.delete('/items/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResult, VisitaMedica.delete);


router.get('/', VisitaMedica.renderHomeView);

router.get('/empresa/:id',
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResultView, VisitaMedica.renderSuperadminHomeView);

// router.get('/empresa/:id/paciente/:paciente_id',
//   check('id').isNumeric().withMessage('El campo id debe ser un número'),
//   check('paciente_id').isNumeric().withMessage('El campo paciente_id debe ser un número'),
//   EVResult, async (req, res) => {
//     try {
//       const empresa_id = req.params.id;
//       const paciente_id = req.params.paciente_id;

//       if (typeof parseInt(empresa_id) !== 'number' || typeof parseInt(paciente_id) !== 'number') return notAuthorize(res);

//       const { dataSession, dataSistema } = await getAllDataSession(req);

//       let datos = []

//       datos = await VisitaService.getTable().where('paciente_id', paciente_id).andWhere('empresa_id', empresa_id).orderBy('id', 'desc');
//       console.log(datos);
//       return res.render('modulo-tv/modulo-clinica/visita/paciente', {
//         dataSession,
//         dataSistema,
//         empresa_id,
//         paciente_id,
//         data: datos
//       });
//     } catch (error) {
//       return catchError(res, error);
//     }
//   });

module.exports = router