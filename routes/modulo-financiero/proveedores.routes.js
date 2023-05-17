const { Router } = require("express");
const router = Router()

const { ProveedorController } = require('../../controllers/modulo-financiero/proveedores.controller');
const { service: ProveedorService } = ProveedorController;
const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

router.get("/datatable/:id?", 
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, ProveedorController.datatable);
router.get("/select2/:id?", ProveedorController.select2);

router.get("/", async (req, res) => {
  try {

    let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      return res.render("modulo-financiero/proveedores/superadmin", {
        dataSession,
        dataSistema,
      });
    } else if (role == 3) {
    }
    return res.render("modulo-financiero/proveedores/index", {
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
    return res.render("modulo-financiero/proveedores/index", {
      dataSession,
      dataSistema,
      empresa_id: req.params.id
    });
  } catch (error) {
    return catchError(res, error);
  }
});


router.post("/",
  check("nombre").isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
  check("ruc").optional().isLength({ min: 3 }).withMessage("El ruc debe tener al menos 3 caracteres"),
  check("razon_social").optional().isLength({ min: 3 }).withMessage("La razon social debe tener al menos 3 caracteres"),
  check("telefono_corporativo").optional().isLength({ min: 3 }).withMessage("El telefono corporativo debe tener al menos 3 caracteres"),
  check("email_corporativo").optional().isEmail().withMessage("El email corporativo debe ser un email valido"),
  check("direccion").optional().isLength({ min: 3 }).withMessage("La direccion debe tener al menos 3 caracteres"),
  check("nombre_contacto").optional().isLength({ min: 3 }).withMessage("El nombre de contacto debe tener al menos 3 caracteres"),
  check("telefono_contacto").optional().isLength({ min: 3 }).withMessage("El telefono de contacto debe tener al menos 3 caracteres"),
  check("email_contacto").optional().isEmail().withMessage("El email de contacto debe ser un email valido"),
  check("empresa_id").optional().isNumeric().withMessage("El id de la empresa debe ser un numero"),
  EVResult, async (req, res) => {
    try {
      const { role, token } = await getAllDataSession(req);
      let email_corporativo = req.body.email_corporativo
      let user = [];
      const allData = matchedData(req);
      if (role == 1 || role == 2) {
        user = await ProveedorService.getTable().where({ email_corporativo }).andWhere('empresa_id', req.body.empresa_id);
      } else if (role == 3) {
        user = await ProveedorService.getTable().where({ email_corporativo }).andWhere('empresa_id', token);
        allData.empresa_id = token;
      }

      if (user.length > 0) {
        res.status(409).json({
          ok: false,
          msg: "Usuario existente"
        })
      } else {
        let dateNow = new Date();
        allData.created_at = dateNow;
        allData.updated_at = dateNow;
        const result = await ProveedorService.save(allData);

        return res.status(200).json({
          ok: true,
          result,
        });
      }
    } catch (error) {
      return catchError(res, error);
    }
  });

router.get("/:id", check('id').isNumeric().withMessage("El id debe ser un numero"), EVResult, ProveedorController.show);

router.put("/actualizar/:id",
  check("id").isNumeric().withMessage("El id debe ser un numero"),
  check("nombre").isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
  check("ruc").optional().isLength({ min: 3 }).withMessage("El ruc debe tener al menos 3 caracteres"),
  check("razon_social").optional().isLength({ min: 3 }).withMessage("La razon social debe tener al menos 3 caracteres"),
  check("telefono_corporativo").optional().isLength({ min: 3 }).withMessage("El telefono corporativo debe tener al menos 3 caracteres"),
  check("email_corporativo").optional().isEmail().withMessage("El email corporativo debe ser un email valido"),
  check("direccion").optional().isLength({ min: 3 }).withMessage("La direccion debe tener al menos 3 caracteres"),
  check("nombre_contacto").optional().isLength({ min: 3 }).withMessage("El nombre de contacto debe tener al menos 3 caracteres"),
  check("telefono_contacto").optional().isLength({ min: 3 }).withMessage("El telefono de contacto debe tener al menos 3 caracteres"),
  check("email_contacto").optional().isEmail().withMessage("El email de contacto debe ser un email valido"),
  check("empresa_id").optional().isNumeric().withMessage("El id de la empresa debe ser un numero"),
  EVResult, async (req, res) => {

    try {
      const id = req.params.id;
      const { role, token } = await getAllDataSession(req);

      let email_corporativo = req.body.email_corporativo;
      let user = [];
      const allData = matchedData(req);
      if (role == 1 || role == 2) {
        user = await ProveedorService.getTable().whereNot("id", id).andWhere({ email_corporativo }).andWhere('empresa_id', req.body.empresa_id);
      } else if (role == 3) {
        user = await ProveedorService.getTable().whereNot("id", id).andWhere({ email_corporativo }).andWhere('empresa_id', token);
        allData.empresa_id = token;
      }

      if (user.length > 0) {
        res.status(409).json({
          ok: false,
          msg: "Usuario existente"
        })
      } else {
        let dateNow = new Date();
        allData.updated_at = dateNow;
        const result = await ProveedorService.updateById(id, allData);
        return res.status(200).json({
          ok: true,
          result,
        });
      }

    } catch (error) {
      return catchError(res, error);
    }
  });

router.delete("/:id", check("id").isNumeric().withMessage("El id debe ser un numero"), EVResult, ProveedorController.delete);


module.exports = router;
