const { Router } = require("express"), router = Router();
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const ServiceSQL = require('../../../services/services')
const { body, validationResult, oneOf, check } = require('express-validator');
const { TratamientoController } = require('../../../controllers/modulo-tv/modulo-clinica/tratamiento.controller');
const ConfiguracionClinica = new ServiceSQL('configuracion_clinica');
const PacienteService = new ServiceSQL('ce_pacientes');
const SedeService = new ServiceSQL('sedes');
const { service: TratamientoService } = TratamientoController;

const { EVResult } = require('../../../middlewares/EVResult.middleware');

router.get('/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, TratamientoController.datatable);

router.get('/items', TratamientoController.index);

router.post('/items',
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
  check('costo').optional().isNumeric().withMessage('El campo costo debe ser un número'),
  check('duracion').optional().isNumeric().withMessage('El campo duracion debe ser un número'),
  check('frecuencia').optional().isNumeric().withMessage('El campo frecuencia debe ser un número'),
  check('modo_aplicacion').optional().isString().withMessage('El campo modo_aplicacion debe ser un string'),
  check('dosificacion').optional().isNumeric().withMessage('El campo dosificacion debe ser un string'),
  check('precauciones').optional().isString().withMessage('El campo precauciones debe ser un string'),
  check('efectos_secundarios').optional().isString().withMessage('El campo efectos_secundarios debe ser un string'),
  check('recomendaciones').optional().isString().withMessage('El campo recomendaciones debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, TratamientoController.save);

router.get('/items/:id', 
check('id').isNumeric().withMessage('El id debe ser un número'),
EVResult, TratamientoController.show);

router.put('/items/:id',
  check('id').isNumeric().withMessage('El id debe ser un número'),
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
  check('descripcion').optional().isString().withMessage('El campo descripcion debe ser un string'),
  check('costo').optional().isNumeric().withMessage('El campo costo debe ser un número'),
  check('duracion').optional().isNumeric().withMessage('El campo duracion debe ser un número'),
  check('frecuencia').optional().isNumeric().withMessage('El campo frecuencia debe ser un número'),
  check('modo_aplicacion').optional().isString().withMessage('El campo modo_aplicacion debe ser un string'),
  check('dosificacion').optional().isNumeric().withMessage('El campo dosificacion debe ser un string'),
  check('precauciones').optional().isString().withMessage('El campo precauciones debe ser un string'),
  check('efectos_secundarios').optional().isString().withMessage('El campo efectos_secundarios debe ser un string'),
  check('recomendaciones').optional().isString().withMessage('El campo recomendaciones debe ser un string'),
  check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
  EVResult, TratamientoController.update);

router.delete('/items/:id', 
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, TratamientoController.delete)

router.get('/datatable', async (req, res) => {
  try {
    let datos = [];
    let pacientes = [];
    let sedes = [];
    datos = await TratamientoService.getAll();

    if (Array.isArray(datos) && datos.length > 0) {
      datos.forEach(tratamiento => {
        if (tratamiento.paciente_id) {
          pacientes.push(tratamiento.paciente_id);
        }
        if (tratamiento.sede_id) {
          sedes.push(tratamiento.sede_id);
        }
      });
    }

    pacientes = pacientes.filter((item, index) => pacientes.indexOf(item) === index);
    sedes = sedes.filter((item, index) => sedes.indexOf(item) === index);

    pacientes = await PacienteService.getTable().select('id', 'nombre').whereIn('id', pacientes);
    sedes = await SedeService.getTable().select('id', 'nombre', 'direccion').whereIn('id', sedes);

    if (Array.isArray(datos) && datos.length > 0) {
      for (let i = 0; i < datos.length; i++) {
        if (datos[i].paciente_id) {
          const paciente = pacientes.find(paciente => paciente.id === datos[i].paciente_id);
          datos[i].paciente = paciente;
        }
        if (datos[i].sede_id) {
          const sede = sedes.find(sede => sede.id === datos[i].sede_id);
          datos[i].sede = sede;
        }

        if (!datos[i].sede) {
          datos[i].sede = {
            id: '0',
            nombre: 'No asignado',
            direccion: 'No asignado'
          }
        }
        if (!datos[i].paciente) {
          datos[i].paciente = {
            id: '0',
            nombre: 'No asignado'
          }
        }
      }
    }
    res.json({
      ok: true,
      data: datos
    })
  } catch (error) {
    return catchError(res, error);
  }
});


router.get('/', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    let pacientes = [];
    let sedes = [];
    let estado_tratamiento = [];
    pacientes = await PacienteService.getAll();

    estado_tratamiento = await ConfiguracionClinica.getTable().where('propiedad', 'estado_tratamiento');

    if (Array.isArray(estado_tratamiento) && estado_tratamiento.length > 0) {
      estado_tratamiento = estado_tratamiento.map(estado => ({
        ...estado,
        valor: JSON.parse(estado.valor)
      }));
    }

    console.log(estado_tratamiento)
    res.render('modulo-tv/modulo-clinica/tratamiento/index', {
      dataSession,
      dataSistema,
      pacientes,
      sedes,
      estado_tratamiento
    })
  } catch (error) {
    return catchError(res, error);
  }
});

module.exports = router