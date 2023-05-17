const { Router } = require("express");
const router = Router();
// RegistroController = require("../../controllers/modulo-usuarios/registro.controller");
const { RegistroController } = require("../../controllers/modulo-usuarios/registro.controller");
const Registro = new RegistroController();

const { body, param, check } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

// Las siguientes 3 rutas comentadas pendientes de revision sobre que hacen
// router.get("/:id", new StockController().getById);
// router.put("/:id", new StockController().update);
// router.delete("/:id", new StockController().deleteById);

// ***********************************************************************

// Solo renderiza la vista de registro
router.get("/", Registro.renderRegistro);

/**
 * Renderiza las membresias, no encontre en la db la tabla de membresias
 */
router.get('/membresia/:id',
    check('id').isNumeric().withMessage('El id debe ser un número'),
    EVResult, Registro.renderMembresia);


/**
 * Ruta para registrar usuarios 
 */
router.post('/',
    body('nombre').isString(),
    body('clave').isString(),
    body('correo').isEmail(),
    body('tipo_documento').isString(),
    body('numero_documento').isString(),
    EVResult, Registro.apiSave);

/**
 * Luego revisar esta ruta porque si se envian empresa_id y usuario_id se crea el registro en la tabla empresas_registradas_categorias
 */
router.post('/categoria',
    body('empresa_id').isNumeric(),
    body('categoria').isString(),
    EVResult, Registro.apiSaveCategoria);

/**
 * Crea la relacion entre empresa_usuarios
 */
router.post('/empresa-usuario',
    body('empresa_id').isNumeric(),
    body('usuario_id').isNumeric(),
    EVResult, Registro.apiSaveCompanyUsuario);

/**
 * Crea el registro en la tabla empresas_marketplace
 */
router.post('/empresa',
    body('nombre').isString(),
    body('email_corporativo').isEmail(),
    body('nombre_contacto').isString(),
    body('celular_contacto').isString(),
    body('plan').isNumeric(),
    body('categoria_id').isNumeric(),
    EVResult, Registro.apiSaveAsCompany);

module.exports = router;
