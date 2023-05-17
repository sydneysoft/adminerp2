const { Router } = require("express");
const router = Router()

const { CategoriaController } = require('../../controllers/modulo-ecommerce/categorias.controller');
const { MarketplaceController } = require('../../controllers/modulo-marketplace/marketplace.controller');

const { service: CategoriaService } = CategoriaController;
const { service: MarketplaceService } = MarketplaceController;

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

router.get('/datatable/:id?',
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, CategoriaController.datatable);
router.get('/select2/:id?', CategoriaController.select2);

router.get('/', async (req, res) => {
    try {
        let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
        if (role == 1 || role == 2) {
            return res.render('modulo-ecommerce/categorias/superadmin', {
                dataSession,
                dataSistema,
            });
        }
        return res.render("modulo-ecommerce/categorias/index", {
            dataSession,
            dataSistema
        });

    } catch (error) {
        return catchError(res, error);
    }
});

router.get("/empresa/:id", check('id').isNumeric().withMessage("El id debe ser un numero"), EVResult, async (req, res) => {
    try {
        const { dataSession, dataSistema } = await getAllDataSession(req);
        return res.render("modulo-ecommerce/categorias/index", {
            dataSession,
            dataSistema,
            empresa_id: req.params.id
        });
    } catch (error) {
        return catchError(res, error);
    }
});

router.get('/first', async (req, res) => {
    const token = req.session.token;
    let bookStore = await CategoriaService.getCategoriesByCompanyFull(token)
    if (!bookStore.length) {
        bookStore = [{
            name: "Electrónica",
            description: "",
            imagen: "",
            activado: 1,
            empresa_id: token
        },
        {
            name: "TV, Audio y Foto",
            description: "",
            imagen: "",
            activado: 1,
            empresa_id: token
        },
        {
            name: "Higiene y Limpieza",
            description: "",
            imagen: "",
            activado: 1,
            empresa_id: token
        },
        {
            name: "Mascotas",
            description: "",
            imagen: "",
            activado: 1,
            empresa_id: token
        },
        {
            name: "Electrodomesticos",
            description: "",
            imagen: "",
            activado: 1,
            empresa_id: token
        }, {
            name: "Prendas",
            description: "",
            imagen: "",
            activado: 1,
            empresa_id: token
        }
        ]
        await CategoriaService.save(bookStore)
    }
});
router.get("/categorias", CategoriaController.index);

router.get('/:id', check('id').isNumeric().withMessage("El id debe ser un número"), EVResult, CategoriaController.show);

router.post("/",
    check('name').notEmpty().withMessage('El nombre es requerido'),
    check('description').optional().isString().withMessage('La descripción debe ser un texto'),
    check('imagen').optional(),
    check('fechadesde').optional(),
    check('fechahasta').optional(),
    check('activado').optional(),
    check('orden').optional(),
    check('destacado').optional(),
    check('icono').optional(),
    check('navbar').optional(),
    check('id_descuento').optional(),
    check('empresa_id').optional(),
    EVResult, async (req, res) => {
        try {
            const role = req.session.rol_id
            const token = req.session.token;
            let result
            let checkExist
            if (role == 1 | role == 2) {
                checkExist = await CategoriaService.checkExistCompanyAndNameCateg(req.body.empresa_id, req.body.name)
            } else if (role == 3) {
                checkExist = await CategoriaService.checkExistCompanyAndNameCateg(token, req.body.name)
            }
            if (!checkExist.length) {
                const allData = matchedData(req);
                if (role == 1 || role == 2) {
                } else if (role == 3) {
                    if (!req.body.empresa_id) {
                        allData.empresa_id = token;
                    }
                }
                result = await CategoriaService.save(allData);
                res.status(200).json({ ok: true });
            } else {
                res.status(409).json({ msg: "La categoria ya existe" });
            }

        } catch (error) {
            return catchError(req, error);
        }
    });

router.put('/:id',
    check('name').notEmpty().withMessage('El nombre es requerido'),
    check('description').optional().isString().withMessage('La descripción debe ser un texto'),
    check('imagen').optional().isString().withMessage('La imagen debe ser un texto'),
    check('fechadesde').optional(),
    check('fechahasta').optional(),
    check('activado').optional(),
    check('orden').optional(),
    check('destacado').optional(),
    check('icono').optional(),
    check('navbar').optional(),
    check('id_descuento').optional(),
    check('empresa_id').optional(),
    EVResult, async (req, res) => {
        try {
            const role = req.session.rol_id
            const token = req.session.token;
            const id = req.params.id;
            let checkExist = [];
            if (role == 1 || role == 2) {
                checkExist = await CategoriaService.getTable().where('name', req.body.name).andWhere('empresa_id', req.body.empresa_id).andWhereNot('id', id).select(['id', 'empresa_id']);
            } else if (role == 1) {
                checkExist = await CategoriaService.getTable().where('name', req.body.name).andWhere('empresa_id', token).andWhereNot('id', id).select(['id', 'empresa_id']);
            }
            if (checkExist.length == 0) {
                const allData = matchedData(req);
                await CategoriaService.updateById(id, allData);
                res.status(200).json({ ok: true });
            } else {
                res.status(409).json({ msg: "La categoria ya existe" });
            }
        } catch (error) {
            return catchError(res, error);
        }
    });

router.delete('/:id', check('id').isNumeric().withMessage("El id debe ser un número"), EVResult, CategoriaController.delete);

module.exports = router;
