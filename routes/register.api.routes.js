const { Router } = require("express");
const router = Router()
const {AuthController} = require("../controllers/auth/register.controller");
const Auth = new AuthController();

const { body, matchedData, oneOf, param, check } = require('express-validator');
const { EVResult } = require('../middlewares/EVResult.middleware');


router.post("/", 
  body("nombre").isString().withMessage("El nombre es requerido"),
  body("clave").isString().withMessage("La clave es requerida"),
  body("correo").isEmail().withMessage("El correo es requerido"),
  body("tipo_documento").isNumeric(),
  body("numero_documento").isString().withMessage("El numero de documento es requerido"),
  body("company_name").isString().withMessage("El nombre de la compañia es requerido"),
  body("categoria_id").isNumeric().withMessage("La categoria es requerida"),
  body("plan").isNumeric().withMessage("El plan es requerido"),
  body("celular_contacto").isString().withMessage("El celular de contacto es requerido"),
  EVResult, Auth.apiPostRegister);

module.exports = router;
