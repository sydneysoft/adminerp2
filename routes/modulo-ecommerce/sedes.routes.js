const { Router } = require("express");
const router = Router();

const { SedeController } = require('../../controllers/modulo-ecommerce/sedes.controller');

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

router.get('/datatable/:id?',
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, SedeController.datatable);
router.get('/select2/:id?', SedeController.select2);

router.get("/", async (req, res) => {
  try {
    let { role, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render("modulo-ecommerce/sedes/superadmin", {
        dataSession,
        dataSistema
      });
    }
    return res.render("modulo-ecommerce/sedes/index", {
      dataSession,
      dataSistema,
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);
    return res.render("modulo-ecommerce/sedes/index", {
      dataSession,
      dataSistema,
      empresa_id: req.params.id
    });
  } catch (error) {
    return catchError(res, error);
  }
});


router.get("/:id",
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResult, SedeController.show);

router.post("/",
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un texto'),
  check('descripcion').optional().isString().withMessage('El campo nombre debe ser un texto'),
  check('direccion').optional().isString().withMessage('El campo nombre debe ser un texto'),
  check('estado').optional(),
  check('imagen').optional().isString().withMessage('El campo nombre debe ser un texto'),
  check('telefono').optional(),
  check('celular').optional(),
  check('whatsapp').optional(),
  check('correo').optional().isEmail().withMessage('El campo correo debe ser un email'),
  check('location').optional(),
  check('horario').optional(),
  check('empresa_id').optional(),
  EVResult, SedeController.save);

router.put("/:id",
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  check('nombre').optional().isString().withMessage('El campo nombre debe ser un texto'),
  check('descripcion').optional().isString().withMessage('El campo nombre debe ser un texto'),
  check('direccion').optional().isString().withMessage('El campo nombre debe ser un texto'),
  check('estado').optional(),
  check('imagen').optional().isString().withMessage('El campo nombre debe ser un texto'),
  check('telefono').optional(),
  check('celular').optional(),
  check('whatsapp').optional(),
  check('correo').optional().isEmail().withMessage('El campo correo debe ser un email'),
  check('location').optional(),
  check('horario').optional(),
  check('empresa_id').optional(),
  EVResult, SedeController.update);

router.delete("/:id",
  check('id').isNumeric().withMessage('El campo id debe ser un número'),
  EVResult, SedeController.delete);



module.exports = router;

