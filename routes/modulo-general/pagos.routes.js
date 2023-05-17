const { Router } = require("express"),
    router = Router();
    // ConfiguracionSistemaController = require("../../controllers/modulo-generales/configuracion-sistema-trash.controller");
const { authenticateJWT } = require("../../middlewares/jwt");

const {catchError, getAllDataSession, notAuthorize} = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

const {MetodoPagoController} = require('../../controllers/modulo-generales/metodos-pagos.controller');



module.exports = router;