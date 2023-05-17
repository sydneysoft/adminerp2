const { Router } = require("express"),
    router = Router();

// ModulosController = require("../../controllers/modulo-generales/modulos-trash.controller");


const { ModuloCategoriaController, ModuloController, ModuloGrupoController, ModuloHabilitadoController } = require('../../controllers/modulo-generales/modulos');

const { EmpresaUsuarioController } = require('../../controllers/modulo-marketplace/empresa-usuarios.controller');

const { RoleController } = require('../../controllers/modulo-generales/roles/roles.controller');
const { RolController } = require('../../controllers/modulo-generales/roles/rol.controller')

const { service: ModuloService } = ModuloController;
const { service: ModuloGrupoService } = ModuloGrupoController;
const { service: ModuloHabilitadoService } = ModuloHabilitadoController;
const { service: EmpresaUsuarioService } = EmpresaUsuarioController;
const { service: ModuloCategoriaService } = ModuloCategoriaController;

const { service: RoleService } = RoleController;
const { service: RolService } = RolController;

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');

const { oneOf, check, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');


router.get('/admin-modulos/datatable', ModuloController.datatable);
router.get('/admin-modulos/select2', ModuloController.select2);

router.get("/admin-modulos/categorias/datatable", ModuloCategoriaController.datatable);
router.get("/admin-modulos/categorias/select2", ModuloCategoriaController.select2);

router.get('/admin-modulos/categorias', ModuloCategoriaController.index);

router.post("/admin-modulos/categorias",
    check('nombre').isString().notEmpty().withMessage('El nombre es requerido'),
    EVResult, ModuloCategoriaController.save);

router.get("/admin-modulos/categorias/:id",
    check('id').isNumeric().withMessage('El id es requerido'),
    EVResult, ModuloCategoriaController.show);

router.put("/admin-modulos/categorias/:id",
    check('id').isNumeric().withMessage('El id es requerido'),
    check('nombre').isString().notEmpty().withMessage('El nombre es requerido'),
    EVResult, ModuloCategoriaController.update);

router.delete("/admin-modulos/categorias/:id",
    check('id').isNumeric().withMessage('El id es requerido'),
    EVResult, ModuloCategoriaController.delete);


/**
 * @caeher
 * La devuelve los modulos habilitados para la empresa
 * 
 * 1. Si es superadmin o admin devuelve todos los modulos
 * 2. Si es usuario empresa, devuelve los modulos habilitados para la empresa
 *  a. Busca empresa_id en empresa_usuarios
 *  b. Busca id_grupo en modulos_habilitados
 *  c. Busca modulos en modulos_grupo
 *  d. Busca modulos en modulos
 * 
 * NOTA: Mejorar luego para que no se hagan tantas consultas
 */
router.get("/get-modulos", async (req, res) => {
    try {
        // let id = req.params.id
        let result

        const { role, usuario_id } = await getAllDataSession(req);

        if (role) {
            if (role == 1 || role == 2) {
                result = await ModuloService.getAll();
            } else if (role == 3) {

                const empresa = await EmpresaUsuarioService.getCompany(usuario_id)

                if (!(Array.isArray(empresa) && empresa.length > 0)) {
                    throw new Error("No se encontró la empresa");
                }

                const checkIdGrupo = await ModuloHabilitadoService.checkExistModuleGroup(empresa[0].empresa_id); // selecciona id_grupo

                if (Array.isArray(checkIdGrupo) && checkIdGrupo.length > 0) {
                    const modulo_grupo = await ModuloGrupoService.getIdModulesCompany(checkIdGrupo[0].id_grupo);
                    result = await ModuloService.getModulesByCategories(modulo_grupo.map(i => i.modulos))
                }

            }

            if (Array.isArray(result) && result.length >= 0) {
                res.status(200).json({
                    status: "success",
                    modulos: result
                });

            } else {
                res.status(403);
                res.render('403');
            }
        }

    } catch (error) {
        return catchError(res, error);
    }
});


//Módulos -- Converted
router.get("/admin-modulos", async (req, res) => {
    let bookStore;
    let { token, dataSession, dataSistema } = await getAllDataSession(req);

    // let data1 = await listarTableDinamic("modulos");
    // let data2 = await listarTableDinamic("roles");
    let data1 = await ModuloService.getAll();
    let data2 = await RolService.getAll();

    if (data1.status === "error" || data2.status === "error") {
        res.json([]);
    } else {
        bookStore = { modulos: data1, roles: data2 };
        res.render("modulo-generales/modulos", {
            bookStore,
            dataSession,
            dataSistema,
        });
    }
});

router.post("/admin-modulos",
    check('categoria_id').optional().isNumeric().withMessage('El id de la categoria debe ser un número'),
    check('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
    check('url').optional().isString().withMessage('La url debe ser un texto'),
    check('icono').optional().isString().withMessage('El icono debe ser un texto'),
    check('texto').optional().isString().withMessage('El texto debe ser un texto'),
    check('orden').optional().isNumeric().withMessage('El orden debe ser un número'),
    check('fuente').optional().isString().withMessage('La fuente debe ser un texto'),
    check('activo').optional().isNumeric().withMessage('El activo debe ser un número'),
    check('nombre_componente').optional().isString().withMessage('El nombre del componente debe ser un texto'),
    check('import').optional().isString().withMessage('El import debe ser un texto'),
    check('roles').optional().isString().withMessage('Los roles deben ser un texto'),
    EVResult, ModuloController.save);

router.put("/admin-modulos/:id",
    check('id').isNumeric().withMessage('El id debe ser un número'),
    check('categoria_id').optional().isNumeric().withMessage('El id de la categoria debe ser un número'),
    check('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
    check('url').optional().isString().withMessage('La url debe ser un texto'),
    check('icono').optional().isString().withMessage('El icono debe ser un texto'),
    check('texto').optional().isString().withMessage('El texto debe ser un texto'),
    check('orden').optional().isNumeric().withMessage('El orden debe ser un número'),
    check('fuente').optional().isString().withMessage('La fuente debe ser un texto'),
    check('activo').optional().isNumeric().withMessage('El activo debe ser un número'),
    check('nombre_componente').optional().isString().withMessage('El nombre del componente debe ser un texto'),
    check('import').optional().isString().withMessage('El import debe ser un texto'),
    check('roles').optional().isString().withMessage('Los roles deben ser un texto'),
    EVResult, ModuloController.update);

router.get("/admin-modulos/:id",
    check('id').isNumeric().withMessage('El id debe ser un número'),
    EVResult, ModuloController.show);

router.delete("/admin-modulos/:id",
    check('id').isNumeric().withMessage('El id debe ser un número'),
    EVResult, ModuloController.delete);


module.exports = router;
