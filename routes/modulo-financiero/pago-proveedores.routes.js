const { Router } = require("express");
const router = Router();

const { PagoProveedorController } = require('../../controllers/modulo-financiero/pagoproveedores.controller');

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

router.get("/datatable/:id?", 
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, PagoProveedorController.datatable);
router.get("/select2/:id?", PagoProveedorController.select2);

router.get("/", async (req, res) => {
  try {
    
    let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render("modulo-financiero/pago-proveedores/superadmin", {
        dataSession,
        dataSistema,
      });
    } else if (role == 3) {
    }
    return res.render("modulo-financiero/pago-proveedores/index", {
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
    return res.render("modulo-financiero/pago-proveedores/index", {
      dataSession,
      dataSistema,
      empresa_id: req.params.id
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get("/:id", 
  check('id').isNumeric().withMessage('El id debe ser un numero'),
  EVResult,PagoProveedorController.show);

router.post("/", 
  check('nombre_proveedor').isString().withMessage('El nombre_proveedor debe ser un texto'),
  check('insumo').optional().isString().withMessage('El insumo debe ser un texto'),
  check('cuit').optional().isString().withMessage('El cuit debe ser un texto'),
  check('monto').optional().isNumeric().withMessage('El monto debe ser un numero'),
  check('empresa_id').optional().isNumeric().withMessage('El empresa_id debe ser un numero'),
  EVResult,PagoProveedorController.save);

router.put("/:id", 
  check('id').isNumeric().withMessage('El id debe ser un numero'),
  check('nombre_proveedor').optional().isString().withMessage('El nombre_proveedor debe ser un texto'),
  check('insumo').optional().isString().withMessage('El insumo debe ser un texto'),
  check('cuit').optional().isString().withMessage('El cuit debe ser un texto'),
  check('monto').optional().isNumeric().withMessage('El monto debe ser un numero'),
  check('empresa_id').optional().isNumeric().withMessage('El empresa_id debe ser un numero'),
  EVResult,PagoProveedorController.update);

router.delete("/:id", 
  check('id').isNumeric().withMessage('El id debe ser un numero'),
  EVResult,PagoProveedorController.delete);

module.exports = router;
