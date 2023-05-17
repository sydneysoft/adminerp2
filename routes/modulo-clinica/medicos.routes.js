const { Router } = require("express"), router = Router();
const { body, check, query } = require('express-validator');


const {MedicoController} = require('../../controllers/modulo-clinica/medicos.controller');
const {storageFiles} = require('../../helpers/modulo-tv/multer');
const {EVResult} = require('../../middlewares/EVResult.middleware');


const multer = require('multer');
const upload = multer({storage: storageFiles});


const Medico = new MedicoController();

router.get('/datatable/:id?', 
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, Medico.datatable);

router.get("/select2/:id?", Medico.select2);


router.get('/', Medico.renderHomeView);

router.get('/empresa/:id', 
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
EVResult, Medico.renderSuperadminHomeView);


router.get('/medicos', Medico.index);
router.post('/medicos', 
body('primer_nombre').optional().isString().withMessage('El campo primer_nombre debe ser un string'),
body('segundo_nombre').optional().isString().withMessage('El campo segundo_nombre debe ser un string'),
body('apellidos').optional().isString().withMessage('El campo apellidos debe ser un string'),
body('cv_path').optional().isString().withMessage('El campo cv_path debe ser un string'),
body('especialidad').optional().isString().withMessage('El campo especialidad debe ser un string'),
body('dni').optional().isString().withMessage('El campo dni debe ser un string'),
body('numero_documento').optional().isString().withMessage('El campo numero_documento debe ser un string'),
body('tipo_documento').optional().isString().withMessage('El campo tipo_documento debe ser un string'),
body('celular').optional().isString().withMessage('El campo celular debe ser un string'),
body('correo').optional().isString().withMessage('El campo correo debe ser un string'),
body('clave').optional().isString().withMessage('El campo clave debe ser un string'),
body('tiempo_consulta').optional().isNumeric().withMessage('El campo tiempo_consulta debe ser un string'),
body('horarios_atencion').optional().isString().withMessage('El campo horarios_atencion debe ser un string'),
body('token').optional().isString().withMessage('El campo token debe ser un string'),
body('status').optional().isString().withMessage('El campo status debe ser un string'),
body('empresa_id').optional().isString().withMessage('El campo empresa_id debe ser un string'),
body('experiencia').optional().isString().withMessage('El campo experiencia debe ser un string'),
body('educacion').optional().isString().withMessage('El campo educacion debe ser un string'),
body('dias_atencion').optional().isString().withMessage('El campo dias_atencion debe ser un string'),
body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult,
Medico.save);

router.get('/medicos/:id', 
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
Medico.show);

router.put('/medicos/:id', 
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
body('primer_nombre').optional().isString().withMessage('El campo primer_nombre debe ser un string'),
body('segundo_nombre').optional().isString().withMessage('El campo segundo_nombre debe ser un string'),
body('apellidos').optional().isString().withMessage('El campo apellidos debe ser un string'),
body('cv_path').optional().isString().withMessage('El campo cv_path debe ser un string'),
body('especialidad').optional().isString().withMessage('El campo especialidad debe ser un string'),
body('dni').optional().isString().withMessage('El campo dni debe ser un string'),
body('numero_documento').optional().isString().withMessage('El campo numero_documento debe ser un string'),
body('tipo_documento').optional().isString().withMessage('El campo tipo_documento debe ser un string'),
body('celular').optional().isString().withMessage('El campo celular debe ser un string'),
body('correo').optional().isString().withMessage('El campo correo debe ser un string'),
body('clave').optional().isString().withMessage('El campo clave debe ser un string'),
body('tiempo_consulta').optional().isNumeric().withMessage('El campo tiempo_consulta debe ser un string'),
body('horarios_atencion').optional().isString().withMessage('El campo horarios_atencion debe ser un string'),
body('token').optional().isString().withMessage('El campo token debe ser un string'),
body('status').optional().isString().withMessage('El campo status debe ser un string'),
body('empresa_id').optional().isString().withMessage('El campo empresa_id debe ser un string'),
body('experiencia').optional().isString().withMessage('El campo experiencia debe ser un string'),
body('educacion').optional().isString().withMessage('El campo educacion debe ser un string'),
body('dias_atencion').optional().isString().withMessage('El campo dias_atencion debe ser un string'),
body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult,Medico.update);

router.delete('/medicos/:id', 
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
Medico.delete);

router.post('/upload', upload.single('cv'), Medico.apiUploadFile);

module.exports = router