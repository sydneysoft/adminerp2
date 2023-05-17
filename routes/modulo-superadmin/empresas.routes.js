const { Router } = require("express");
const router = Router()

const { EmpresaMarketplaceController } = require('../../controllers/modulo-superadmin/empresas-marketplace.controller');


const { EVResult, EVResultView } = require("../../middlewares/EVResult.middleware");
const { query, check, param, body } = require("express-validator");


const EmpresaMarketplace = new EmpresaMarketplaceController();

router.get('/datatable', EmpresaMarketplace.datatable);
router.get('/select2', EmpresaMarketplace.select2);

router.get("/", EmpresaMarketplace.renderHome);

// Muestra los modulos habilitador por empresa
router.get("/modulos-habilitados/:empresa_id",
param('empresa_id').isNumeric().withMessage('El id debe ser un número entero'),
EVResult, EmpresaMarketplace.apiModulosHabilitados);

router.post("/",
  body('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
  body('razon_social').optional().isString().withMessage('La razón social debe ser un texto'),
  body('whatsapp_corporativo').optional().isString().withMessage('El whatsapp corporativo debe ser un texto'),
  body('facebook_corporativo').optional().isString().withMessage('El facebook corporativo debe ser un texto'),
  body('youtube_corporativo').optional().isString().withMessage('El youtube corporativo debe ser un texto'),
  body('twitter_corporativo').optional().isString().withMessage('El twitter corporativo debe ser un texto'),
  body('instagram_corporativo').optional().isString().withMessage('El instagram corporativo debe ser un texto'),
  body('email_corporativo').optional().isEmail().withMessage('El email corporativo debe ser un email'),
  body('direccion').optional().isString().withMessage('La dirección debe ser un texto'),
  body('nombre_contacto').optional().isString().withMessage('El nombre de contacto debe ser un texto'),
  body('celular_contacto').optional().isString().withMessage('El celular de contacto debe ser un texto'),
  body('email_contacto').optional().isEmail().withMessage('El email de contacto debe ser un email'),
  body("contrasena").optional().isString().withMessage("La contraseña debe ser un texto"),
  EVResult, EmpresaMarketplace.apiSave);

router.get("/:id", EmpresaMarketplace.show);

router.put("/actualizar/:id",
  param('id').isNumeric().withMessage('El id debe ser un número entero'),
  body('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
  body('razon_social').optional().isString().withMessage('La razón social debe ser un texto'),
  body('whatsapp_corporativo').optional().isString().withMessage('El whatsapp corporativo debe ser un texto'),
  body('facebook_corporativo').optional().isString().withMessage('El facebook corporativo debe ser un texto'),
  body('youtube_corporativo').optional().isString().withMessage('El youtube corporativo debe ser un texto'),
  body('twitter_corporativo').optional().isString().withMessage('El twitter corporativo debe ser un texto'),
  body('instagram_corporativo').optional().isString().withMessage('El instagram corporativo debe ser un texto'),
  body('email_corporativo').optional().isEmail().withMessage('El email corporativo debe ser un email'),
  body('direccion').optional().isString().withMessage('La dirección debe ser un texto'),
  body('nombre_contacto').optional().isString().withMessage('El nombre de contacto debe ser un texto'),
  body('celular_contacto').optional().isString().withMessage('El celular de contacto debe ser un texto'),
  body('email_contacto').optional().isEmail().withMessage('El email de contacto debe ser un email'),
  EVResult, EmpresaMarketplace.update);

router.delete("/:id",
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, EmpresaMarketplace.delete);

router.post("/categoria", 
body("empresa_id").isNumeric().withMessage("El id de la empresa debe ser un número"),
body("modulos"),
EVResult,EmpresaMarketplace.apiSaveCategoria);

router.get("/categoria/:id",
param('id').isNumeric().withMessage('El id debe ser un número entero'),
EVResult, EmpresaMarketplace.apiGetCategoria);

router.delete("/categoria/:id",
param('id').isNumeric().withMessage('El id debe ser un número entero'),
EVResult, EmpresaMarketplace.apiDeleteCategoria);



module.exports = router;
