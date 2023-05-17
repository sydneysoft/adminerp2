const { Router } = require("express");
const FiltrosController = require("../../controllers/modulo-ecommerce/filtros.controller"),
    router = Router()

const { FiltroController, GrupoFiltroController } = require('../../controllers/modulo-ecommerce/filtros');
const { FiltroProductoController } = require('../../controllers/modulo-ecommerce/productos/filtros-productos.controller');

const { service: FiltroService } = FiltroController;
const { service: GrupoFiltroService } = GrupoFiltroController;
const { service: FiltroProductoService } = FiltroProductoController;

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, body, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');


router.get("/datatable/:id?", FiltroController.datatable);
router.get("/select2/:id?", FiltroController.select2);

router.get('/grupo/datatable/:id?', GrupoFiltroController.datatable);
router.get('/grupo/select2/:id?', GrupoFiltroController.select2);

router.post("/grupo", 
check('categoria').isNumeric().withMessage('Debe seleccionar una categoría'),
check('nombre').isLength({ min: 1 }).withMessage('Debe ingresar un nombre'),
body('empresa_id').optional().isNumeric().withMessage('Debe seleccionar una empresa'),
EVResult,GrupoFiltroController.save);

router.get("/", async (req, res) => {
    try {
        let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
        if (role == 1 || role == 2) {
            token = 0;
            return res.render("modulo-ecommerce/filtros/superadmin", {
                dataSession,
                dataSistema
            });
        }
        return res.render("modulo-ecommerce/filtros/index", {
            dataSession,
            dataSistema
        });
    } catch (error) {
        return catchError(res, error);
    }
});

router.get("/empresa/:id", async (req, res) => {
    try {
        const { dataSession, dataSistema } = await getAllDataSession(req);

        return res.render("modulo-ecommerce/filtros/index", {
            dataSession,
            dataSistema,
            empresa_id: req.params.id
        });
    } catch (error) {
        return catchError(res, error);
    }
});


router.get("/", new FiltrosController().getFilters);


router.get("/:id", FiltroController.show);
router.put("/:id", FiltroController.update);
router.delete("/:id", FiltroController.delete);
router.post("/", FiltroController.save);

/**
 * @route   POST api/filtros/many
 * @desc    Eliminar muchos filtros
 * @params  ids
 * @return  {ok: true, msg: 'Filtros eliminados correctamente'}
 */
router.delete("/many",
    check('ids').isArray().withMessage('Debe enviar un array de ids'),
    EVResult, async (req, res) => {
        try {
            const { ids } = req.body;
            const { role, token } = await getAllDataSession(req);
            const numericIds = ids.filter(id => !isNaN(id));

            if (role == 1 || role == 2) {
                if (numericIds.length > 0) {
                    await FiltroService.deleteBy().whereIn('id', numericIds);
                    await FiltroProductoService.deleteBy().whereIn('filtro_id', numericIds);
                }
            } else if (role == 3) {
                if (numericIds.length > 0) {
                    await FiltroService.deleteBy().where('empresa_id', token).andWhereIn('id', numericIds);
                    await FiltroProductoService.deleteBy().where('empresa_id', token).andWhereIn('filtro_id', numericIds);
                }
            }

            return res.json({
                ok: true,
                msg: 'Filtros eliminados correctamente'
            })

        } catch (error) {
            return catchError(res, error);
        }
    });

/**
 * @route   PUT admin-filtros/many
 * @desc    Guardar muchos filtros
 * @params  filtros
 * @return  {ok: true, msg: 'Filtros actualizados correctamente', result}
 */
router.put("/many",
    check('filtros').isArray().withMessage('Debe enviar un array de filtros'),
    body('empresa_id').optional().isNumeric().withMessage('Debe enviar un id de empresa válido'),
    EVResult, async (req, res) => {
        try {
            const { role, token } = await getAllDataSession(req);
            const allData = matchedData(req);

            // Filtro para solo obtener el name
            const filtrosInsert = allData.filtros.map(filtro => {
                if (role == 1 || role == 2 && !isNaN(allData.empresa_id)) {
                    return {
                        name: filtro.name,
                        empresa_id: allData.empresa_id
                    }
                } else if (role == 3) {
                    return {
                        name: filtro.name,
                        empresa_id: token
                    }
                }
                return { name: filtro.name }
            })
            // si los campos empresa_id y el name ya existe, se actualiza, si no, se inserta
            const result = await FiltroService.saveBy().insert(filtrosInsert).onConflict(['name', 'empresa_id']).merge();



            return res.json({
                ok: true,
                msg: 'Filtros actualizados correctamente',
                result
            });
        } catch (error) {
            return catchError(res, error);
        }
    });

/**
 * @route   POST admin-filtros/many
 * @desc    Guardar muchos filtros
 * @params  filtros
 * @return  {ok: true, msg: 'Filtros actualizados correctamente', result}
 */
router.post("/many",
    check('filtros').isArray().withMessage('Debe enviar un array de filtros'),
    EVResult, async (req, res) => {
        try {
            const { role, token } = await getAllDataSession(req);
            const allData = matchedData(req);

            // Filtro para solo obtener el name
            const filtrosInsert = allData.filtros.map(filtro => {
                if (role == 1 || role == 2 && !isNaN(allData.empresa_id)) {
                    return {
                        name: filtro.name,
                        empresa_id: allData.empresa_id
                    }
                } else if (role == 3) {
                    return {
                        name: filtro.name,
                        empresa_id: token
                    }
                }
                return { name: filtro.name }
            })
            // si los campos empresa_id y el name ya existe, se actualiza, si no, se inserta
            const result = await FiltroService.saveBy().insert(filtrosInsert).onConflict(['name', 'empresa_id']).merge();

            return res.json({
                ok: true,
                msg: 'Filtros guardados correctamente',
                result
            });
        } catch (error) {
            return catchError(res, error);
        }
    });


module.exports = router;

