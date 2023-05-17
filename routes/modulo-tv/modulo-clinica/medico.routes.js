const { Router } = require("express"), router = Router();
const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers');
const ServiceSQL = require('../../../services/services')
const { body, validationResult, oneOf, check } = require('express-validator');
const {MedicoController} = require('../../../controllers/modulo-tv/modulo-clinica/medicos/medico.controller');
const {EspecialidadController} = require('../../../controllers/modulo-tv/modulo-clinica/clinica.controller');
const ConfiguracionClinica = new ServiceSQL('configuracion_clinica');
const {storageFiles} = require('../../../helpers/modulo-tv/multer');
const multer = require('multer');
const upload = multer({storage: storageFiles});
const UploadService = new ServiceSQL('uploads');

const {EVResult} = require('../../../middlewares/EVResult.middleware');

const { service: medicoService } = MedicoController;
const { service: EspecialidadService } = EspecialidadController;


router.get('/datatable/:id', 
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, MedicoController.datatable);

router.get('/medicos', MedicoController.index);

router.post('/medicos', 
check('primer_nombre').optional().isString().withMessage('El campo primer_nombre debe ser un string'),
check('segundo_nombre').optional().isString().withMessage('El campo segundo_nombre debe ser un string'),
check('apellidos').optional().isString().withMessage('El campo apellidos debe ser un string'),
check('cv_path').optional().isString().withMessage('El campo cv_path debe ser un string'),
check('especialidad').optional().isString().withMessage('El campo especialidad debe ser un string'),
check('dni').optional().isString().withMessage('El campo dni debe ser un string'),
check('numero_documento').optional().isString().withMessage('El campo numero_documento debe ser un string'),
check('tipo_documento').optional().isString().withMessage('El campo tipo_documento debe ser un string'),
check('celular').optional().isString().withMessage('El campo celular debe ser un string'),
check('correo').optional().isString().withMessage('El campo correo debe ser un string'),
check('clave').optional().isString().withMessage('El campo clave debe ser un string'),
check('tiempo_consulta').optional().isNumeric().withMessage('El campo tiempo_consulta debe ser un string'),
check('horarios_atencion').optional().isString().withMessage('El campo horarios_atencion debe ser un string'),
check('token').optional().isString().withMessage('El campo token debe ser un string'),
check('status').optional().isString().withMessage('El campo status debe ser un string'),
check('empresa_id').optional().isString().withMessage('El campo empresa_id debe ser un string'),
check('experiencia').optional().isString().withMessage('El campo experiencia debe ser un string'),
check('educacion').optional().isString().withMessage('El campo educacion debe ser un string'),
check('dias_atencion').optional().isString().withMessage('El campo dias_atencion debe ser un string'),
EVResult,
MedicoController.save);

router.get('/medicos/:id', 
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
MedicoController.show);

router.put('/medicos/:id', 
check('primer_nombre').optional().isString().withMessage('El campo primer_nombre debe ser un string'),
check('segundo_nombre').optional().isString().withMessage('El campo segundo_nombre debe ser un string'),
check('apellidos').optional().isString().withMessage('El campo apellidos debe ser un string'),
check('cv_path').optional().isString().withMessage('El campo cv_path debe ser un string'),
check('especialidad').optional().isString().withMessage('El campo especialidad debe ser un string'),
check('dni').optional().isString().withMessage('El campo dni debe ser un string'),
check('numero_documento').optional().isString().withMessage('El campo numero_documento debe ser un string'),
check('tipo_documento').optional().isString().withMessage('El campo tipo_documento debe ser un string'),
check('celular').optional().isString().withMessage('El campo celular debe ser un string'),
check('correo').optional().isString().withMessage('El campo correo debe ser un string'),
check('clave').optional().isString().withMessage('El campo clave debe ser un string'),
check('tiempo_consulta').optional().isNumeric().withMessage('El campo tiempo_consulta debe ser un string'),
check('horarios_atencion').optional().isString().withMessage('El campo horarios_atencion debe ser un string'),
check('token').optional().isString().withMessage('El campo token debe ser un string'),
check('status').optional().isString().withMessage('El campo status debe ser un string'),
check('empresa_id').optional().isString().withMessage('El campo empresa_id debe ser un string'),
check('experiencia').optional().isString().withMessage('El campo experiencia debe ser un string'),
check('educacion').optional().isString().withMessage('El campo educacion debe ser un string'),
check('dias_atencion').optional().isString().withMessage('El campo dias_atencion debe ser un string'),
EVResult,MedicoController.update);

router.delete('/medicos/:id', 
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
MedicoController.delete);

router.get('/', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    let medicos = []

    if (role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-clinica/medico/superadmin', {
        dataSession,
        dataSistema,
      });
    }

    if (role == 3) {
      medicos = await medicoService.getbyCompany(token);
    }

    const tipo_documento = await ConfiguracionClinica.getByColumn({column: 'propiedad', value: 'tipo_documento'});

    if (Array.isArray(tipo_documento)) {
      for (let i = 0; i < tipo_documento.length; i++) {
        tipo_documento[i].valor = JSON.parse(tipo_documento[i].valor);
      }
    }

    const especialidades = await EspecialidadService.getTable().select(['id', 'nombre']).where('empresa_id',token).orderBy('nombre', 'asc');

    res.render('modulo-tv/modulo-clinica/medico', {
      dataSession,
      dataSistema,
      medicos,
      tipo_documento,
      empresa_id: token,
      especialidades
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', 
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);

    const id = req.params.id;
    let medicos = [];
    
    medicos = await medicoService.getbyCompany(id);

    const tipo_documento = await ConfiguracionClinica.getByColumn({column: 'propiedad', value: 'tipo_documento'});

    if (Array.isArray(tipo_documento)) {
      for (let i = 0; i < tipo_documento.length; i++) {
        tipo_documento[i].valor = JSON.parse(tipo_documento[i].valor);
      }
    }

    const especialidades =  await EspecialidadService.getTable().select(['id', 'nombre']).where('empresa_id', id);

    res.render('modulo-tv/modulo-clinica/medico/index', {
      dataSession,
      dataSistema,
      medicos,
      tipo_documento,
      empresa_id: id,
      especialidades
    })
  } catch (error) {
    return catchError(res, error);
  }
});

router.post('/upload', upload.single('cv'), async (req, res) => {
  let file = null;
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);

    file = req.file;
    const empresa_id = req.query.empresa_id;
    let auxData = {
      nombre: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    }
    if (empresa_id) {
      auxData.empresa_id = empresa_id;
    }
    const cv = await UploadService.save(auxData);

    res.json({
      ok: true,
      msg: 'Archivo subido con éxito',
      data: {
        file: file.path
      }
    })
  } catch (error) {
    console.log(error);
    if (file) {
      await UploadService.deleteBy().where('nombre', file.filename);
    }

    return catchError(res, error);
  }
});

module.exports = router