const { Router } = require("express");
const router = Router();

const { VentanaEmergenteController } = require("../../controllers/modulo-generales/ventanas-emergenter.controller");


// const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, body, param, query } = require('express-validator');
const { EVResult, EVResultView } = require('../../middlewares/EVResult.middleware');

const VentanaEmergente = new VentanaEmergenteController();

router.get("/datatable/:id?", VentanaEmergente.datatable);
router.get("/select2/:id?", VentanaEmergente.select2);

router.get("/", EVResultView, VentanaEmergente.renderHomeView);

router.get("/empresa/:id", EVResultView, VentanaEmergente.renderSuperadminHomeView);


router.get("/", VentanaEmergente.index);

router.get("/:id",
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, VentanaEmergente.show);

router.post("/",
  body('empresa_id').optional().isNumeric().withMessage('El id debe ser un número'),
  body('imagen').optional().isString().withMessage('El id debe ser un número'),
  body('url').optional().isString().withMessage('El id debe ser un número'),
  body('estado').optional().isNumeric().withMessage('El id debe ser un número'),
  EVResult, VentanaEmergente.save);

router.put("/:id",
  check('id').isNumeric().withMessage('El id debe ser un número'),
  body('empresa_id').optional().isNumeric().withMessage('El id debe ser un número'),
  body('imagen').optional().isString().withMessage('El id debe ser un número'),
  body('url').optional().isString().withMessage('El id debe ser un número'),
  body('estado').optional().isNumeric().withMessage('El id debe ser un número'),
  EVResult, VentanaEmergente.update);

router.delete("/:id",
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, VentanaEmergente.delete);


module.exports = router;
