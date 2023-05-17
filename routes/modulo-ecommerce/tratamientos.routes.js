const { Router } = require("express");
const router = Router()

const { TratamientoController } = require('../../controllers/modulo-ecommerce/tratamientos.controller');
const { service: TratamientoService } = TratamientoController;

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

router.get('/datatable/:id?',
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, TratamientoController.datatable);
router.get('/select2/:id?', TratamientoController.select2);

router.get("/", async (req, res) => {
    try {
        let { role, dataSession, dataSistema } = await getAllDataSession(req);

        if (role == 1 || role == 2) {
            return res.render("modulo-ecommerce/tratamientos/superadmin", {
                dataSession,
                dataSistema
            });
        }
        return res.render("modulo-ecommerce/tratamientos/index", {
            dataSession,
            dataSistema
        })
    } catch (error) {
        return catchError(req, res);
    }
});

router.get("/empresa/:id", async (req, res) => {
    try {
        let { dataSession, dataSistema } = await getAllDataSession(req);
        return res.render("modulo-ecommerce/tratamientos/index", {
            dataSession,
            dataSistema,
            empresa_id: req.params.id
        })
    } catch (error) {
        return catchError(res, error);
    }
});

router.get('/:id',
    check('id').isNumeric().withMessage('El campo id debe ser un número'),
    EVResult, TratamientoController.show);

router.post('/',
    check('paciente_id').optional().isNumeric().withMessage('El campo paciente_id debe ser un número'),
    check('nombre').optional().isString().withMessage('El campo nombre debe ser un texto'),
    check('sintomas').optional().isString().withMessage('El campo sintomas debe ser un texto'),
    check('nombre_tratamiento').optional().isString().withMessage('El campo nombre_tratamiento debe ser un texto'),
    check('inicio_tratamiento').optional(),
    check('fin_tratamiento').optional(),
    check('costo_tratamiento').optional().isNumeric().withMessage('El campo costo_tratamiento debe ser un número'),
    check('dosis').optional().isString().withMessage('El campo dosis debe ser un texto'),
    check('duracion').optional().isString().withMessage('El campo duracion debe ser un texto'),
    check('resultado').optional().isString().withMessage('El campo resultado debe ser un texto'),
    check('codigo_externo').optional().isString().withMessage('El campo codigo_externo debe ser un texto'),
    check('imagen').optional().isString().withMessage('El campo imagen debe ser un texto'),
    check('activado').optional().isNumeric().withMessage('El campo activado debe ser un número'),
    check('estado').optional(),
    check('especialidad_fechareg').optional(),
    check('descripcion_corta').optional().isString().withMessage('El campo descripcion_corta debe ser un texto'),
    check('descripcion_larga').optional().isString().withMessage('El campo descripcion_larga debe ser un texto'),
    check('icono').optional().isString().withMessage('El campo icono debe ser un texto'),
    check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
    check('sede_id').optional().isNumeric().withMessage('El campo sede_id debe ser un número'),
    EVResult, TratamientoController.save);

router.put('/:id',
    check('paciente_id').optional().isNumeric().withMessage('El campo paciente_id debe ser un número'),
    check('nombre').optional().isString().withMessage('El campo nombre debe ser un texto'),
    check('sintomas').optional().isString().withMessage('El campo sintomas debe ser un texto'),
    check('nombre_tratamiento').optional().isString().withMessage('El campo nombre_tratamiento debe ser un texto'),
    check('inicio_tratamiento').optional(),
    check('fin_tratamiento').optional(),
    check('costo_tratamiento').optional().isNumeric().withMessage('El campo costo_tratamiento debe ser un número'),
    check('dosis').optional().isString().withMessage('El campo dosis debe ser un texto'),
    check('duracion').optional().isString().withMessage('El campo duracion debe ser un texto'),
    check('resultado').optional().isString().withMessage('El campo resultado debe ser un texto'),
    check('codigo_externo').optional().isString().withMessage('El campo codigo_externo debe ser un texto'),
    check('imagen').optional().isString().withMessage('El campo imagen debe ser un texto'),
    check('activado').optional().isNumeric().withMessage('El campo activado debe ser un número'),
    check('estado').optional(),
    check('especialidad_fechareg').optional(),
    check('descripcion_corta').optional().isString().withMessage('El campo descripcion_corta debe ser un texto'),
    check('descripcion_larga').optional().isString().withMessage('El campo descripcion_larga debe ser un texto'),
    check('icono').optional().isString().withMessage('El campo icono debe ser un texto'),
    check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
    check('sede_id').optional().isNumeric().withMessage('El campo sede_id debe ser un número'),
    EVResult, TratamientoController.update);

router.delete('/:id',
    check('id').isNumeric().withMessage('El campo id debe ser un número'),
    EVResult, TratamientoController.delete);

module.exports = router;
