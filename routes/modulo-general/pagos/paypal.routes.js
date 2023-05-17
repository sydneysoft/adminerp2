const { Router } = require("express");
const router = Router();

//Método para generar Pago Paypal
router.post("/pago-paypal/:pago", async (req, res) => {
  let pago = req.params.pago;
  try {
    let queryData = "SELECT * FROM metodos_pagos WHERE id=7";
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

    let result = await db.query(con, queryData);
    res.json({
      status: "success",
      pago: pago,
      clientId: result[0].api_key,
      url:
        BASE_URL_USER_PHOTO +
        "approve-order-payment/7/" +
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
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: "Error al realizar la transacción" });
  }
});

module.exports = router;