const { Router } = require("express");
const router = Router();

const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { check, body } = require("express-validator");

const {MetodoEnvioController, MetodoEnvioVicunladoController} = require("../../../controllers/modulo-generales/shipping");

const { service: MetodoEnvioVinculadoService } = MetodoEnvioVicunladoController;

router.get("/datatable/:id?", MetodoEnvioController.datatable);
router.get("/select2/:id?", MetodoEnvioController.select2);
router.get("/select-pure/:id?", MetodoEnvioController.selectPure);

router.get("/", async (req, res) => {

  try {
    let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    let countries;

    if (role == 1 || role == 2) {
      return res.render("modulo-generales/shipping/metodos-envio/superadmin", {
        dataSession,
        dataSistema
      });
    } 

    return res.render("modulo-generales/shipping/metodos-envio", {
      dataSession,
      dataSistema,
    });

  } catch (error) {
    return catchError(req, error);
  }
});

router.get("/empresa/:id", async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);
    return res.render("modulo-generales/shipping/metodos-envio", {
      dataSession,
      dataSistema,
      empresa_id: req.params.id,
    });
  } catch (error) {
    return catchError(res, error);
  }
});


// La siguiente ruta se reizo de ./routes/miscelaneos.routes.js /add-values-methods
router.post("/add-values-methods", async (req, res) => {
  try {

    let {role, token} = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      token = req.body.empresa_id;
    }

    let arrayPost = req.body.valuesPost;
    let arrayEdit = req.body.valuesEdit;
    let arrayDelete = req.body.valuesDelete;
    
    if (arrayPost) {
      if (arrayPost.length > 0) {
        const data_post = arrayPost.map((item) => {
          return {
            metodo: item[0],
            precio: item[1],
            region: item[2],
            tiempo: item[3],
            empresa_id: token
          }
        });
        await MetodoEnvioVinculadoService.save(data_post);
      }
    }

    if (arrayEdit) {
      if (arrayEdit.length > 0) {
        const data_edit = arrayEdit.map((item) => {
          return {
            id: item[0],
            metodo: item[1],
            precio: item[2],
            region: item[3],
            tiempo: item[4],
            empresa_id: token
          } 
        })
        for (let i = 0; i < data_edit.length; i++) {          
          await MetodoEnvioVinculadoService.updateById(data_edit[i].id, data_edit[i]);
        }
      }
    }

    if (arrayDelete) {
      if (arrayDelete.length > 0) {
        await MetodoEnvioVinculadoService.deleteBy().whereIn("id", arrayDelete);
      }
    }

    res.json({
      ok: true,
      msg: "Los Valores fueron Agregados Correctamente",
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.post("/", 
  body('nombre').isString().notEmpty().withMessage('El nombre es requerido'),
  body("activado").isNumeric().notEmpty().withMessage("El estado es requerido"),
  body("empresa_id").optional().isNumeric().withMessage("La empresa es requerida"),
  EVResult, MetodoEnvioController.save);

router.get("/:id",  
  check('id').isNumeric().notEmpty().withMessage('El id es requerido'),
EVResult, MetodoEnvioController.show);

router.put("/:id",
  check('id').isNumeric().notEmpty().withMessage('El id es requerido'),
  body('nombre').isString().notEmpty().withMessage('El nombre es requerido'),
  body("activado").isNumeric().notEmpty().withMessage("El estado es requerido"),
  body("empresa_id").optional().isNumeric().withMessage("La empresa es requerida"),
EVResult, MetodoEnvioController.update);

router.delete("/:id",
  check('id').isNumeric().notEmpty().withMessage('El id es requerido'),
  EVResult, MetodoEnvioController.delete);

module.exports = router;