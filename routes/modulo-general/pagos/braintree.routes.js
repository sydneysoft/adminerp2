const { Router } = require("express");
const router = Router();

//Método para crear Pago con Braintree
router.post("/pago-braintree", async (req, res) => {
  try {
    let queryData = "SELECT * FROM metodos_pagos WHERE id=9";
    let result = await db.query(con, queryData);
    const gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: result[0].merchant_id,
      publicKey: result[0].token,
      privateKey: result[0].api_key,
    });
    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        console.log(err);
        res.json({
          status: "error",
          msg: "Ocurrió un error interno intentalo nuevamente.",
        });
      } else {
        res.json({ status: "success", token_client: response.clientToken });
      }
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: "error",
      msg: "Ocurrió un error interno intentalo nuevamente.",
    });
  }
});

//Checkout Braintree
router.post("/checkout/:pago", async (req, res) => {
  let pago = req.params.pago;
  pago = pago + "00";
  pago = parseFloat(pago);
  try {
    let carrito = req.body.carrito;
    let token = req.body.token;
    let valor_servicio = req.body.valor_servicio;
    let valor_envio = req.body.valor_envio;
    let direccion_entrega = req.body.valorAddress;
    let valor_pago_general = req.body.sumaTotal;
    //Crear Url de Registro Para el Pedido Temporal
    var id_array = [];
    var cantidad_array = [];
    var precios_array = [];
    for (let i = 0; carrito.length > i; i++) {
      id_array.push(carrito[i].id);
      cantidad_array.push(carrito[i].cantidad);
      precios_array.push(carrito[i].precio);
    }
    id_array = id_array.join(",");
    cantidad_array = cantidad_array.join(",");
    precios_array = precios_array.join(",");

    let queryData = "SELECT * FROM metodos_pagos WHERE id=9";
    let result = await db.query(con, queryData);
    const gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: result[0].merchant_id,
      publicKey: result[0].token,
      privateKey: result[0].api_key,
    });

    // Use the payment method nonce here
    const nonceFromTheClient = req.body.paymentMethodNonce;
    // Create a new transaction
    gateway.transaction.sale(
      {
        amount: pago,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true,
        },
      },
      (error, result) => {
        if (result) {
          res.json({
            status: "success",
            data: result,
            url:
              BASE_URL_USER_PHOTO +
              "approve-order-payment/9/" +
              valor_pago_general +
              "/" +
              direccion_entrega +
              "/" +
              token +
              "/" +
              valor_servicio +
              "/" +
              valor_envio +
              "/" +
              id_array +
              "/" +
              precios_array +
              "/" +
              cantidad_array,
          });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: "Error al ejecutar la petición" });
  }
});


module.exports = router;