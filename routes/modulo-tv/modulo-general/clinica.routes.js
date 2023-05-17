const { Router } = require("express"), router = Router();
const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers');
// const ServiceSQL = require('../../services/services')
const { body, validationResult, oneOf, check } = require('express-validator');
const {ClinicaController} = require('../../../controllers/modulo-tv/modulo-general/clinica.controller');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { service: ClinicaService } = ClinicaController

router.get('/configuracion', ClinicaController.index);

router.post('/configuracion',
check('propiedad').optional().isString().withMessage('El campo propiedad debe ser un string'),
check('valor').optional().isJSON().withMessage('El campo valor debe ser un JSON'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult,  ClinicaController.save);

router.get('/configuracion/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult,  ClinicaController.show);

router.put('/configuracion/:id', 
check('id').isNumeric().withMessage('El campo id debe ser un número'),
check('propiedad').optional().isString().withMessage('El campo propiedad debe ser un string'),
check('valor').optional().isJSON().withMessage('El campo valor debe ser un JSON'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult,  ClinicaController.update);

router.delete('/configuracionuracion/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult,  ClinicaController.delete)

router.get('/', async (req, res) => {
  try {
    const {role, token, dataSession, dataSistema} = await getAllDataSession(req);

    let dataClinica = [];
    if(role === 2 && role === 1) {
      dataClinica = await ClinicaService.getAll();
    } else if(role === 3) {
      dataClinica = await ClinicaService.getbyCompany(token);
    } 

    dataClinica = dataClinica.map(item => ({
      ...item,
      valor: JSON.parse(item.valor)
    }));

    res.render('modulo-tv/modulo-generales/clinica/index', {
      dataSession, 
      dataSistema,
      data: dataClinica
    });
  } catch (error) {
    return catchError(res, error);
  }
});

// Ruta para actualizar la configuracion de la clinica
router.put('/',oneOf([[
  check('tipo_documento').isArray().withMessage('Debe ser un array'),
  check('tipo_cita').isArray().withMessage('Debe ser un array'),
  check('sexo').isArray().withMessage('Debe ser un array'),
  check('estado_civil').isArray().withMessage('Debe ser un array'),
  check('estado_cita').isArray().withMessage('Debe ser un array')
]]), async(req, res) => {
  try {
    const { tipo_documento, tipo_cita, sexo, estado_civil, estado_cita } = req.body

    const tipo_documento_result = await ClinicaService.saveBy().update({
      valor: JSON.stringify(tipo_documento)
    }).where('propiedad', 'tipo_documento');

    const tipo_cita_result = await ClinicaService.saveBy().update({
      valor: JSON.stringify(tipo_cita)
    }).where('propiedad', 'tipo_cita');

    const sexo_result = await ClinicaService.saveBy().update({
      valor: JSON.stringify(sexo)
    }).where('propiedad', 'sexo');

    const estado_civil_result = await ClinicaService.saveBy().update({
      valor: JSON.stringify(estado_civil)
    }).where('propiedad', 'estado_civil');

    const estado_cita_result = await ClinicaService.saveBy().update({
      valor: JSON.stringify(estado_cita)
    }).where('propiedad', 'estado_cita');

    
    res.json({
      ok: true,
      msg: 'Se ha actualizado correctamente',
      data: [
        { result: tipo_documento_result, campo: 'Tipo Documento' },
        { result: tipo_cita_result, campo: 'Tipo Cita' },
        { result: sexo_result, campo: 'Sexo' },
        { result: estado_civil_result, campo: 'Estado Civil'},
        { result: estado_cita_result, campo: 'Estado Cita'}
      ]
    })
  } catch (error) {
    return catchError(res, error);
  }
});

module.exports = router