const { Router } = require("express"), router = Router();


const { body,param, check, query} = require('express-validator');
const { EVResult, EVResultView } = require('../../middlewares/EVResult.middleware');

const { SedeController } = require("../../controllers/modulo-clinica/sedes.controller");

const Sede = new SedeController();

router.get('/datatable/:id', 
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, Sede.datatable);

router.get("/select2/:id?", Sede.select2);

router.get('/items', Sede.index);

router.post('/items', 
body('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
body('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
body('googlemap').optional().isString().withMessage('El campo googlemap debe ser un string'),
body('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
body('link').optional().isString().withMessage('El campo link debe ser un string'),
body('telefono').optional().isString().withMessage('El campo telefono debe ser un string'),
body('atencion').optional().isString().withMessage('El campo atencion debe ser un string'),
body('horario_atencion').optional().isJSON().withMessage('El campo horario_atencion debe ser un JSON'),
body('Categoria').optional().isString().withMessage('El campo Categoria debe ser un string'),
body('estado').optional().isNumeric().withMessage('El campo estado debe ser un numero'),
body('activado').optional().isNumeric().withMessage('El campo activado debe ser un numero'),
body('empresa_id').optional().isString().withMessage('El campo empresa_id debe ser un string'),
EVResult, Sede.save);

router.get('/items/:id', 
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
Sede.show);

router.put('/items/:id',
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
body('nombre').optional().isString().withMessage('El campo nombre debe ser un string'),
body('direccion').optional().isString().withMessage('El campo direccion debe ser un string'),
body('googlemap').optional().isString().withMessage('El campo googlemap debe ser un string'),
body('imagen').optional().isString().withMessage('El campo imagen debe ser un string'),
body('link').optional().isString().withMessage('El campo link debe ser un string'),
body('telefono').optional().isString().withMessage('El campo telefono debe ser un string'),
body('atencion').optional().isString().withMessage('El campo atencion debe ser un string'),
body('horario_atencion').optional().isJSON().withMessage('El campo horario_atencion debe ser un JSON'),
body('Categoria').optional().isString().withMessage('El campo Categoria debe ser un string'),
body('estado').optional().isNumeric().withMessage('El campo estado debe ser un numero'),
body('activado').optional().isNumeric().withMessage('El campo activado debe ser un numero'),
body('empresa_id').optional().isString().withMessage('El campo empresa_id debe ser un string'),
EVResult, Sede.update);

router.delete('/items/:id', 
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
EVResult,
Sede.delete);

router.get('/', EVResultView, Sede.renderHomeView);

router.get('/empresa/:id', 
check('id').optional().isNumeric().withMessage('El campo id debe ser un número'),
EVResultView, Sede.renderSuperadminHomeView);

module.exports = router