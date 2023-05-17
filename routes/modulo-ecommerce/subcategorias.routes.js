const { Router } = require("express");
const SubCategoriasController = require("../../controllers/modulo-ecommerce/subcategorias-trash.controller");
const router = Router()

const { MarketplaceController } = require('../../controllers/modulo-marketplace/marketplace.controller');
const { EmpresaMarketplaceController } = require('../../controllers/modulo-marketplace/empresas-marketplace.controller');
const { CategoriaController } = require('../../controllers/modulo-ecommerce/categorias.controller');
const { SubcategoriaOpcionController } = require('../../controllers/modulo-ecommerce/subcategorias-opciones.controller');
const { SubcategoriaController } = require('../../controllers/modulo-ecommerce/subcategorias.controller');

const { service: MarketplaceService } = MarketplaceController;
const { service: EmpresaMarketplaceService } = EmpresaMarketplaceController;
const { service: CategoriaService } = CategoriaController;
const { service: SubcategoriaOpcionService } = SubcategoriaOpcionController;
const { service: SubcategoriaService } = SubcategoriaController;

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

router.get("/datatable/:id?",
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, SubcategoriaController.datatable);
router.get("/select2/:id?", SubcategoriaController.select2);

router.get("/", async (req, res) => {
    try {
        const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
        if (role == 1 || role == 2) {
            return res.render("modulo-ecommerce/subcategorias/superadmin", {
                dataSession,
                dataSistema
            })
        }
        return res.render("modulo-ecommerce/subcategorias/index", {
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
        return res.render("modulo-ecommerce/subcategorias/index", {
            dataSession,
            dataSistema,
            empresa_id: req.params.id
        });
    } catch (error) {
        return catchError(res, error);
    }
});



router.post("/",
    check('nombre').isString().notEmpty().withMessage('El nombre es requerido'),
    check('categoria').isNumeric().notEmpty().withMessage('La categoria es requerida'),
    check('empresa_id').optional(),
    check('imagen').optional(),
    check('id_descuento').optional(),
    check('activado').optional(),
    EVResult, async (req, res) => {
        try {
            const role = req.session.rol_id
            const token = req.session.token;
            let checkExist = [];
            const allData = matchedData(req);
            if (role == 1 || role == 2) {
                checkExist = await SubcategoriaService.checkExistCompanyAndName(allData.empresa_id, allData.nombre);
            } else if (role == 3) {
                checkExist = await SubcategoriaService.checkExistCompanyAndName(token, allData.nombre);
                allData.empresa_id = token;
            }

            if (checkExist.length == 0) {
                await SubcategoriaService.save(allData);
                res.status(200).json({ status: "success" });
            } else {
                res.status(409).json({ error: "La subcategoria ya existe" });
            }

        } catch (error) {
            return catchError(res, error);
        }
    });

router.delete("/:id", SubcategoriaController.delete)

router.put("/:id",
    check('id').isNumeric().withMessage('El id es requerido'),
    check('nombre').isString().notEmpty().withMessage('El nombre es requerido'),
    check('categoria').isNumeric().optional(),
    check('empresa_id').optional(),
    check('imagen').optional(),
    check('id_descuento').optional(),
    check('activado').optional(),
    EVResult, async (req, res) => {
        try {
            const role = req.session.rol_id
            const token = req.session.token;
            let checkExist = [];
            const allData = matchedData(req);
            const id = req.params.id;
            if (role == 1 || role == 2) {
                checkExist = await SubcategoriaService.getTable().where('nombre', allData.nombre).andWhere('empresa_id', allData.empresa_id).andWhereNot('id', id).select(['id', 'empresa_id']);
            } else if (role == 3) {
                checkExist = await SubcategoriaService.getTable().where('nombre', allData.nombre).andWhere('empresa_id', token).andWhereNot('id', id).select(['id', 'empresa_id']);
            }
            if (checkExist.length == 0) {
                await SubcategoriaService.updateById(id, allData);
                res.status(200).json({ status: "success" });
            } else {
                res.status(409).json({ error: "La subcategoria ya existe" });
            }

        } catch (error) {
            return catchError(res, error);
        }
    });

router.post("/filtros", async (req, res) => {
    let arrayPost = req.body.valuesPost;
    let arrayEdit = req.body.valuesEdit;
    let arrayDelete = req.body.valuesDelete;

    try {
        if (arrayPost) {
            if (arrayPost.length > 0) {

                arrayPost.map(async (item) => {
                    await SubcategoriaOpcionService.save({ subcategoria: item[0], nombre: item[1] })

                })

            }
        }


        if (arrayEdit) {
            if (arrayEdit.length > 0) {


                // arrayEdit.map(async (item) => {
                //    let body= { subcategoria: item[0], nombre: item[1] }
                //     await SubcategoriaOpcionService.updateByIdAndName({ id: item[0], nombre: item[1], body })

                // })
                // let queryEdit =
                //     "INSERT INTO subcategorias_opciones (id,nombre) VALUES ? ON DUPLICATE KEY UPDATE nombre=VALUES(nombre)";
                // await db.query(con, queryEdit, [arrayEdit]);
            }
        }

        if (arrayDelete) {
            if (arrayDelete.length > 0) {

                await SubcategoriaService.deleteById(arrayDelete)
                for (let index = 0; index < arrayDelete.length; index++) {

                    await SubcategoriaOpcionService.deleteById(arrayDelete[index])
                }


                // let queryDelete = "DELETE FROM subcategorias_opciones WHERE id in (?)";
                // await db.query(con, queryDelete, [arrayDelete]);
            }
        }

        res.json({
            status: "success",
            msg: "Los Valores fueron Agregados Correctamente",
        });
    } catch (e) {
        return catchError(res, error);
    }
});
router.delete("/", async (req, res) => {
    const id = req.params.id;
    const token = req.session.token;
    try {
        await SubcategoriaService.deleteById(id);
        return res.status(200).json({
            status: "success"
        });

    } catch (error) {
        return catchError(res, error);
    }
});

// router.post("/", new SubCategoriasController().saveSubcategorias);
// router.post("/filtros", new SubCategoriasController().postFiltros);
// router.delete("/", new SubCategoriasController().deleteById);

module.exports = router;
