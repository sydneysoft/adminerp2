const { Router } = require("express");
const router = Router();
// ConfiguracionSistemaController = require("../../controllers/modulo-generales/configuracion-sistema-trash.controller");
const { authenticateJWT } = require("../../../middlewares/jwt");
const CryptoJS = require("crypto-js");

const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { check, matchedData } = require('express-validator');
const { EVResult } = require('../../../middlewares/EVResult.middleware');

const { MetodoPagoController } = require('../../../controllers/modulo-generales/metodos-pagos.controller');

const { service: MetodoPagoService } = MetodoPagoController;

const {SECRET} = require('../../../config/config')

router.get('/datatable/:id?', MetodoPagoController.datatable);
router.get('/select2/:id?', MetodoPagoController.select2);

router.get("/", async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.render("modulo-generales/metodos-pagos/superadmin", {
        dataSession,
        dataSistema
      })
    }

    return res.render("modulo-generales/metodos-pagos", {
      dataSession,
      dataSistema
    });
  } catch (error) {
    return catchError(res, error);
  }
});


router.post("/:empresa_id?", 
check('estado').optional(),
check('api_key').optional().isString().withMessage('La api key es requerida'),
check('token').optional().isString().withMessage('El token es requerido'),
check('merchant_id').optional(),
check('nombre').optional().isString().withMessage('El nombre es requerido'),
check('metodo_id').optional().isNumeric().withMessage('El metodo de pago es requerido'),
check('empresa_id').optional(),
EVResult,async (req, res) => {
  
  try {
    const allData = matchedData(req);
 
    const { role, token } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      allData.empresa_id = req.params.empresa_id;
    } else if (role == 3) {
      allData.empresa_id = token;
    }

    const check = await MetodoPagoService.checkExistCompanyAndMethod(allData.empresa_id, req.body.metodo_id);
    let result;
    if (check != undefined && Array.isArray(check) && check.length > 0) {

      // let token, decryptd_token;
      // let cliente, decryptd_cliente;
      // if (check[0].token) {
      //   token = CryptoJS.AES.decrypt(check[0].token, SECRET);
      //   decryptd_token = token.toString(CryptoJS.enc.Utf8);
      // }
      // if (check[0].api_key) {
      //   cliente = CryptoJS.AES.decrypt(check[0].api_key, SECRET);
      //   decryptd_cliente = cliente.toString(CryptoJS.enc.Utf8);
      // }

      if (check[0].api_key == allData.api_key) {
        console.log("HOLA");
        delete allData.api_key;
      }
      if (check[0].token == allData.token) {
        delete allData.token;
      }

      // Encriptar los token y api_key
      if (allData.token) {
        allData.token = CryptoJS.AES.encrypt(
          allData.token,
          SECRET
        ).toString();
      }
    
      if (allData.api_key) {
        allData.api_key = CryptoJS.AES.encrypt(
          allData.api_key,
          SECRET
        ).toString();
      }
      
      result = await MetodoPagoService.updateByCompanyIdAndMethod(allData.empresa_id, req.body.metodo_id, allData)
    } else {
      result = await MetodoPagoService.save(allData)
    }

    res.json({
      ok: true,
      msg: "Pasarela actualizada correctamente",
    });

  } catch (error) {
    return catchError(res, error);
  }

})

router.get("/empresa/:id", async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);

    return res.render("modulo-generales/metodos-pagos", {
      dataSession,
      dataSistema,
      empresa_id: req.params.id
    });

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/pagos/:empresa_id?', async (req, res) => {
  try {
    const { role, token } = await getAllDataSession(req);

    let result = [];
    if (role == 1 || role == 2) {
      const empresa_id = req.params.empresa_id;
      result = await MetodoPagoService.getbyCompany(empresa_id);
    } else if (role == 3) {
      result = await MetodoPagoService.getbyCompany(token);
    }

    return res.json({
      ok: true,
      data: result
    });

  } catch (error) {
    return catchError(res, error);
  }
});

//Registrar Pagos y Compras del Producto
router.post(
  "/approve-order-payment-data/:method/:pago_total/:direccion/:token/:valor_servicio/:valor_envio/:id_array/:precios_array/:cantidad_array/:securityToken/:amount/:purchaseNumber",
  async (req, res) => {
    try {
      const securityToken = req.params.securityToken;
      const amount = req.params.amount;
      const { transactionToken, channel } = req.body;
      const purchaseNumber = req.params.purchaseNumber;

      let queryData = "SELECT * FROM metodos_pagos WHERE id=11";
      let result = await db.query(con, queryData);
      const visa = new VisaNet({
        user: result[0].api_key,
        password: result[0].token,
        merchantId: result[0].merchant_id,
        env: "prod",
      });

      const body = {
        antifraud: null,
        captureType: "manual",
        channel,
        countable: true,
        order: {
          amount: amount,
          currency: visa.currency,
          purchaseNumber,
          tokenId: transactionToken,
        },
      };

      const payload = await visa.getAuthorization(securityToken, body);
      if (payload.dataMap.STATUS === "Authorized") {
        let metodo_pago = req.params.method;
        let token_pago_user = req.params.token;
        let valor_servicio = req.params.valor_servicio;
        let valor_envio = req.params.valor_envio;
        let id_array = req.params.id_array;
        let precios_array = req.params.precios_array;
        let cantidad_array = req.params.cantidad_array;
        let direccion_entrega = req.params.direccion;
        let suma_total_all = req.params.pago_total;

        if (
          direccion_entrega &&
          metodo_pago &&
          token_pago_user &&
          valor_servicio &&
          valor_envio &&
          id_array &&
          precios_array &&
          cantidad_array
        ) {
          id_array = id_array.split(",");
          precios_array = precios_array.split(",");
          cantidad_array = cantidad_array.split(",");

          let queryInsertPedido =
            "INSERT INTO pedidos (usuario,tipo_pago,valor_servicio,valor_env,direccion_entrega,suma_subtotal) VALUES" +
            " (" +
            token_pago_user +
            "," +
            metodo_pago +
            "," +
            valor_servicio +
            "," +
            valor_envio +
            "," +
            direccion_entrega +
            ",'" +
            suma_total_all +
            "')";
          let resultQuery = await db.query(con, queryInsertPedido);
          if (resultQuery.insertId) {
            let finalArrayDataInsert = [];
            for (let i = 0; precios_array.length > i; i++) {
              finalArrayDataInsert.push([
                id_array[i],
                resultQuery.insertId,
                parseFloat(cantidad_array[i]),
                parseFloat(precios_array[i]),
              ]);
            }
            let queryData2 =
              "INSERT INTO pedido_productos (id_producto,id_pedido,cantidad,precio) VALUES ?";
            await db.query(con, queryData2, [finalArrayDataInsert]);

            res.redirect(BASE_URL_CLIENTE + "mis-pedidos");
          } else {
            res.json("Error al registrar tu pedido.");
          }
        } else {
          res.json({
            status: "error",
            msg: "Las variables no estan inicializadas para el procesamiento",
          });
        }
      } else {
        res.json(
          "Ocurrió un error interno y no se pudo completar el pago correctamente"
        );
      }
    } catch (e) {

      res.json(
        "Ocurrió un error interno y no se pudo completar el pago correctamente"
      );
    }
  }
);


//Registrar Pagos y Compras del Producto
router.get(
  "/approve-order-payment/:method/:pago_total/:direccion/:token/:valor_servicio/:valor_envio/:id_array/:precios_array/:cantidad_array",
  async (req, res) => {
    try {
      let metodo_pago = req.params.method;
      let token_pago_user = req.params.token;
      let valor_servicio = req.params.valor_servicio;
      let valor_envio = req.params.valor_envio;
      let id_array = req.params.id_array;
      let precios_array = req.params.precios_array;
      let cantidad_array = req.params.cantidad_array;
      let direccion_entrega = req.params.direccion;
      let suma_total_all = req.params.pago_total;

      if (
        direccion_entrega &&
        metodo_pago &&
        token_pago_user &&
        valor_servicio &&
        valor_envio &&
        id_array &&
        precios_array &&
        cantidad_array
      ) {
        id_array = id_array.split(",");
        precios_array = precios_array.split(",");
        cantidad_array = cantidad_array.split(",");

        let queryInsertPedido =
          "INSERT INTO pedidos (usuario,tipo_pago,valor_servicio,valor_env,direccion_entrega,suma_subtotal) VALUES" +
          " (" +
          token_pago_user +
          "," +
          metodo_pago +
          "," +
          valor_servicio +
          "," +
          valor_envio +
          "," +
          direccion_entrega +
          ",'" +
          suma_total_all +
          "')";
        let resultQuery = await db.query(con, queryInsertPedido);
        if (resultQuery.insertId) {
          let finalArrayDataInsert = [];
          for (let i = 0; precios_array.length > i; i++) {
            finalArrayDataInsert.push([
              id_array[i],
              resultQuery.insertId,
              parseFloat(cantidad_array[i]),
              parseFloat(precios_array[i]),
            ]);
          }
          let queryData2 =
            "INSERT INTO pedido_productos (id_producto,id_pedido,cantidad,precio) VALUES ?";
          await db.query(con, queryData2, [finalArrayDataInsert]);

          res.redirect(BASE_URL_CLIENTE + "mis-pedidos");
        } else {
          res.json("Error al registrar tu pedido.");
        }
      } else {
        res.json({
          status: "error",
          msg: "Las variables no estan inicializadas para el procesamiento",
        });
      }
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
);


module.exports = router;