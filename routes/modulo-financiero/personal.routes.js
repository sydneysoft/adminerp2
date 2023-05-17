const { Router } = require("express");
const router = Router();

const { PersonalController } = require('../../controllers/modulo-financiero/personal.controller');

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

router.get("/datatable/:id?", 
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, PersonalController.datatable);
router.get("/select2/:id?", PersonalController.select2);

router.get("/", async (req, res) => {
  try {
    
    let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render("modulo-financiero/personal/superadmin", {
        dataSession,
        dataSistema,
      });
    } else if (role == 3) {
    }
    return res.render("modulo-financiero/personal/index", {
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
    return res.render("modulo-financiero/personal/index", {
      dataSession,
      dataSistema,
      empresa_id: req.params.id
    });
  } catch (error) {
    return catchError(res, error);
  }
});


router.get("/index", PersonalController.index);

router.get("/:id",
  check('id').isNumeric().withMessage('El id debe ser un numero'),
  EVResult, PersonalController.show);

router.post("/", 
  check('nombre').isString().withMessage('El nombre debe ser un texto'),
  check('tipo_documento').isString().withMessage('El tipo_documento debe ser un numero'),
  check('nro_documento').isNumeric().withMessage('El nro_documento debe ser un numero'),
  check('empresa_id').optional().isNumeric().withMessage('El empresa_id debe ser un numero'),
  EVResult, PersonalController.save);

router.put("/:id",
  check('id').isNumeric().withMessage('El id debe ser un numero'),
  check('nombre').isString().withMessage('El nombre debe ser un texto'),
  check('tipo_documento').isString().withMessage('El tipo_documento debe ser un numero'),
  check('nro_documento').isNumeric().withMessage('El nro_documento debe ser un numero'),
  check('empresa_id').optional().isNumeric().withMessage('El empresa_id debe ser un numero'),
  EVResult, PersonalController.update);

router.delete("/:id",
  check('id').isNumeric().withMessage('El id debe ser un numero'),
  EVResult, PersonalController.delete);


module.exports = router;

