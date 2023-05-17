const { Router } = require("express"), router = Router();
const { body, check, query, param} = require('express-validator');

const { EVResult, EVResultView } = require('../../middlewares/EVResult.middleware');
const { isAdminSuperAdminMiddleware } = require('../../middlewares/modulo-tv/isAdmin')

const { EspecialidadController } = require("../../controllers/modulo-clinica/especialidad.controller");

const Especialidad = new EspecialidadController();

router.get('/datatable/:id?',
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, Especialidad.datatable);

router.get("/select2/:id?", Especialidad.select2);


router.get('/', Especialidad.renderHomeView);

router.get('/empresa/:id',
isAdminSuperAdminMiddleware,
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResultView, Especialidad.renderSuperadminHomeView);

router.get('/items', Especialidad.index);
router.post('/items', 
body('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
body('codigoexterno').optional().isString().withMessage('El campo codigoexterno debe ser un string'),
body('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
body('activado').optional().isNumeric().withMessage('El campo activado debe ser un número'),
body('estado').optional().isNumeric().withMessage('El campo estado debe ser un número'),
body('sede').optional().isNumeric().withMessage('El campo sede debe ser un número'),
body('categoria').optional().isNumeric().withMessage('El campo categoria debe ser un número'),
body('descripcioncorta').optional().isString().withMessage('El campo descripcioncorta debe ser un string'),
body('descriptionlarga').optional().isString().withMessage('El campo descriptionlarga debe ser un string'),
body('icono').optional().isString().withMessage('El campo icono debe ser un string'),
body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult,
Especialidad.save);

router.get('/items/:id', 
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
Especialidad.show);

router.put('/items/:id', 
check('id').isNumeric().withMessage('El campo id debe ser un número'),
body('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
body('codigoexterno').optional().isString().withMessage('El campo codigoexterno debe ser un string'),
body('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
body('activado').optional().isNumeric().withMessage('El campo activado debe ser un número'),
body('estado').optional().isNumeric().withMessage('El campo estado debe ser un número'),
body('sede').optional().isNumeric().withMessage('El campo sede debe ser un número'),
body('categoria').optional().isNumeric().withMessage('El campo categoria debe ser un número'),
body('descripcioncorta').optional().isString().withMessage('El campo descripcioncorta debe ser un string'),
body('descriptionlarga').optional().isString().withMessage('El campo descriptionlarga debe ser un string'),
body('icono').optional().isString().withMessage('El campo icono debe ser un string'),
body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult,
Especialidad.update);


router.delete('/items/:id', 
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
Especialidad.delete);


module.exports = router