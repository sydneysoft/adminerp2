const { Router } = require("express");
const router = Router();

const { MarcaController } = require('../../controllers/modulo-ecommerce/marcas.controller');

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

router.get("/datatable/:id?",
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, MarcaController.datatable);
router.get("/select2/:id?", MarcaController.select2);

router.get("/", async (req, res) => {
    try {
        let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
        if (role == 1 || role == 2) {
            return res.render("modulo-ecommerce/marcas/superadmin", {
                dataSession,
                dataSistema,
            });
        } else if (role == 3) {
        }
        return res.render("modulo-ecommerce/marcas/index", {
            dataSession,
            dataSistema,
            token
        })
    } catch (error) {
        return catchError(res, error);
    }
});

router.get("/empresa/:id", check('id').isNumeric().withMessage('El id debe ser un numero'), EVResult, async (req, res) => {
    try {
        const { dataSession, dataSistema } = await getAllDataSession(req);
        return res.render("modulo-ecommerce/marcas/index", {
            dataSession,
            dataSistema,
            empresa_id: req.params.id
        });
    } catch (error) {
        return catchError(res, error);
    }
});

router.get('/:id', check('id').isNumeric().withMessage('El id debe ser un numero'), EVResult, MarcaController.show);

router.post("/",
    check('name').optional().isString().withMessage('El nombre debe ser un texto'),
    check('categoria').optional().isNumeric().withMessage('La categoria debe ser un numero'),
    check('imagen').optional().isString().withMessage('La imagen debe ser un texto'),
    check('activado').optional().isNumeric().withMessage('El activado debe ser un numero'),
    check('destacado').optional().isNumeric().withMessage('El destacado debe ser un numero'),
    check('empresa_id').optional().isNumeric().withMessage('El empresa_id debe ser un numero'),
    EVResult, MarcaController.save);

router.put('/:id',
    check('name').optional().isString().withMessage('El nombre debe ser un texto'),
    check('categoria').optional().isNumeric().withMessage('La categoria debe ser un numero'),
    check('imagen').optional().isString().withMessage('La imagen debe ser un texto'),
    check('activado').optional().isNumeric().withMessage('El activado debe ser un numero'),
    check('destacado').optional().isNumeric().withMessage('El destacado debe ser un numero'),
    check('empresa_id').optional().isNumeric().withMessage('El empresa_id debe ser un numero'),
    EVResult, MarcaController.update);

router.delete("/:id",
    check('id').isNumeric().withMessage('El id debe ser un numero'),
    EVResult, MarcaController.delete);

module.exports = router;

