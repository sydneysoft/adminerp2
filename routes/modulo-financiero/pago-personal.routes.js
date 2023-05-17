const { Router } = require("express");
const router = Router();

const {PagoPersonalController} = require("../../controllers/modulo-financiero/pago-personal.controller");

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

router.get("/datatable/:id?", 
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, PagoPersonalController.datatable);
router.get("/select2/:id?", PagoPersonalController.select2);

router.get("/", async (req, res) => {
  try {
    let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render("modulo-financiero/pago-personal/superadmin", {
        dataSession,
        dataSistema,
      });
    } else if (role == 3) {
    }
    return res.render("modulo-financiero/pago-personal/index", {
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
    return res.render("modulo-financiero/pago-personal/index", {
      dataSession,
      dataSistema,
      empresa_id: req.params.id
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get("/index", PagoPersonalController.index);
router.get("/:id", PagoPersonalController.show);
router.post("/", 
  check("empresa_id").optional().isNumeric().withMessage("El id de la empresa debe ser un numero"),
  check('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
  check('tipo_documento').optional().isString().withMessage('El tipo de documento debe ser un texto'),
  check('nro_documento').optional().isString().withMessage('El numero de documento debe ser un texto'),
  check('monto').optional().isNumeric().withMessage('El monto debe ser un numero'),
  check('tipo_de_pago').optional().isString().withMessage('El tipo de pago debe ser un texto'),
  EVResult, PagoPersonalController.save);

router.put("/:id", 
  check('id').isNumeric().withMessage('El id debe ser un numero'),
  check("empresa_id").optional().isNumeric().withMessage("El id de la empresa debe ser un numero"),
  check('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
  check('tipo_documento').optional().isString().withMessage('El tipo de documento debe ser un texto'),
  check('nro_documento').optional().isString().withMessage('El numero de documento debe ser un texto'),
  check('monto').optional().isNumeric().withMessage('El monto debe ser un numero'),
  check('tipo_de_pago').optional().isString().withMessage('El tipo de pago debe ser un texto'),
  EVResult, PagoPersonalController.update);

router.delete("/:id", check('id').isNumeric().withMessage('El id debe ser un numero'), EVResult, PagoPersonalController.delete);

module.exports = router;
